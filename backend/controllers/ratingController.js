const { Rating, Booking, Provider, User, Service } = require('../models');
const { Op } = require('sequelize');
const { sendSuccess, sendError, sendNotFound, sendPaginated } = require('../utils/responseHelper');

// Create rating
const createRating = async (req, res) => {
  try {
    const { booking_id, rating, review } = req.body;
    
    // Check if booking exists and belongs to user
    const booking = await Booking.findByPk(booking_id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    
    if (booking.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to rate this booking',
      });
    }
    
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed bookings',
      });
    }
    
    // Check if already rated
    const existingRating = await Rating.findOne({ where: { booking_id } });
    
    if (existingRating) {
      return res.status(409).json({
        success: false,
        message: 'This booking has already been rated',
      });
    }
    
    // Create rating
    const newRating = await Rating.create({
      booking_id,
      user_id: req.user.id,
      provider_id: booking.provider_id,
      service_id: booking.service_id,
      rating,
      review,
    });
    
    // Update provider rating average
    const provider = await Provider.findByPk(booking.provider_id);
    const allRatings = await Rating.findAll({
      where: { provider_id: booking.provider_id },
    });
    
    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    
    await provider.update({
      rating_avg: avgRating,
      rating_count: allRatings.length,
    });
    
    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: { rating: newRating },
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating rating',
      error: error.message,
    });
  }
};

