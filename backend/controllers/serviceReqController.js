// // // controllers/serviceReqController.js
// // const { ServiceReq, Provider, City, Category } = require('../models');
// // const { Op } = require('sequelize');
// // const path = require('path');

// // const createRequest = async (req, res, next) => {
// //   try {
// //     // If images uploaded, multer stores in req.files (array)
// //     const images = (req.files || []).map(f => {
// //       // store relative path to /uploads/... (so it is served by express static /uploads)
// //       const rel = path.join('service_requests', path.basename(f.path));
// //       return `/uploads/${rel}`; // full public URL path
// //     });

// //     const {
// //       name,
// //       phone,
// //       email,
// //       city_id,
// //       category_id,
// //       service_date,
// //       service_time,
// //       description,
// //     } = req.body;

// //     if (!name || !phone) {
// //       return res.status(400).json({ success: false, message: 'Name and phone are required.' });
// //     }

// //     const svcReq = await ServiceReq.create({
// //       name,
// //       phone,
// //       email: email || null,
// //       city_id: city_id || null,
// //       category_id: category_id || null,
// //       service_date: service_date || null,
// //       service_time: service_time || null,
// //       images: images.length ? images : null,
// //       description: description || null,
// //       status: 'pending',
// //     });

// //     // TODO: Notify providers (email/SMS/in-app) — optional

// //     return res.status(201).json({ success: true, data: svcReq });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // const listRequests = async (req, res, next) => {
// //   try {
// //     // Providers will call this to see pending requests.
// //     // Allow filtering by status, city, category, pagination
// //     const { status = 'pending', city_id, category_id, page = 1, limit = 20 } = req.query;
// //     const where = {};
// //     if (status) where.status = status;
// //     if (city_id) where.city_id = city_id;
// //     if (category_id) where.category_id = category_id;

// //     const offset = (page - 1) * limit;

// //     const { count, rows } = await ServiceReq.findAndCountAll({
// //       where,
// //       include: [
// //         { model: City, as: 'city', attributes: ['id', 'name_en', 'name_ar'] },
// //         { model: Category, as: 'category', attributes: ['id', 'name_en','name_ar','slug'] },
// //       ],
// //       order: [['created_at', 'DESC']],
// //       limit: parseInt(limit),
// //       offset: parseInt(offset),
// //     });

// //     return res.json({
// //       success: true,
// //       data: rows,
// //       meta: { count, page: parseInt(page), limit: parseInt(limit) },
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // const getRequestById = async (req, res, next) => {
// //   try {
// //     const id = req.params.id;
// //     const reqItem = await ServiceReq.findByPk(id, {
// //       include: [
// //         { model: City, as: 'city', attributes: ['id', 'name_en', 'name_ar'] },
// //         { model: Category, as: 'category', attributes: ['id', 'name_en', 'name_ar'] },
// //         { model: Provider, as: 'provider', attributes: ['id','business_name'] },
// //       ],
// //     });
// //     if (!reqItem) return res.status(404).json({ success: false, message: 'Not found' });
// //     return res.json({ success: true, data: reqItem });
// //   } catch (err) { next(err); }
// // };

// // // Provider claims/accepts request
// // const acceptRequest = async (req, res, next) => {
// //   try {
// //     const id = req.params.id;
// //     const providerId = req.body.provider_id; // ensure provider id comes from auth or body
// //     if (!providerId) return res.status(400).json({ success: false, message: 'provider_id required' });

// //     const reqItem = await ServiceReq.findByPk(id);
// //     if (!reqItem) return res.status(404).json({ success: false, message: 'Request not found' });

// //     if (reqItem.status !== 'pending') {
// //       return res.status(409).json({ success: false, message: 'Request already claimed' });
// //     }

// //     reqItem.provider_id = providerId;
// //     reqItem.status = 'accepted';
// //     await reqItem.save();

// //     // Optionally: create Booking or notify customer

