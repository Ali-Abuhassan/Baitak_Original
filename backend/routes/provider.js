const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// Public routes
router.get('/', providerController.getAllProviders);
router.get('/category/:category_id', providerController.getProvidersByCategory);
router.get('/:id', providerController.getProviderById);

// Public registration with file upload support
// const uploadVerificationDocs = upload.fields([
//   { name: 'id_verified_image', maxCount: 1 },
//   { name: 'vocational_license_image', maxCount: 1 },
//   { name: 'police_clearance_image', maxCount: 1 },
// ]);
const uploadVerificationDocs = upload.fields([
  { name: 'id_verified_image', maxCount: 1 },
  { name: 'vocational_license_image', maxCount: 1 },
  { name: 'police_clearance_image', maxCount: 1 },
])
// router.post('/register', uploadVerificationDocs, handleUploadError, providerController.registerProvider);
router.post('/register', providerController.registerProvider);
// Protected routes - Provider only
router.put(
  '/profile',
  authenticateToken,
  authorizeRoles('provider'),
  providerController.updateProviderProfile
);

router.get(
  '/dashboard/stats',
  authenticateToken,
  authorizeRoles('provider'),
  providerController.getProviderStats
);
router.post(
  '/complete-profile', 
  authenticateToken, 
  authorizeRoles('provider'),
  uploadVerificationDocs, 
  handleUploadError, 
  providerController.completeProviderProfile
);

module.exports = router;