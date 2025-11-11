const { User, Booking, Rating } = require('../models');
const { upload, handleUploadError, getFileUrl } = require('../middleware/upload');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// Update profile picture
const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }
    
    const user = await User.findByPk(req.user.id);
    
    // Delete old image if exists
    if (user.profile_image) {
      const { deleteFile } = require('../middleware/upload');
      await deleteFile(`uploads/profiles/${user.profile_image}`).catch(console.error);
    }
    
    // Update user with new image
    user.profile_image = req.file.filename;
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile image updated successfully',
      data: {
        profile_image: getFileUrl(req.file.filename, 'profile'),
      },
    });
  } catch (error) {
    console.error('Update profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile image',
      error: error.message,
    });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { user_id: req.user.id };
    if (status) {
      whereClause.status = status;
    }
    
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: require('../models/provider'),
          as: 'provider',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['first_name', 'last_name', 'phone'],
            },
          ],
        },
        {
          model: require('../models/service'),
          as: 'service',
          attributes: ['name', 'description'],
        },
        {
          model: Rating,
          as: 'rating',
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    
    const totalPages = Math.ceil(count / limit);
    
    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_bookings: count,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
};

// Get user statistics
const getUserStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get booking statistics
    const totalBookings = await Booking.count({
      where: { user_id: userId },
    });
    
    const completedBookings = await Booking.count({
      where: { user_id: userId, status: 'completed' },
    });
    
    const upcomingBookings = await Booking.count({
      where: {
        user_id: userId,
        status: ['pending', 'confirmed'],
      },
    });
    
    // Get total spent
    const totalSpent = await Booking.sum('total_price', {
      where: {
        user_id: userId,
        payment_status: 'paid',
      },
    }) || 0;
    
    // Get ratings given
    const ratingsGiven = await Rating.count({
      where: { user_id: userId },
    });
    
    res.json({
      success: true,
      data: {
        statistics: {
          total_bookings: totalBookings,
          completed_bookings: completedBookings,
          upcoming_bookings: upcomingBookings,
          total_spent: totalSpent,
          ratings_given: ratingsGiven,
        },
      },
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfileImage,
  getUserBookings,
  getUserStatistics,
};
