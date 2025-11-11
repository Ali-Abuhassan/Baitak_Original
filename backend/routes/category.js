const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Public routes
router.get('/search', categoryController.searchCategories);
router.get('/', categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

module.exports = router;
