const { Service, Provider, Category, User, Rating, City, Area } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { findCategoryForSearch } = require('../services/smartSearchService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Search services and providers
const searchServices = async (req, res) => {
  try {
    const {
      query,
      city,
      area,
      category,
      min_price,
      max_price,
      min_rating,
      sort_by = 'relevance',
      page = 1,
      limit = 10,
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build search conditions
    const serviceWhere = { is_active: true };
    const providerWhere = { status: 'approved' };
    
    // Smart search: if query is provided, try to find a category
    let suggestedCategory = null;
    let effectiveCategory = category; // Use user's category or detected category
    
    if (query && query.trim().length > 0) {
      suggestedCategory = await findCategoryForSearch(query, req.language);
      console.log(`Smart search result for "${query}":`, suggestedCategory);
      
      // If smart search has high or medium confidence, prioritize it over user category
      if (suggestedCategory.categoryId && 
          suggestedCategory.confidence !== 'low') {
        // Smart search detected category with good confidence - use it
        effectiveCategory = suggestedCategory.categoryId;
        console.log(`✓ Smart search detected category ID: ${suggestedCategory.categoryId} (confidence: ${suggestedCategory.confidence})`);
      } else if (suggestedCategory.categoryId && !category) {
        // Use smart search category only if user didn't provide one (low confidence)
        effectiveCategory = suggestedCategory.categoryId;
        console.log(`✓ Using smart search category ID: ${suggestedCategory.categoryId} (low confidence, no user category)`);
      }
    }
    
    // If smart search detected a category, don't require exact text match
    // Just show all services in that category (more flexible search)
    // BUT: Only skip text matching if confidence is high or medium
    const shouldSkipTextMatch = suggestedCategory && 
                                 suggestedCategory.categoryId && 
                                 suggestedCategory.confidence !== 'low';
    
    if (query && !shouldSkipTextMatch) {
      // Apply text search if no category was detected OR confidence is low
      serviceWhere[Op.or] = [
        { name: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
      ];
    }
    
    // Handle price filters
    if (min_price || max_price) {
      serviceWhere.base_price = {};
      if (min_price && !isNaN(parseFloat(min_price))) {
        serviceWhere.base_price[Op.gte] = parseFloat(min_price);
      }
      if (max_price && !isNaN(parseFloat(max_price))) {
        serviceWhere.base_price[Op.lte] = parseFloat(max_price);
      }
    }
    
    if (min_rating && !isNaN(parseFloat(min_rating))) {
      providerWhere.rating_avg = { [Op.gte]: parseFloat(min_rating) };
    }
    
    if (area) {
      // Use MySQL JSON_CONTAINS function for JSON array search
      providerWhere[Op.and] = [
        ...(providerWhere[Op.and] || []),
        sequelize.literal(`JSON_CONTAINS(service_areas, '"${area}"')`)
      ];
    }
    
    // Note: Category filtering is done at the service level (see below),
    // not at the provider level, since services belong to categories, not providers

    // Build include clause
    const includeClause = [
      {
        model: Provider,
        as: 'provider',
        where: providerWhere,
        required: true, // Services must have a provider (approved or pending)
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['first_name', 'last_name'],
            include: [
              {
                model: City,
                as: 'city',
                attributes: ['name_en', 'name_ar', 'slug'],
                where: city ? { slug: city } : undefined,
              },
              {
                model: Area,
                as: 'area',
                attributes: ['name_en', 'name_ar', 'slug'],
                where: area ? { slug: area } : undefined,
              },
            ],
          },
        ],
      },
      {
        model: Category,
        as: 'category',
        // Don't filter by category here, we filter at the service level by category_id
        attributes: ['id', 'name', 'name_en', 'name_ar', 'slug', 'description', 'description_en', 'description_ar'],
      },
    ];
    
    // Determine sort order
    let order = [];
    switch (sort_by) {
      case 'price_low':
        order = [['base_price', 'ASC']];
        break;
      case 'price_high':
        order = [['base_price', 'DESC']];
        break;
      case 'rating':
        order = [[{ model: Provider, as: 'provider' }, 'rating_avg', 'DESC']];
        break;
      case 'popularity':
        order = [['booking_count', 'DESC']];
        break;
      default: // relevance
        order = [['view_count', 'DESC'], ['booking_count', 'DESC']];
    }
    
    // Add category filter to services
    if (effectiveCategory) {
      // If effectiveCategory is a number, it's already a category ID from smart search
      const categoryId = parseInt(effectiveCategory);
      if (!isNaN(categoryId) && categoryId > 0) {
        serviceWhere.category_id = categoryId;
        if (suggestedCategory && suggestedCategory.confidence !== 'low') {
          console.log(`✓ Using smart search category ID: ${categoryId} (confidence: ${suggestedCategory.confidence})`);
        } else {
          console.log(`✓ Using category ID: ${categoryId}`);
        }
      } else if (typeof effectiveCategory === 'string') {
        // It's a slug, need to convert to ID
        const categoryRecord = await Category.findOne({ where: { slug: effectiveCategory } });
        if (categoryRecord) {
          serviceWhere.category_id = categoryRecord.id;
          console.log(`✓ Using category slug "${effectiveCategory}" -> ID: ${categoryRecord.id}`);
        }
      }
    }

    // Search services
    const { count, rows: services } = await Service.findAndCountAll({
      where: serviceWhere,
      include: includeClause,
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });
    
    const totalPages = Math.ceil(count / limit);
    
    // If no results and we have a suggested category, provide helpful message
    const response = {
      success: true,
      message: count === 0 ? 'no_results_found' : 'search_completed',
      data: {
        results: services,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_results: count,
          limit: parseInt(limit),
        },
        filters_applied: {
          query,
          city,
          area,
          category: suggestedCategory && suggestedCategory.confidence !== 'low' 
            ? `smart:${suggestedCategory.categoryId} (${suggestedCategory.categoryName})` 
            : (effectiveCategory || category),
          min_price,
          max_price,
          min_rating,
        },
      },
    };
    
    // Add smart search metadata if available
    if (suggestedCategory) {
      response.data.smart_search = {
        detected_category: suggestedCategory.categoryName,
        detected_category_id: suggestedCategory.categoryId,
        confidence: suggestedCategory.confidence,
        reasoning: suggestedCategory.reasoning,
      };
    }
    
    return sendSuccess(res, response);
  } catch (error) {
    console.error('Search error:', error);
    return sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Auto-suggest for search
const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return sendSuccess(res, {
        message: 'search_suggestions',
        language: req.language,
        data: { suggestions: [] },
      });
    }
    
    // Smart category suggestion
    let smartCategory = null;
    if (q.length >= 3) {
      smartCategory = await findCategoryForSearch(q, req.language);
    }
    
    // Get service name suggestions
    const services = await Service.findAll({
      where: {
        name: { [Op.like]: `%${q}%` },
        is_active: true,
      },
      attributes: ['name'],
      limit: 5,
      group: ['name'],
    });
    
    // Get category suggestions
    const categories = await Category.findAll({
      where: {
        name: { [Op.like]: `%${q}%` },
        is_active: true,
      },
      attributes: ['name', 'slug'],
      limit: 3,
    });
    
    const suggestions = [];
    
    // Add smart category suggestion first if found
    if (smartCategory && smartCategory.categoryId && smartCategory.confidence === 'high') {
      suggestions.push({
        type: 'category',
        text: smartCategory.categoryName,
        slug: smartCategory.categoryId,
        smart: true,
      });
    }
    
    // Add regular suggestions
    suggestions.push(
      ...services.map(s => ({ type: 'service', text: s.name })),
      ...categories.map(c => ({ type: 'category', text: c.name, slug: c.slug }))
    );
    
    return sendSuccess(res, {
      message: 'search_suggestions',
      language: req.language,
      data: { suggestions },
    });
  } catch (error) {
    console.error('Suggest error:', error);
    return sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

module.exports = {
  searchServices,
  getSearchSuggestions,
};
