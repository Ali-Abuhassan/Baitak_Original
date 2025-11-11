const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Admin authentication middleware
const adminAuth = [authenticateToken, authorizeRoles('admin')];

// Protected routes - Admin only
router.get('/dashboard/stats', adminAuth, adminController.getDashboardStats);
router.get('/providers', adminAuth, adminController.getAllProviders);
router.get('/providers/pending', adminAuth, adminController.getPendingProviders);
router.patch('/providers/:id/status', adminAuth, adminController.updateProviderStatus);
router.get('/providers/:id/documents', adminAuth, adminController.getProviderWithDocuments);
router.patch('/providers/:id/verification', adminAuth, adminController.updateProviderVerification);
router.get('/customers', adminAuth, adminController.getAllCustomers);
router.post('/categories', adminAuth, adminController.createCategory);

module.exports = router;