// //     return res.json({ success: true, data: reqItem });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // module.exports = {
// //   createRequest,
// //   listRequests,
// //   getRequestById,
// //   acceptRequest,
// // };
// // controllers/serviceReqController.js
// const ServiceReq = require('../models/serviceReq');
// const path = require('path');

// exports.create = async (req, res) => {
//   try {
//     const files = req.files || [];

//     // Build images array as relative paths (or full URLs if you serve static)
//     const images = files.map((f) => {
//       // Example: store '/uploads/service_req/<filename>'
//       return `/uploads/service_req/${path.basename(f.path)}`;
//     });

//     // Accept both form-data and JSON fields
//     const {
//       name,
//       phone,
//       email,
//       city_id,
//       category_id,
//       description,
//       budget,
//       service_date_type,
//       service_date_value,
//       service_time,
//       address,
//     } = req.body;

//     // Basic validation (you can expand)
//     if (!name || !phone) {
//       return res.status(400).json({ success: false, message: 'name and phone are required' });
//     }

//     const newReq = await ServiceReq.create({
//       name,
//       phone,
//       email: email || null,
//       city_id: city_id ? parseInt(city_id, 10) : null,
//       category_id: category_id ? parseInt(category_id, 10) : null,
//       description: description || null,
//       budget: budget ? parseFloat(budget) : null,
//       service_date_type: service_date_type || 'today',
//       service_date_value: service_date_type === 'other' && service_date_value ? service_date_value : null,
//       service_time: service_time || null,
//       address: address || null,
//       images,
//       status: 'pending',
//     });

//     return res.status(201).json({ success: true, data: newReq });
//   } catch (err) {
//     console.error('create service req error', err);
//     return res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// };
// controllers/serviceReqController.js - UPDATED
const { ServiceReq, Provider, City, Category } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

