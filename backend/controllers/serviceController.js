const { Service, Provider, Category, User, City, Area } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHelper');
const { getLocalizedField, formatLocalizedResponse } = require('../middleware/language');
const { getFileUrl } = require('../middleware/upload');

// Get all services
const getAllServices = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category_id, 
      search, 
      min_price, 
      max_price,
      user_city_id,
      user_area_id,
      sort_by = 'rating'
    } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { is_active: true };
    const providerWhere = { status: 'approved' };
    
    // Parse category_id if provided
    if (category_id) {
      whereClause.category_id = parseInt(category_id);
    }
    
    // Build search conditions
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Build price conditions
    if (min_price || max_price) {
      const priceConditions = {};
      if (min_price) {
        priceConditions[Op.gte] = parseFloat(min_price);
      }
      if (max_price) {
        priceConditions[Op.lte] = parseFloat(max_price);
      }
      if (Object.keys(priceConditions).length > 0) {
        whereClause.base_price = priceConditions;
      }
    }
    
    // Location-based filtering will be handled in the include clause
    
    // Determine sort order
    let order = [];
    switch (sort_by) {
      case 'rating':
        order = [[{ model: Provider, as: 'provider' }, 'rating_avg', 'DESC']];
        break;
      case 'price_low':
        order = [['base_price', 'ASC']];
        break;
      case 'price_high':
        order = [['base_price', 'DESC']];
        break;
      case 'popularity':
        order = [['booking_count', 'DESC']];
        break;
      case 'newest':
        order = [['created_at', 'DESC']];
        break;
      default:
        order = [[{ model: Provider, as: 'provider' }, 'rating_avg', 'DESC']];
    }
    
    // Debug: Log the query conditions (custom replacer for Sequelize operators)
    const debugReplacer = (key, value) => {
      if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'Symbol') {
        return value.toString();
      }
      return value;
    };
    console.log('Service query conditions:', JSON.stringify(whereClause, (key, value) => {
      if (value === Op.gte) return 'Op.gte';
      if (value === Op.lte) return 'Op.lte';
      if (value === Op.like) return 'Op.like';
      if (value === Op.or) return 'Op.or';
      if (value === Op.and) return 'Op.and';
      return value;
    }, 2));
    console.log('Provider query conditions:', JSON.stringify(providerWhere, null, 2));
    
    const { count, rows: services } = await Service.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Provider,
          as: 'provider',
          where: providerWhere,
          required: true, // Only return services with approved providers
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['first_name', 'last_name', 'city_id', 'area_id'],
              where: (() => {
                const userWhere = {};
                if (user_city_id) userWhere.city_id = parseInt(user_city_id);
                if (user_area_id) userWhere.area_id = parseInt(user_area_id);
                return Object.keys(userWhere).length > 0 ? userWhere : undefined;
              })(),
              required: !!(user_city_id || user_area_id), // Only require user if filtering by location
              include: [
                {
                  model: City,
                  as: 'city',
                  attributes: ['name_en', 'name_ar', 'slug'],
                  required: false,
                },
                {
                  model: Area,
                  as: 'area',
                  attributes: ['name_en', 'name_ar', 'slug'],
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name_en', 'name_ar', 'slug'],
          required: false, // Don't require category - services can exist without categories
        },
      ],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true, // Important for correct count with joins
    });
    
    // Localize services based on request language
    const localizedServices = services.map(service => {
      const serviceData = service.toJSON ? service.toJSON() : service;
      
      // Add localized name and description
      serviceData.name_localized = getLocalizedField(serviceData, 'name', req.language);
      serviceData.description_localized = getLocalizedField(serviceData, 'description', req.language);
      
      // Keep multilingual fields for frontend
      serviceData.name_en = serviceData.name_en;
      serviceData.name_ar = serviceData.name_ar;
      serviceData.description_en = serviceData.description_en;
      serviceData.description_ar = serviceData.description_ar;
      
      // Format image URLs
      if (serviceData.images && Array.isArray(serviceData.images)) {
        serviceData.images = serviceData.images.map(filename => getFileUrl(filename, 'service'));
      }
      
      // Localize category if it exists
      if (serviceData.category) {
        serviceData.category.name_localized = getLocalizedField(serviceData.category, 'name', req.language);
        serviceData.category.name_en = serviceData.category.name_en;
        serviceData.category.name_ar = serviceData.category.name_ar;
      }
      
      return serviceData;
    });
    
    const totalPages = Math.ceil(count / limit);
    
    return sendSuccess(res, {
      message: 'services_retrieved',
      language: req.language,
      data: {
        services: localizedServices,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_services: count,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get services error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Get service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [
        {
          model: Provider,
          as: 'provider',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['first_name', 'last_name'],
            },
          ],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name_en', 'name_ar', 'slug'],
        },
      ],
    });
    
    if (!service) {
      return sendNotFound(res, {
        message: 'service_not_found',
        language: req.language
      });
    }
    
    // Increment view count
    await service.increment('view_count');
    
    // Localize service data
    const serviceData = service.toJSON ? service.toJSON() : service;
    serviceData.name_localized = getLocalizedField(serviceData, 'name', req.language);
    serviceData.description_localized = getLocalizedField(serviceData, 'description', req.language);
    serviceData.name_en = serviceData.name_en;
    serviceData.name_ar = serviceData.name_ar;
    serviceData.description_en = serviceData.description_en;
    serviceData.description_ar = serviceData.description_ar;
    
    // Format image URLs
    if (serviceData.images && Array.isArray(serviceData.images)) {
      serviceData.images = serviceData.images.map(filename => getFileUrl(filename, 'service'));
    }
    
    // Localize category if it exists
    if (serviceData.category) {
      serviceData.category.name_localized = getLocalizedField(serviceData.category, 'name', req.language);
      serviceData.category.name_en = serviceData.category.name_en;
      serviceData.category.name_ar = serviceData.category.name_ar;
    }
    
    return sendSuccess(res, {
      message: 'service_retrieved',
      language: req.language,
      data: { service: serviceData },
    });
  } catch (error) {
    console.error('Get service error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Create service (Provider only)
const createService = async (req, res) => {
  try {
    const {
      category_id,
      category_other,
      name,
      description,
      base_price,
      price_type = 'hourly',
      duration_hours = 1,
      packages = [],
      add_ons = [],
      requirements,
      included_services = [],
      excluded_services = [],
      scope_notes,
      min_advance_booking_hours = 24,
      max_advance_booking_days = 30,
    } = req.body;

    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename);
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check if provider exists and is approved
    const provider = await Provider.findByPk(req.user.provider_id);
    if (!provider || provider.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Provider not found or not approved',
      });
    }

    // Validate category input - must have either category_id or category_other
    if (!category_id && !category_other) {
      return res.status(400).json({
        success: false,
        message: 'Either category_id or category_other must be provided',
      });
    }

    // If category_id is provided, check if category exists
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      // Check if provider already has a service in this category
      const existingService = await Service.findOne({
        where: {
          provider_id: req.user.provider_id,
          category_id: category_id,
          is_active: true,
        },
      });

      if (existingService) {
        return res.status(400).json({
          success: false,
          message: 'You already have a service in this category. Each provider can only have one service per category.',
        });
      }
    }

    const service = await Service.create({
      provider_id: req.user.provider_id,
      category_id: category_id || null,
      category_other: category_other || null,
      name,
      slug,
      description,
      base_price,
      price_type,
      duration_hours,
      packages,
      add_ons,
      images,
      requirements,
      included_services,
      excluded_services,
      scope_notes,
      min_advance_booking_hours,
      max_advance_booking_days,
    });

    // Format service response with image URLs
    const serviceData = service.toJSON ? service.toJSON() : service;
    if (serviceData.images && Array.isArray(serviceData.images)) {
      serviceData.images = serviceData.images.map(filename => getFileUrl(filename, 'service'));
    }

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: { service: serviceData },
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message,
    });
  }
};

