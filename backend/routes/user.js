const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// Protected routes
router.get('/profile', authenticateToken, userController.getProfile);
router.post('/profile/image', authenticateToken, upload.single('profile_image'), handleUploadError, userController.updateProfileImage);
router.get('/bookings', authenticateToken, userController.getUserBookings);
router.get('/statistics', authenticateToken, userController.getUserStatistics);

module.exports = router;
