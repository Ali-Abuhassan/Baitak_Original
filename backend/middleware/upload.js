const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');

// Ensure upload directories exist
const uploadDirs = ['uploads', 'uploads/profiles', 'uploads/services', 'uploads/portfolios', 'uploads/bookings', 'uploads/verifications'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Determine upload path based on field name or route
    if (file.fieldname === 'profile_image' || req.baseUrl.includes('profile')) {
      uploadPath = 'uploads/profiles/';
    } else if (file.fieldname === 'service_images' || req.baseUrl.includes('services')) {
      uploadPath = 'uploads/services/';
    } else if (file.fieldname === 'portfolio_images' || req.baseUrl.includes('portfolio')) {
      uploadPath = 'uploads/portfolios/';
    } else if (file.fieldname === 'booking_attachments' || req.baseUrl.includes('bookings')) {
      uploadPath = 'uploads/bookings/';
    } else if (file.fieldname === 'id_verified_image' || file.fieldname === 'vocational_license_image' || file.fieldname === 'police_clearance_image') {
      uploadPath = 'uploads/verifications/';
   } else if (file.fieldname === 'files' || req.baseUrl.includes('service-requests')) {  // UPDATED THIS LINE
      uploadPath = 'uploads/requests/';
    }

    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (env.upload.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${env.upload.allowedFileTypes.join(', ')}`), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: env.upload.maxFileSize, // 5MB default
       files: 5, // max files
  },
  fileFilter: fileFilter,
});

// Middleware for handling upload errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File size too large. Maximum size is ${env.upload.maxFileSize / 1024 / 1024}MB`,
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error',
    });
  }
  next();
};

// Helper function to delete uploaded file
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error deleting file:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Helper function to get file URL
const getFileUrl = (filename, type = '') => {
  if (!filename) return null;
  
  let basePath = '/uploads/';
  if (type === 'profile') basePath = '/uploads/profiles/';
  else if (type === 'service') basePath = '/uploads/services/';
  else if (type === 'portfolio') basePath = '/uploads/portfolios/';
  else if (type === 'booking') basePath = '/uploads/bookings/';
  else if (type === 'verification') basePath = '/uploads/verifications/';
  
  return `${env.serverBaseUrl}${basePath}${filename}`;
};

module.exports = {
  upload,
  handleUploadError,
  deleteFile,
  getFileUrl,
};
