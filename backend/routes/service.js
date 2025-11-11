const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Protected routes - Provider only
router.post('/', authenticateToken, authorizeRoles('provider'), upload.array('service_images', 10), handleUploadError, serviceController.createService);
router.get('/my/services', authenticateToken, authorizeRoles('provider'), serviceController.getMyServices);
router.put('/:id', authenticateToken, authorizeRoles('provider'), upload.array('service_images', 10), handleUploadError, serviceController.updateService);
router.delete('/:id', authenticateToken, authorizeRoles('provider'), serviceController.deleteService);

module.exports = router;
 