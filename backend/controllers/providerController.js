const { Provider, User, Service, Category, Booking, Rating, City, Area } = require('../models');
const { Op } = require('sequelize');
const emailService = require('../services/emailService');
const { sendSuccess, sendError, sendNotFound, sendConflict, sendCreated, sendUnauthorized, sendForbidden, sendValidationError, sendPaginated } = require('../utils/responseHelper');
const { normalizePhoneNumber } = require('../utils/phoneNormalizer');
const env = require('../config/env');

// Helper function to add verification badges to provider data
const addVerificationBadges = (provider) => {
  if (!provider) return provider;
  
  const providerData = provider.toJSON ? provider.toJSON() : provider;
  
  // Add verification badges (only show if provider is approved)
  const isApproved = providerData.status === 'approved';
  
  const badges = [];
  
  if (isApproved && providerData.is_id_verified) {
    badges.push({
      type: 'id_verified',
      label_en: 'ID Verified',
      label_ar: 'الهوية موثقة',
      icon: '🆔',
      description_en: 'This provider has verified their identity',
      description_ar: 'تم التحقق من هوية هذا المزود',
    });
  }
  
  if (isApproved && providerData.is_license_verified) {
    badges.push({
      type: 'license_verified',
      label_en: 'Vocational License',
      label_ar: 'رخصة مهنية',
      icon: '📜',
      description_en: 'This provider holds a valid vocational license',
      description_ar: 'يحتوي هذا المزود على رخصة مهنية صالحة',
    });
  }
  
  if (isApproved && providerData.is_police_clearance_verified) {
    badges.push({
      type: 'police_clearance_verified',
      label_en: 'Police Clearance',
      label_ar: 'عدم محكومية',
      icon: '✅',
      description_en: 'This provider has a clean police record',
      description_ar: 'لا يوجد سجل جنائي لهذا المزود',
    });
  }
  
  providerData.verification_badges = badges;
  
  return providerData;
};

