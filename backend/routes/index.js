const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./user');
const providerRoutes = require('./provider');
const categoryRoutes = require('./category');
const serviceRoutes = require('./service');
const bookingRoutes = require('./booking');
const ratingRoutes = require('./rating');
const adminRoutes = require('./admin');
const searchRoutes = require('./search');
const locationRoutes = require('./location');

// Welcome route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Baitak API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      providers: '/api/providers',
      categories: '/api/categories',
      services: '/api/services',
      bookings: '/api/bookings',
      ratings: '/api/ratings',
      admin: '/api/admin',
      search: '/api/search',
      locations: '/api/locations',
    },
  });
});

// Use routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/providers', providerRoutes);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/ratings', ratingRoutes);
router.use('/admin', adminRoutes);
router.use('/search', searchRoutes);
router.use('/locations', locationRoutes);

module.exports = router;
