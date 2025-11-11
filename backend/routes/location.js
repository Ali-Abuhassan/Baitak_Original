const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Public routes
router.get('/cities', locationController.getCities);
router.get('/areas', locationController.getAllAreas);
router.get('/areas/:city_slug', locationController.getAreasByCity);
router.get('/search', locationController.searchLocations);

module.exports = router;
