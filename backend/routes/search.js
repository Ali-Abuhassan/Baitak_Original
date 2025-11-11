const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Public routes
router.get('/', searchController.searchServices);
router.get('/suggest', searchController.getSearchSuggestions);

module.exports = router;