// Get provider reviews (Provider only)
const getMyReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort_by = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    
    // Get provider_id from authenticated user
    const providerId = req.user.provider_id;
    
    if (!providerId) {
      return sendError(res, {
        message: 'provider_profile_not_found',
        statusCode: 404,
        language: req.language
      });
    }
    
    // Build order clause
    let orderClause = [];
    if (sort_by === 'rating') {
      orderClause = [['rating', order === 'ASC' ? 'ASC' : 'DESC'], ['created_at', 'DESC']];
    } else if (sort_by === 'created_at') {
      orderClause = [['created_at', order === 'ASC' ? 'ASC' : 'DESC']];
    } else {
      orderClause = [['created_at', 'DESC']];
    }
    
    // Get ratings for this provider
    const { count, rows: ratings } = await Rating.findAndCountAll({
      where: {
        provider_id: providerId,
        is_visible: true, // Only show visible ratings
      },
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'first_name', 'last_name', 'profile_image'],
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'name_en', 'name_ar'],
          required: false,
        },
        {
          model: Booking,
          as: 'booking',
          attributes: ['id', 'booking_number', 'booking_date', 'booking_time'],
          required: false,
        },
      ],
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    
    const totalPages = Math.ceil(count / limit);
    
    return sendPaginated(res, {
      data: ratings,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_reviews: count,
        limit: parseInt(limit),
      },
      message: 'reviews_retrieved',
      language: req.language
    });
  } catch (error) {
    console.error('Get provider reviews error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Get reviews by provider ID (Public/User endpoint)
const getReviewsByProviderId = async (req, res) => {
  try {
    const { provider_id } = req.params;
    const { page = 1, limit = 10, sort_by = 'created_at', order = 'DESC', min_rating } = req.query;
    const offset = (page - 1) * limit;
    
    // Validate provider exists
    const provider = await Provider.findByPk(provider_id);
    
    if (!provider) {
      return sendNotFound(res, {
        message: 'provider_not_found',
        language: req.language
      });
    }
    
    // Build where clause
    const whereClause = {
      provider_id: parseInt(provider_id),
      is_visible: true, // Only show visible ratings
    };
    
    // Filter by minimum rating if provided
    if (min_rating && !isNaN(parseFloat(min_rating))) {
      whereClause.rating = { [Op.gte]: parseFloat(min_rating) };
    }
    
    // Build order clause
    let orderClause = [];
    if (sort_by === 'rating') {
      orderClause = [['rating', order === 'ASC' ? 'ASC' : 'DESC'], ['created_at', 'DESC']];
    } else if (sort_by === 'created_at') {
      orderClause = [['created_at', order === 'ASC' ? 'ASC' : 'DESC']];
    } else {
      orderClause = [['created_at', 'DESC']];
    }
    
    // Get ratings for this provider
    const { count, rows: ratings } = await Rating.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'first_name', 'last_name', 'profile_image'],
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'name_en', 'name_ar'],
          required: false,
        },
      ],
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    
    const totalPages = Math.ceil(count / limit);
    
    // Calculate average rating for this provider
    const allRatings = await Rating.findAll({
      where: {
        provider_id: parseInt(provider_id),
        is_visible: true,
      },
      attributes: ['rating'],
    });
    
    const avgRating = allRatings.length > 0
      ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(2)
      : 0;
    
    // Count ratings by star level
    const ratingDistribution = {
      5: allRatings.filter(r => r.rating === 5).length,
      4: allRatings.filter(r => r.rating === 4).length,
      3: allRatings.filter(r => r.rating === 3).length,
      2: allRatings.filter(r => r.rating === 2).length,
      1: allRatings.filter(r => r.rating === 1).length,
    };
    
    return sendPaginated(res, {
      data: ratings,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_reviews: count,
        limit: parseInt(limit),
      },
      meta: {
        provider: {
          id: provider.id,
          business_name: provider.business_name,
          business_name_en: provider.business_name_en,
          business_name_ar: provider.business_name_ar,
        },
        rating_summary: {
          average_rating: parseFloat(avgRating),
          total_reviews: allRatings.length,
          rating_distribution: ratingDistribution,
        },
      },
      message: 'reviews_retrieved',
      language: req.language
    });
  } catch (error) {
    console.error('Get reviews by provider ID error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};
// Get 6 featured/latest public reviews for homepage (no provider filter)
// const getHomepageReviews = async (req, res) => {
//   try {
//     const reviews = await Rating.findAll({
//       where: {
//         is_visible: true,
//         // Optional: only show reviews with text (more meaningful)
//         review: { [Op.ne]: null },
//       },
//       include: [
//         {
//           model: User,
//           as: 'customer',
//           attributes: ['id', 'first_name', 'last_name', 'profile_image'],
//           required: true,
//         },
//       ],
//       order: [['created_at', 'DESC']], // Most recent first
//       limit: 6,
//     });

//     // Format response exactly like your frontend expects
//     const formattedReviews = reviews.map((r) => ({
//       id: r.id,
//       rating: r.rating,
//       review: r.review || '',
//       created_at: r.created_at,
//       customer: {
//         id: r.customer.id,
//         first_name: r.customer.first_name,
//         last_name: r.customer.last_name,
//         profile_image: r.customer.profile_image,
//       },
//     }));

//     console.log("reviews: ",formattedReviews)
//     return res.status(200).json({
//       success: true,
//       message: 'Homepage reviews retrieved successfully',
//       data: formattedReviews,
//       total: formattedReviews.length,
//     });
//   } catch (error) {
//     console.error('Get homepage reviews error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error fetching homepage reviews',
//       error: error.message,
//     });
//   }
// };
const getHomepageReviews = async (req, res) => {
  try {
//     const reviews = await Rating.findAll({
//       where: {
//         is_visible: true,
//         // review: { [Op.ne]: null },
//         [Op.or]: [
//   { review: { [Op.ne]: null } },
//   { review_ar: { [Op.ne]: null } },
// ],
//       },
//       include: [
//         {
//           model: User,
//           as: 'customer',
//           attributes: ['id', 'first_name', 'last_name', 'profile_image'],
//           required: true,
//         },
//       ],
//       order: [['created_at', 'DESC']],
//       limit: 6,
//     });
const reviews = await Rating.findAll({
  where: {
    is_visible: true,
    [Op.or]: [
      { review: { [Op.ne]: null } },
      { review_ar: { [Op.ne]: null } },
    ],
  },
  attributes: [
    'id',
    'rating',
    'review',
    'review_ar',
    'created_at',
    'user_id',
    'provider_id',
    'service_id'
  ],
  include: [
    {
      model: User,
      as: 'customer',
      attributes: ['id', 'first_name', 'last_name', 'profile_image'],
      required: true,
    },
  ],
  order: [['created_at', 'DESC']],
  limit: 6,
});
    // Check if reviews exist
    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No reviews found',
        data: [],
        total: 0,
      });
    }

    console.log("------------------------------------",reviews[0].toJSON());

    const formattedReviews = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      review: r.review,
      review_ar:r.review_ar,
      created_at: r.created_at,
      customer: {
        id: r.customer.id,
        first_name: r.customer.first_name,
        last_name: r.customer.last_name,
        profile_image: r.customer.profile_image,
      },
    }));

    console.log("Formatted reviews count:", formattedReviews.length);
    
    return res.status(200).json({
      success: true,
      message: 'Homepage reviews retrieved successfully',
      data: formattedReviews,
      total: formattedReviews.length,
    });
  } catch (error) {
    console.error('Get homepage reviews error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching homepage reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
module.exports = {
  createRating,
  getMyReviews,
  getReviewsByProviderId,
  getHomepageReviews,
};