// Update service (Provider only)
const updateService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const {
      category_id,
      category_other,
      name,
      description,
      base_price,
      price_type,
      duration_hours,
      packages,
      add_ons,
      requirements,
      included_services,
      excluded_services,
      scope_notes,
      min_advance_booking_hours,
      max_advance_booking_days,
      is_active,
    } = req.body;

    const service = await Service.findByPk(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Check if service belongs to the provider
    if (service.provider_id !== req.user.provider_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this service',
      });
    }

    // Validate category input if provided
    if (category_id !== undefined && category_other !== undefined) {
      if (!category_id && !category_other) {
        return res.status(400).json({
          success: false,
          message: 'Either category_id or category_other must be provided',
        });
      }
    }

    // If category_id is provided and being changed, check if category exists and check for duplicates
    if (category_id && category_id !== service.category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      // Check if provider already has another service in this category
      const existingService = await Service.findOne({
        where: {
          provider_id: req.user.provider_id,
          category_id: category_id,
          is_active: true,
          id: { [Op.ne]: serviceId }, // Exclude the current service
        },
      });

      if (existingService) {
        return res.status(400).json({
          success: false,
          message: 'You already have a service in this category. Each provider can only have one service per category.',
        });
      }
    } else if (category_id && !service.category_id) {
      // If category_id is being set for the first time, check if category exists
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      // Check if provider already has a service in this category
      const existingService = await Service.findOne({
        where: {
          provider_id: req.user.provider_id,
          category_id: category_id,
          is_active: true,
          id: { [Op.ne]: serviceId },
        },
      });

      if (existingService) {
        return res.status(400).json({
          success: false,
          message: 'You already have a service in this category. Each provider can only have one service per category.',
        });
      }
    }

    // Process uploaded images - merge with existing images if any new ones are uploaded
    let images = service.images || [];
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      // Merge new images with existing ones (or replace if images field is being cleared)
      images = [...images, ...newImages];
    }

    // Update slug if name changed
    const updateData = { ...req.body };
    if (name && name !== service.name) {
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    // Handle category fields properly
    if (category_id !== undefined) {
      updateData.category_id = category_id || null;
    }
    if (category_other !== undefined) {
      updateData.category_other = category_other || null;
    }

    // Update images if new files were uploaded
    if (req.files && req.files.length > 0) {
      updateData.images = images;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await service.update(updateData);

    // Format service response with image URLs
    const updatedService = await Service.findByPk(serviceId);
    const serviceData = updatedService.toJSON ? updatedService.toJSON() : updatedService;
    if (serviceData.images && Array.isArray(serviceData.images)) {
      serviceData.images = serviceData.images.map(filename => getFileUrl(filename, 'service'));
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: { service: serviceData },
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message,
    });
  }
};

// Get provider's services (Provider only)
const getMyServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { provider_id: req.user.provider_id };

    if (status === 'active') {
      whereClause.is_active = true;
    } else if (status === 'inactive') {
      whereClause.is_active = false;
    }

    const { count, rows: services } = await Service.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name', 'slug'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Format image URLs for all services
    const formattedServices = services.map(service => {
      const serviceData = service.toJSON ? service.toJSON() : service;
      if (serviceData.images && Array.isArray(serviceData.images)) {
        serviceData.images = serviceData.images.map(filename => getFileUrl(filename, 'service'));
      }
      return serviceData;
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        services: formattedServices,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_services: count,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get my services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message,
    });
  }
};

// Delete service (Provider only)
const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const service = await Service.findByPk(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Check if service belongs to the provider
    if (service.provider_id !== req.user.provider_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this service',
      });
    }

    // Soft delete by setting is_active to false
    await service.update({ is_active: false });

    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message,
    });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  getMyServices,
  deleteService,
};
