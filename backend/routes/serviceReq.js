// // // // // // routes/serviceReq.js
// // // // // const express = require('express');
// // // // // const router = express.Router();
// // // // // const serviceReqController = require('../controllers/serviceReqController');
// // // // // const { upload } = require('../middleware/upload'); // multer
// // // // // const { authenticateToken, authorizeProvider } = require('../middleware/auth'); // optional

// // // // // // Public: create a guest request with multiple images
// // // // // router.post('/', upload.array('images', 5), serviceReqController.createRequest);

// // // // // // Public: get pending requests (providers will use this) - consider protecting for providers
// // // // // router.get('/', /* authenticateToken, authorizeProvider, */ serviceReqController.listRequests);

// // // // // // Get single request
// // // // // router.get('/:id', serviceReqController.getRequestById);

// // // // // // Provider accepts a request (should be protected by provider auth)
// // // // // router.post('/:id/accept', /* authenticateToken, authorizeProvider, */ serviceReqController.acceptRequest);

// // // // // module.exports = router;
// // // // // routes/serviceReq.js
// // // // const express = require('express');
// // // // const router = express.Router();
// // // // const serviceReqController = require('../controllers/serviceReqController');
// // // // const multer = require('multer');
// // // // const path = require('path');
// // // // const fs = require('fs');

// // // // // ensure upload directory exists
// // // // const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'service_req');
// // // // fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// // // // // multer storage
// // // // const storage = multer.diskStorage({
// // // //   destination: (req, file, cb) => cb(null, UPLOAD_DIR),
// // // //   filename: (req, file, cb) => {
// // // //     const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
// // // //     const ext = path.extname(file.originalname);
// // // //     cb(null, `${unique}${ext}`);
// // // //   },
// // // // });

// // // // const upload = multer({
// // // //   storage,
// // // //   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
// // // // });

// // // // router.post('/', upload.array('images', 5), serviceReqController.create);

// // // // module.exports = router;
// // // const express = require('express');
// // // const router = express.Router();
// // // const serviceReqController = require('../controllers/serviceReqController');

// // // const { upload, handleUploadError } = require('../middleware/upload');

// // // // IMPORTANT: fieldname MUST MATCH frontend input name
// // // router.post(
// // //   '/',
// // //   upload.array('files', 5),
// // //   handleUploadError,
// // //   serviceReqController.create
// // // );

// // // module.exports = router;

// routes/servicereq.js - FIXED
const express = require('express');
const router = express.Router();
const serviceReqController = require('../controllers/serviceReqController');
const { upload, handleUploadError } = require('../middleware/upload');

// FIX: Remove the field name from upload.array()
router.post(
  '/',
  upload.array('files'), // REMOVE the 5 limit here, keep it in multer config
  handleUploadError,
  serviceReqController.create
);

module.exports = router;

// // routes/servicereq.js - ALTERNATIVE FIX
// const express = require('express');
// const router = express.Router();
// const serviceReqController = require('../controllers/serviceReqController');
// const { upload, handleUploadError } = require('../middleware/upload');

// // Use upload.any() to catch all files regardless of field name

// router.post(
//   '/',
//   upload.any(), // This will capture all uploaded files
//   handleUploadError,
//   serviceReqController.create
// );

// module.exports = router;

// routes/servicereq.js - USE upload.any()
// const express = require('express');
// const router = express.Router();
// const serviceReqController = require('../controllers/serviceReqController');
// const { upload, handleUploadError } = require('../middleware/upload');

// // USE upload.any() to catch ALL files
// router.post(
//   '/',
//   upload.any(), // This will capture files from ANY field name
//   handleUploadError,
//   serviceReqController.create
// );

// module.exports = router;