// Get all approved providers
const getAllProviders = async (req, res) => {
  try {
    const { page = 1, limit = 10, category_id, min_rating, max_price, city_id, area_id } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { status: 'approved' };
    
    if (min_rating) {
      whereClause.rating_avg = { [Op.gte]: parseFloat(min_rating) };
    }
    
    if (max_price) {
      whereClause.hourly_rate = { [Op.lte]: parseFloat(max_price) };
    }
    
    // Filter by category_id directly on provider
    if (category_id) {
      whereClause.category_id = category_id;
    }
    
    // Build where clause for User (for city and area filters)
    const userWhere = {};
    if (city_id) {
      userWhere.city_id = parseInt(city_id);
    }
    if (area_id) {
      userWhere.area_id = parseInt(area_id);
    }
    
    const includeClause = [
      {
        model: User,
        as: 'user',
        where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
        attributes: ['first_name', 'last_name', 'phone', 'email', 'profile_image'],
        include: [
          {
            model: City,
            as: 'city',
            attributes: ['name_en', 'name_ar', 'slug'],
          },
          {
            model: Area,
            as: 'area',
            attributes: ['name_en', 'name_ar', 'slug'],
          },
        ],
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'name_en', 'name_ar', 'slug'],
        required: false,
      },
    ];
    
    const { count, rows: providers } = await Provider.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [['rating_avg', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    
    const totalPages = Math.ceil(count / limit);
    
    // Add verification badges to each provider
    const providersWithBadges = providers.map(provider => addVerificationBadges(provider));
    
    return sendPaginated(res, {
      data: providersWithBadges,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_providers: count,
        limit: parseInt(limit),
      },
      message: 'providers_retrieved',
      language: req.language
    });
  } catch (error) {
    console.error('Get providers error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Get provider by ID
const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'phone', 'email', 'profile_image'],
          include: [
            {
              model: City,
              as: 'city',
              attributes: ['name_en', 'name_ar', 'slug'],
            },
            {
              model: Area,
              as: 'area',
              attributes: ['name_en', 'name_ar', 'slug'],
            },
          ],
        },
        {
          model: Service,
          as: 'services',
          where: { is_active: true },
          required: false,
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['name', 'slug'],
            },
          ],
        },
        {
          model: Rating,
          as: 'ratings_received',
          limit: 10,
          order: [['created_at', 'DESC']],
          include: [
            {
              model: User,
              as: 'customer',
              attributes: ['first_name', 'last_name'],
            },
          ],
        },
      ],
    });
    
    if (!provider) {
      return sendNotFound(res, {
        message: 'provider_not_found',
        language: req.language
      });
    }
    
    // Only show approved providers publicly
    if (provider.status !== 'approved') {
      return sendForbidden(res, {
        message: 'provider_not_approved',
        language: req.language
      });
    }
    
    // Add verification badges
    const providerWithBadges = addVerificationBadges(provider);
    
    return sendSuccess(res, {
      message: 'provider_retrieved',
      language: req.language,
      data: { provider: providerWithBadges },
    });
  } catch (error) {
    console.error('Get provider by ID error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Register as provider (public route)
const registerProvider = async (req, res) => {
  try {
    let {
      // User data
      first_name,
      last_name,
      phone,
      email,
      password,
      city_id,
      area_id,
      // Provider data
      business_name,
      bio,
      hourly_rate,
      experience_years,
      languages,
      service_areas,
      available_days,
      working_hours,
      categories,
      certifications,
      category_id, // Add category_id here
    } = req.body;
    
    // Normalize phone number if provided
    if (phone) {
      phone = normalizePhoneNumber(phone);
    }
    
    // Validate required fields
    if (!first_name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'First name and phone are required',
      });
    }
    
    // Validate required verification documents
    if (!req.files?.id_verified_image || !req.files?.id_verified_image[0]) {
      return res.status(400).json({
        success: false,
        message: 'ID verification image is required',
      });
    }
    
    if (!req.files?.vocational_license_image || !req.files?.vocational_license_image[0]) {
      return res.status(400).json({
        success: false,
        message: 'Vocational license image is required',
      });
    }
    
    if (!req.files?.police_clearance_image || !req.files?.police_clearance_image[0]) {
      return res.status(400).json({
        success: false,
        message: 'Police clearance image is required',
      });
    }
    
    // Validate category_id if provided
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category_id provided',
        });
      }
    }
    
    // Validate city and area if provided
    if (city_id || area_id) {
      const { City, Area } = require('../models');
      
      if (city_id) {
        const city = await City.findByPk(city_id);
        if (!city) {
          return res.status(400).json({
            success: false,
            message: 'Invalid city_id provided',
          });
        }
      }
      
      if (area_id) {
        const area = await Area.findByPk(area_id);
        if (!area) {
          return res.status(400).json({
            success: false,
            message: 'Invalid area_id provided',
          });
        }
        
        // If both city_id and area_id are provided, validate that area belongs to city
        // Parse IDs to ensure they're integers
        const parsedCityId = parseInt(city_id);
        const parsedAreaCityId = parseInt(area.city_id);
        
        if (city_id && parsedAreaCityId !== parsedCityId) {
          return res.status(400).json({
            success: false,
            message: 'Area does not belong to the specified city',
          });
        }
      }
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { phone },
          ...(email ? [{ email }] : []),
        ],
      },
    });
    
    let userId;
    let isNewUser = false;
    
    if (existingUser) {
      // Check if already a provider
      const existingProvider = await Provider.findOne({
        where: { user_id: existingUser.id },
      });
      
      if (existingProvider) {
        return res.status(409).json({
          success: false,
          message: 'You are already registered as a provider',
        });
      }
      
      userId = existingUser.id;
      
      // Update user role to provider
      await existingUser.update({ role: 'provider' });
    } else {
      // Create new user (unverified)
      const newUser = await User.create({
        first_name,
        last_name,
        phone,
        email,
        password,
        city_id,
        area_id,
        role: 'provider',
        is_verified: false, // Will be verified via OTP
      });
      
      userId = newUser.id;
      isNewUser = true;
    }
    
    // Create provider profile with verification documents
    const provider = await Provider.create({
      user_id: userId,
      category_id: category_id || null,
      business_name,
      bio,
      hourly_rate,
      experience_years,
      languages: languages || ['English'],
      service_areas: service_areas || [],
      available_days: available_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      working_hours: working_hours || { start: '09:00', end: '18:00' },
      certifications: certifications || [],
      status: 'pending',
      // Verification documents (from file uploads)
      id_verified_image: req.files?.id_verified_image?.[0]?.filename || null,
      vocational_license_image: req.files?.vocational_license_image?.[0]?.filename || null,
      police_clearance_image: req.files?.police_clearance_image?.[0]?.filename || null,
    });
    
    // Generate OTP for verification (only for new users, not existing ones)
    const { OtpVerification } = require('../models');
    const NotificationFactory = require('../services/notificationService');
    
    if (isNewUser) {
      // Only send OTP for newly created users
      const otpRecord = await OtpVerification.createOTP(phone, 'signup', 'phone');
      
      // Send OTP
      const notificationService = NotificationFactory.getService('sms');
      await notificationService.sendOTP(phone, otpRecord.otp, 'signup');
      
      // Don't return token or user data - user must verify OTP first
      return res.status(201).json({
        success: true,
        message: 'Provider registration submitted successfully. Please verify your phone number with the OTP sent to your phone.',
        data: {
          message: 'Please verify your phone number with the OTP sent to your phone',
          expires_at: otpRecord.expires_at,
          phone: phone,
          verification_required: true,
        },
      });
    }
    
    // For existing users converting to provider, send notification email to admin
    if (email) {
      try {
        await emailService.sendProviderApproval(email, business_name, 'pending');
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Provider registration submitted successfully. Your application is under review.',
      data: { provider },
    });
  } catch (error) {
    console.error('Provider registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering as provider',
      error: error.message,
    });
  }
};

