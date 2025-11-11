const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Protected routes
router.post('/', authenticateToken, ratingController.createRating);

// Provider routes - Get my reviews
router.get('/my-reviews', authenticateToken, authorizeRoles('provider'), ratingController.getMyReviews);

// Public routes - Get reviews by provider ID
router.get('/provider/:provider_id', ratingController.getReviewsByProviderId);

module.exports = router;
