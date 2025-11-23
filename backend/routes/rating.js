const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Protected routes
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Rating routes are working!',
    timestamp: new Date().toISOString()
  });
});
router.post('/', authenticateToken, ratingController.createRating);
router.get('/homepage', ratingController.getHomepageReviews);
// Provider routes - Get my reviews
router.get('/my-reviews', authenticateToken, authorizeRoles('provider'), ratingController.getMyReviews);

// Public routes - Get reviews by provider ID
router.get('/provider/:provider_id', ratingController.getReviewsByProviderId);

module.exports = router;
