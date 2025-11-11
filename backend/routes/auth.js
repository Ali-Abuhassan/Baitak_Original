const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateAuth } = require('../middleware/validation/authSchema');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/send-otp', validateAuth.sendOTP, authController.sendOTP);
router.post('/verify-otp', validateAuth.verifyOTP, authController.verifyOTP);
router.post('/login', validateAuth.login, authController.login);
router.post('/signup', validateAuth.signup, authController.signup);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, validateAuth.updateProfile, authController.updateProfile);
router.post('/change-password', authenticateToken, validateAuth.changePassword, authController.changePassword);
router.post('/refresh-token', authenticateToken, authController.refreshToken);

module.exports = router;
