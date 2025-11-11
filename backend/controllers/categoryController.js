const { Category } = require('../models');
const { Op } = require('sequelize');
const { sendSuccess, sendError, sendNotFound, sendPaginated } = require('../utils/responseHelper');
const { getLocalizedField } = require('../utils/localizedFields');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true, parent_id: null },
      include: [
        {
          model: Category,
          as: 'subcategories',
          where: { is_active: true },
          required: false,
        },
      ],
      order: [['display_order', 'ASC'], ['name', 'ASC']],
    });
    
    // Add multilingual fields to each category
    const localizedCategories = categories.map(category => {
      const categoryData = category.toJSON();
      
      // Add localized fields
      categoryData.name_localized = getLocalizedField(category, 'name', req.language);
      categoryData.description_localized = getLocalizedField(category, 'description', req.language);
      
      // Add multilingual fields for frontend
      categoryData.name_en = category.name_en;
      categoryData.name_ar = category.name_ar;
      categoryData.description_en = category.description_en;
      categoryData.description_ar = category.description_ar;
      
      // Process subcategories
      if (categoryData.subcategories) {
        categoryData.subcategories = categoryData.subcategories.map(sub => {
          const subData = sub.toJSON ? sub.toJSON() : sub;
          subData.name_localized = getLocalizedField(sub, 'name', req.language);
          subData.description_localized = getLocalizedField(sub, 'description', req.language);
          subData.name_en = sub.name_en;
          subData.name_ar = sub.name_ar;
          subData.description_en = sub.description_en;
          subData.description_ar = sub.description_ar;
          return subData;
        });
      }
      
      return categoryData;
    });
    
    return sendSuccess(res, {
      message: 'categories_retrieved',
      language: req.language,
      data: { categories: localizedCategories },
    });
  } catch (error) {
    console.error('Get categories error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Get category by slug
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug, is_active: true },
      include: [
        {
          model: Category,
          as: 'subcategories',
          where: { is_active: true },
          required: false,
        },
      ],
    });
    
    if (!category) {
      return sendNotFound(res, {
        message: 'category_not_found',
        language: req.language
      });
    }
    
    // Add multilingual fields to category
    const categoryData = category.toJSON();
    
    // Add localized fields
    categoryData.name_localized = getLocalizedField(category, 'name', req.language);
    categoryData.description_localized = getLocalizedField(category, 'description', req.language);
    
    // Add multilingual fields for frontend
    categoryData.name_en = category.name_en;
    categoryData.name_ar = category.name_ar;
    categoryData.description_en = category.description_en;
    categoryData.description_ar = category.description_ar;
    
    // Process subcategories
    if (categoryData.subcategories) {
      categoryData.subcategories = categoryData.subcategories.map(sub => {
        const subData = sub.toJSON ? sub.toJSON() : sub;
        subData.name_localized = getLocalizedField(sub, 'name', req.language);
        subData.description_localized = getLocalizedField(sub, 'description', req.language);
        subData.name_en = sub.name_en;
        subData.name_ar = sub.name_ar;
        subData.description_en = sub.description_en;
        subData.description_ar = sub.description_ar;
        return subData;
      });
    }
    
    return sendSuccess(res, {
      message: 'category_retrieved',
      language: req.language,
      data: { category: categoryData },
    });
  } catch (error) {
    console.error('Get category error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Search categories
const searchCategories = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    if (!q || q.trim() === '') {
      return sendError(res, {
        message: 'validation_error',
        language: req.language,
        statusCode: 400,
      });
    }
    
    const searchTerm = q.trim();
    
    // Build search conditions for multilingual search
    const searchConditions = {
      is_active: true,
      [Op.or]: [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { name_en: { [Op.like]: `%${searchTerm}%` } },
        { name_ar: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } },
        { description_en: { [Op.like]: `%${searchTerm}%` } },
        { description_ar: { [Op.like]: `%${searchTerm}%` } },
      ],
    };
    
    const { count, rows: categories } = await Category.findAndCountAll({
      where: searchConditions,
      include: [
        {
          model: Category,
          as: 'subcategories',
          where: { is_active: true },
          required: false,
        },
      ],
      order: [['display_order', 'ASC'], ['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    
    // Add multilingual fields to each category
    const localizedCategories = categories.map(category => {
      const categoryData = category.toJSON();
      
      // Add localized fields
      categoryData.name_localized = getLocalizedField(category, 'name', req.language);
      categoryData.description_localized = getLocalizedField(category, 'description', req.language);
      
      // Add multilingual fields for frontend
      categoryData.name_en = category.name_en;
      categoryData.name_ar = category.name_ar;
      categoryData.description_en = category.description_en;
      categoryData.description_ar = category.description_ar;
      
      // Process subcategories
      if (categoryData.subcategories) {
        categoryData.subcategories = categoryData.subcategories.map(sub => {
          const subData = sub.toJSON ? sub.toJSON() : sub;
          subData.name_localized = getLocalizedField(sub, 'name', req.language);
          subData.description_localized = getLocalizedField(sub, 'description', req.language);
          subData.name_en = sub.name_en;
          subData.name_ar = sub.name_ar;
          subData.description_en = sub.description_en;
          subData.description_ar = sub.description_ar;
          return subData;
        });
      }
      
      return categoryData;
    });
    
    const totalPages = Math.ceil(count / limit);
    
    return sendPaginated(res, {
      data: localizedCategories,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: count,
        limit: parseInt(limit),
        has_next: parseInt(page) < totalPages,
        has_prev: parseInt(page) > 1,
      },
      message: count > 0 ? 'search_completed' : 'no_results',
      language: req.language,
    });
  } catch (error) {
    console.error('Search categories error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  searchCategories,
};
