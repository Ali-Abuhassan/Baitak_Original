const { City, Area } = require('../models');
const { Op } = require('sequelize');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHelper');

// Get all active cities
const getCities = async (req, res) => {
  try {
    const cities = await City.findAll({
      where: { is_active: true },
      attributes: ['id', 'name_en', 'name_ar', 'slug', 'display_order'],
      order: [['display_order', 'ASC'], ['name_en', 'ASC']],
    });

    return sendSuccess(res, {
      message: 'cities_retrieved',
      language: req.language,
      data: { cities },
    });
  } catch (error) {
    console.error('Get cities error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Get areas by city
const getAreasByCity = async (req, res) => {
  try {
    const { city_slug } = req.params;
    
    if (!city_slug) {
      return sendError(res, {
        message: 'city_slug_required',
        statusCode: 400,
        language: req.language
      });
    }

    // First get the city
    const city = await City.findOne({
      where: { slug: city_slug, is_active: true },
      attributes: ['id', 'name_en', 'name_ar', 'slug'],
    });

    if (!city) {
      return sendNotFound(res, {
        message: 'city_not_found',
        language: req.language
      });
    }

    // Get areas for this city
    const areas = await Area.findAll({
      where: { 
        city_id: city.id,
        is_active: true 
      },
      attributes: ['id', 'name_en', 'name_ar', 'slug', 'display_order'],
      order: [['display_order', 'ASC'], ['name_en', 'ASC']],
    });

    return sendSuccess(res, {
      message: 'areas_retrieved',
      language: req.language,
      data: { 
        city,
        areas 
      },
    });
  } catch (error) {
    console.error('Get areas error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Get all areas (with city info)
const getAllAreas = async (req, res) => {
  try {
    const { city_id } = req.query;
    
    const whereClause = { is_active: true };
    if (city_id) {
      whereClause.city_id = city_id;
    }

    const areas = await Area.findAll({
      where: whereClause,
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name_en', 'name_ar', 'slug'],
          where: { is_active: true },
        },
      ],
      attributes: ['id', 'name_en', 'name_ar', 'slug', 'display_order'],
      order: [
        [{ model: City, as: 'city' }, 'display_order', 'ASC'],
        [{ model: City, as: 'city' }, 'name_en', 'ASC'],
        ['display_order', 'ASC'],
        ['name_en', 'ASC']
      ],
    });

    return sendSuccess(res, {
      message: 'areas_retrieved',
      language: req.language,
      data: { areas },
    });
  } catch (error) {
    console.error('Get all areas error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

// Search cities and areas
const searchLocations = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return sendSuccess(res, {
        message: 'locations_searched',
        language: req.language,
        data: { 
          cities: [],
          areas: []
        },
      });
    }

    // Search cities
    const cities = await City.findAll({
      where: {
        [Op.and]: [
          { is_active: true },
          {
            [Op.or]: [
              { name_en: { [Op.like]: `%${q}%` } },
              { name_ar: { [Op.like]: `%${q}%` } },
              { slug: { [Op.like]: `%${q}%` } },
            ],
          },
        ],
      },
      attributes: ['id', 'name_en', 'name_ar', 'slug', 'display_order'],
      limit: 5,
      order: [['display_order', 'ASC'], ['name_en', 'ASC']],
    });

    // Search areas
    const areas = await Area.findAll({
      where: {
        [Op.and]: [
          { is_active: true },
          {
            [Op.or]: [
              { name_en: { [Op.like]: `%${q}%` } },
              { name_ar: { [Op.like]: `%${q}%` } },
              { slug: { [Op.like]: `%${q}%` } },
            ],
          },
        ],
      },
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name_en', 'name_ar', 'slug'],
        },
      ],
      attributes: ['id', 'name_en', 'name_ar', 'slug', 'display_order'],
      limit: 10,
      order: [['display_order', 'ASC'], ['name_en', 'ASC']],
    });

    return sendSuccess(res, {
      message: 'locations_searched',
      language: req.language,
      data: { 
        cities,
        areas 
      },
    });
  } catch (error) {
    console.error('Search locations error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

module.exports = {
  getCities,
  getAreasByCity,
  getAllAreas,
  searchLocations,
};