exports.create = async (req, res) => {
  try {
    console.log('Uploaded files:', req.files); // Debug log
    console.log('Request body:', req.body); // Debug log

    const files = req.files || [];

    // Build images array as relative paths
    const images = files.map((file) => {
      // Store path relative to uploads directory for serving via express static
      const relativePath = path.relative('uploads', file.path);
      return `/uploads/${relativePath}`;
    });

    // Accept both form-data and JSON fields
    const {
      name,
      phone,
      email,
      city_id,
      category_id,
      description,
      budget,
      service_date_type,
      service_date_value,
      service_time,
      address,
    } = req.body;

    // Basic validation
    if (!name || !phone) {
      // Clean up uploaded files if validation fails
      files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
      return res.status(400).json({ 
        success: false, 
        message: 'Name and phone are required' 
      });
    }

    // Calculate actual service date based on type
    let actualServiceDate = null;
    const today = new Date();
    
    switch (service_date_type) {
      case 'today':
        actualServiceDate = today.toISOString().split('T')[0];
        break;
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        actualServiceDate = tomorrow.toISOString().split('T')[0];
        break;
      case 'dayafter':
        const dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 2);
        actualServiceDate = dayAfter.toISOString().split('T')[0];
        break;
      case 'other':
        actualServiceDate = service_date_value;
        break;
      default:
        actualServiceDate = today.toISOString().split('T')[0];
    }

    const newReq = await ServiceReq.create({
      name,
      phone,
      email: email || null,
      city_id: city_id ? parseInt(city_id, 10) : null,
      category_id: category_id ? parseInt(category_id, 10) : null,
      description: description || null,
      budget: budget ? parseFloat(budget) : null,
      service_date_type: service_date_type || 'today',
      service_date_value: service_date_type === 'other' && service_date_value ? service_date_value : null,
      service_time: service_time || null,
      address: address || null,
      images: images.length > 0 ? images : null,
      status: 'pending',
    });

    // Load with associations for response
    const createdReq = await ServiceReq.findByPk(newReq.id, {
      include: [
        { 
          model: City, 
          as: 'city', 
          attributes: ['id', 'name_en', 'name_ar'] 
        },
        { 
          model: Category, 
          as: 'category', 
          attributes: ['id', 'name_en', 'name_ar', 'slug'] 
        },
      ],
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Service request submitted successfully!',
      data: createdReq 
    });

  } catch (err) {
    console.error('Create service req error:', err);
    
    // Clean up uploaded files on error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};
// controllers/serviceReqController.js - UPDATED
// exports.create = async (req, res) => {
//   try {
//     console.log('Uploaded files:', req.files); // Debug log
//     console.log('Request body keys:', Object.keys(req.body)); // Debug log
    
//     // Get files from req.files (Multer should put them here)
//     const files = req.files || [];
//     console.log('Number of files:', files.length);
    
//     // Log each file info for debugging
//     files.forEach((file, index) => {
//       console.log(`File ${index + 1}:`, {
//         fieldname: file.fieldname,
//         originalname: file.originalname,
//         filename: file.filename,
//         path: file.path,
//         size: file.size
//       });
//     });

//     // Build images array as relative paths
//     const images = files.map((file) => {
//       // Store path relative to uploads directory for serving via express static
//       const relativePath = path.relative('uploads', file.path);
//       return `/uploads/${relativePath}`;
//     });

//     console.log('Processed images paths:', images);

//     // Rest of your existing code...
//     const {
//       name,
//       phone,
//       email,
//       city_id,
//       category_id,
//       description,
//       budget,
//       service_date_type,
//       service_date_value,
//       service_time,
//       address,
//     } = req.body;

//     // Basic validation
//     if (!name || !phone) {
//       // Clean up uploaded files if validation fails
//       files.forEach(file => {
//         fs.unlink(file.path, (err) => {
//           if (err) console.error('Error deleting file:', err);
//         });
//       });
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Name and phone are required' 
//       });
//     }

//     // Calculate actual service date based on type
//     let actualServiceDate = null;
//     const today = new Date();
    
//     switch (service_date_type) {
//       case 'today':
//         actualServiceDate = today.toISOString().split('T')[0];
//         break;
//       case 'tomorrow':
//         const tomorrow = new Date(today);
//         tomorrow.setDate(tomorrow.getDate() + 1);
//         actualServiceDate = tomorrow.toISOString().split('T')[0];
//         break;
//       case 'dayafter':
//         const dayAfter = new Date(today);
//         dayAfter.setDate(dayAfter.getDate() + 2);
//         actualServiceDate = dayAfter.toISOString().split('T')[0];
//         break;
//       case 'other':
//         actualServiceDate = service_date_value;
//         break;
//       default:
//         actualServiceDate = today.toISOString().split('T')[0];
//     }

//     const newReq = await ServiceReq.create({
//       name,
//       phone,
//       email: email || null,
//       city_id: city_id ? parseInt(city_id, 10) : null,
//       category_id: category_id ? parseInt(category_id, 10) : null,
//       description: description || null,
//       budget: budget ? parseFloat(budget) : null,
//       service_date_type: service_date_type || 'today',
//       service_date_value: actualServiceDate,
//       service_time: service_time || null,
//       address: address || null,
//       images: images.length > 0 ? images : null,
//       status: 'pending',
//     });

//     console.log('Service request created with ID:', newReq.id);

//     return res.status(201).json({ 
//       success: true, 
//       message: 'Service request submitted successfully!',
//       data: newReq 
//     });

//   } catch (err) {
//     console.error('Create service req error:', err);
    
//     // Clean up uploaded files on error
//     if (req.files && req.files.length > 0) {
//       req.files.forEach(file => {
//         fs.unlink(file.path, (err) => {
//           if (err) console.error('Error deleting file:', err);
//         });
//       });
//     }

//     return res.status(500).json({ 
//       success: false, 
//       message: 'Server error', 
//       error: err.message 
//     });
//   }
// };




