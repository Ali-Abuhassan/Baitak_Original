const { Provider, User, Booking, Service, Category } = require('../models');
const emailService = require('../services/emailService');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'customer' } });
    const totalProviders = await Provider.count();
    const approvedProviders = await Provider.count({ where: { status: 'approved' } });
    const pendingProviders = await Provider.count({ where: { status: 'pending' } });
    
    const totalBookings = await Booking.count();
    const completedBookings = await Booking.count({ where: { status: 'completed' } });
    
    const totalRevenue = await Booking.sum('total_price', {
      where: { status: 'completed', payment_status: 'paid' },
    }) || 0;
    
    const todayBookings = await Booking.count({
      where: {
        created_at: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    
    const thisMonthRevenue = await Booking.sum('total_price', {
      where: {
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
          total_users: totalUsers,
          total_providers: totalProviders,
          approved_providers: approvedProviders,
          pending_providers: pendingProviders,
          total_bookings: totalBookings,
          completed_bookings: completedBookings,
          today_bookings: todayBookings,
          total_revenue: totalRevenue,
          this_month_revenue: thisMonthRevenue,
        },
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

// Get pending providers
const getPendingProviders = async (req, res) => {
  try {
    const providers = await Provider.findAll({
      where: { status: 'pending' },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'email', 'phone'],
        },
      ],
      order: [['created_at', 'ASC']],
    });
    
    res.json({
      success: true,
      data: { providers },
    });
  } catch (error) {
    console.error('Get pending providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending providers',
      error: error.message,
    });
  }
};

// Approve/Reject provider
const updateProviderStatus = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved or rejected',
      });
    }
    
    const provider = await Provider.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }
    
    await provider.update({
      status,
      approved_at: status === 'approved' ? new Date() : null,
      approved_by: status === 'approved' ? req.user.id : null,
    });
    
    // Send email notification
    if (provider.user.email) {
      await emailService.sendProviderApproval(
        provider.user.email,
        provider.business_name,
        status
      );
    }
    
    res.json({
      success: true,
      message: `Provider ${status} successfully`,
      data: { provider },
    });
  } catch (error) {
    console.error('Update provider status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating provider status',
      error: error.message,
    });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { name, description, icon, parent_id, suggested_price_range } = req.body;
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      parent_id,
      suggested_price_range,
    });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message,
    });
  }
};

// Get all providers (Admin only)
const getAllProviders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sort_by = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    // Build search clause
    let searchClause = {};
    if (search) {
      searchClause = {
        [Op.or]: [
          { business_name: { [Op.like]: `%${search}%` } },
          { bio: { [Op.like]: `%${search}%` } },
          { service_areas: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Build order clause
    const orderClause = [[sort_by, order.toUpperCase()]];

    const { count, rows: providers } = await Provider.findAndCountAll({
      where: { ...whereClause, ...searchClause },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'phone', 'email', 'is_active'],
        },
      ],
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        providers,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_providers: count,
          limit: parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get all providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching providers',
      error: error.message,
    });
  }
};

// Get all customers (Admin only)
const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort_by = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    // Build search clause
    let searchClause = {};
    if (search) {
      searchClause = {
        [Op.or]: [
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Build order clause
    const orderClause = [[sort_by, order.toUpperCase()]];

    const { count, rows: customers } = await User.findAndCountAll({
      where: {
        role: 'customer',
        ...searchClause,
      },
      attributes: [
        'id',
        'first_name',
        'last_name',
        'phone',
        'email',
        'is_active',
        'is_verified',
        'created_at',
        'updated_at',
      ],
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_customers: count,
          limit: parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get all customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: error.message,
    });
  }
};

// Update provider verification badges (Admin only)
const updateProviderVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_id_verified, is_license_verified, is_police_clearance_verified } = req.body;
    
    const provider = await Provider.findByPk(id);
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }
    
    // Update verification flags
    const updateData = {};
    
    if (typeof is_id_verified === 'boolean') {
      updateData.is_id_verified = is_id_verified;
    }
    
    if (typeof is_license_verified === 'boolean') {
      updateData.is_license_verified = is_license_verified;
    }
    
    if (typeof is_police_clearance_verified === 'boolean') {
      updateData.is_police_clearance_verified = is_police_clearance_verified;
    }
    
    await provider.update(updateData);
    
    // Reload provider to return updated data
    await provider.reload();
    
    res.json({
      success: true,
      message: 'Provider verification updated successfully',
      data: { provider },
    });
  } catch (error) {
    console.error('Update provider verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating provider verification',
      error: error.message,
    });
  }
};

// Get provider with verification documents (Admin only)
const getProviderWithDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    
    const provider = await Provider.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'phone', 'email'],
        },
      ],
    });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }
    
    res.json({
      success: true,
      data: { provider },
    });
  } catch (error) {
    console.error('Get provider with documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching provider details',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllProviders,
  getPendingProviders,
  updateProviderStatus,
  getAllCustomers,
  createCategory,
  updateProviderVerification,
  getProviderWithDocuments,
};