// Update provider profile
const updateProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      where: { user_id: req.user.id },
    });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found',
      });
    }
    
    const updateData = {};
    const allowedFields = [
      'business_name', 'bio', 'hourly_rate', 'min_booking_hours',
      'experience_years', 'available_days', 'working_hours',
      'service_areas', 'languages', 'instant_booking', 'cancellation_policy',
      'portfolio_images', 'certifications'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    await provider.update(updateData);
    
    res.json({
      success: true,
      message: 'Provider profile updated successfully',
      data: { provider },
    });
  } catch (error) {
    console.error('Update provider profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating provider profile',
      error: error.message,
    });
  }
};

// Get provider dashboard stats
const getProviderStats = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      where: { user_id: req.user.id },
    });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found',
      });
    }
    
    // Get booking statistics
    const totalBookings = await Booking.count({
      where: { provider_id: provider.id },
    });
    
    const completedBookings = await Booking.count({
      where: { provider_id: provider.id, status: 'completed' },
    });
    
    const upcomingBookings = await Booking.count({
      where: {
        provider_id: provider.id,
        status: ['pending', 'confirmed'],
      },
    });
    
    const todayBookings = await Booking.count({
      where: {
        provider_id: provider.id,
        booking_date: new Date().toISOString().split('T')[0],
      },
    });
    
    // Get earnings
    const totalEarnings = await Booking.sum('total_price', {
      where: {
        provider_id: provider.id,
        status: 'completed',
        payment_status: 'paid',
      },
    }) || 0;
    
    const thisMonthEarnings = await Booking.sum('total_price', {
      where: {
        provider_id: provider.id,
        status: 'completed',
        payment_status: 'paid',
        created_at: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }) || 0;
    
    res.json({
      success: true,
      data: {
        statistics: {
          total_bookings: totalBookings,
          completed_bookings: completedBookings,
          upcoming_bookings: upcomingBookings,
          today_bookings: todayBookings,
          total_earnings: totalEarnings,
          this_month_earnings: thisMonthEarnings,
          rating: provider.rating_avg,
          rating_count: provider.rating_count,
        },
      },
    });
  } catch (error) {
    console.error('Get provider stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching provider statistics',
      error: error.message,
    });
  }
};

// Get providers by category
const getProvidersByCategory = async (req, res) => {
  try {
    const category_id = req.params.category_id;
    const { page = 1, limit = 10, min_rating, max_price, city_id, area_id } = req.query;
    const offset = (page - 1) * limit;
    
    // Validate category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return sendNotFound(res, {
        message: 'category_not_found',
        language: req.language
      });
    }
    
    const whereClause = { 
      status: 'approved'
    };
    
    if (min_rating) {
      whereClause.rating_avg = { [Op.gte]: parseFloat(min_rating) };
    }
    
    if (max_price) {
      whereClause.hourly_rate = { [Op.lte]: parseFloat(max_price) };
    }
    
    // Build where clause for User (for city and area filters)
    const userWhere = {};
    if (city_id) {
      userWhere.city_id = parseInt(city_id);
    }
    if (area_id) {
      userWhere.area_id = parseInt(area_id);
    }
    
    // Include Service to filter by category - find providers that have services in this category
    const Service = require('../models/service');
    
    const includeClause = [
      {
        model: User,
        as: 'user',
        where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
        attributes: ['first_name', 'last_name', 'phone', 'email', 'profile_image'],
        include: [
          {
            model: City,
            as: 'city',
            attributes: ['name_en', 'name_ar', 'slug'],
          },
          {
            model: Area,
            as: 'area',
            attributes: ['name_en', 'name_ar', 'slug'],
          },
        ],
      },
      {
        model: Service,
        as: 'services',
        where: {
          category_id: parseInt(category_id),
          is_active: true
        },
        required: true, // Only providers that have services in this category
        attributes: [] // Don't include service data, just use for filtering
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'name_en', 'name_ar', 'slug'],
        required: false,
      },
    ];
    
    const { count, rows: providers } = await Provider.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [['rating_avg', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true, // Important for correct count when using joins
    });
    
    const totalPages = Math.ceil(count / limit);
    
    return sendPaginated(res, {
      data: providers,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_providers: count,
        limit: parseInt(limit),
        has_next: parseInt(page) < totalPages,
        has_prev: parseInt(page) > 1,
      },
      message: 'providers_retrieved',
      language: req.language,
      meta: {
        category: {
          id: category.id,
          name: category.name,
          name_en: category.name_en,
          name_ar: category.name_ar,
          slug: category.slug
        }
      }
    });
  } catch (error) {
    console.error('Get providers by category error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

module.exports = {
  getAllProviders,
  getProviderById,
  registerProvider,
  updateProviderProfile,
  getProviderStats,
  getProvidersByCategory,
};
