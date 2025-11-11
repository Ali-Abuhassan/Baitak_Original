const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateAuth } = require('../middleware/validation/authSchema');

// Public routes
router.post('/send-otp', validateAuth.sendBookingOTP, bookingController.sendBookingOTP); // Step 1: Send OTP
router.post('/', optionalAuth, bookingController.createBooking); // Step 2: Create booking with OTP

// Protected routes
router.get('/my', authenticateToken, bookingController.getMyBookings);
router.get('/:id', authenticateToken, bookingController.getBookingById);
router.patch('/:id/status', authenticateToken, bookingController.updateBookingStatus);
router.patch('/:id/provider-action', authenticateToken, bookingController.providerAcceptOrRejectBooking); // Provider accept/reject
router.patch('/:id/cancel', authenticateToken, bookingController.cancelBooking); // Cancel booking with reason

module.exports = router;
