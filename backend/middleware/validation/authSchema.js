const Joi = require('joi');

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

const sendOTPSchema = Joi.object({
  phone: Joi.string().pattern(phoneRegex).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid email address',
  }),
  purpose: Joi.string()
    .valid('login', 'signup', 'reset_password', 'verify_phone', 'verify_email')
    .required()
    .messages({
      'any.required': 'Purpose is required',
      'any.only': 'Invalid purpose',
    }),
}).or('phone', 'email').messages({
  'object.missing': 'Either phone or email is required',
});

const verifyOTPSchema = Joi.object({
  phone: Joi.string().pattern(phoneRegex).optional(),
  email: Joi.string().email().optional(),
  otp: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be 6 digits',
    'any.required': 'OTP is required',
  }),
  purpose: Joi.string()
    .valid('login', 'signup', 'reset_password', 'verify_phone', 'verify_email', 'booking_confirmation')
    .required(),
  // Additional user data for signup
  first_name: Joi.string().min(1).max(100).optional(),
  last_name: Joi.string().max(100).optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid('customer', 'provider').optional(),
}).or('phone', 'email');

const loginSchema = Joi.object({
  phone: Joi.string().pattern(phoneRegex).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
}).or('phone', 'email');

// const signupSchema = Joi.object({
//   first_name: Joi.string().trim().min(1).max(100).required().messages({
//     'string.empty': 'First name is required',
//     'string.min': 'First name must be at least 1 character',
//     'string.max': 'First name cannot exceed 100 characters',
//     'any.required': 'First name is required',
//   }),
//   last_name: Joi.string().trim().max(100).optional(),
//   phone: Joi.string().pattern(phoneRegex).required().messages({
//     'string.pattern.base': 'Please provide a valid phone number',
//     'any.required': 'Phone number is required',
//   }),
//   email: Joi.string().email().optional(),
//   password: Joi.string().min(6).max(100).optional().messages({
//     'string.min': 'Password must be at least 6 characters',
//     'string.max': 'Password cannot exceed 100 characters',
//   }),
//   role: Joi.string().valid('customer', 'provider').default('customer'),
//   city_id: Joi.number().integer().positive().optional().messages({
//     'number.base': 'City ID must be a number',
//     'number.integer': 'City ID must be an integer',
//     'number.positive': 'City ID must be positive',
//   }),
//   area_id: Joi.number().integer().positive().optional().messages({
//     'number.base': 'Area ID must be a number',
//     'number.integer': 'Area ID must be an integer',
//     'number.positive': 'Area ID must be positive',
//   }),
// });
// const signupSchema = Joi.object({
//   first_name: Joi.string().trim().min(1).max(100).required().messages({
//     'string.empty': 'First name is required',
//     'string.min': 'First name must be at least 1 character',
//     'string.max': 'First name cannot exceed 100 characters',
//     'any.required': 'First name is required',
//   }),

//   last_name: Joi.string().trim().max(100).optional(),

//   // phone: Joi.string()
//   //   .pattern(phoneRegex)
//   //   .messages({
//   //     'string.pattern.base': 'Please provide a valid Jordanian phone number',
//   //   })
//   //   .optional(),
//   phone: Joi.string()
//   .allow(null, '')
//   .optional()
//   .pattern(phoneRegex)
//   .messages({
//     'string.pattern.base': 'Please provide a valid Jordanian phone number',
//   }),


//   // email: Joi.string()
//   //   .email()
//   //   .messages({
//   //     'string.email': 'Please provide a valid email address',
//   //   })
//   //   .optional(),
//   email: Joi.string()
//   .allow(null, '')
//   .email()
//   .optional(),


//   password: Joi.string().min(6).max(100).required().messages({
//     'string.min': 'Password must be at least 6 characters',
//     'string.max': 'Password cannot exceed 100 characters',
//     'any.required': 'Password is required',
//   }),

//   role: Joi.string().valid('customer', 'provider').default('customer'),

//   city_id: Joi.number().integer().positive().optional(),
//   area_id: Joi.number().integer().positive().optional(),
// })
//   // 🔥 This is the important part:
//   .or('phone', 'email')
//   .messages({
//     'object.missing': 'Please provide either phone or email',
//   });
// const signupSchema = Joi.object({
//   first_name: Joi.string().trim().min(1).max(100).required(),

//   last_name: Joi.string().trim().max(100).optional(),

//   phone: Joi.string()
//     .allow('', null)
//     .pattern(phoneRegex)
//     .optional()
//     .messages({
//       'string.pattern.base': 'Please provide a valid Jordanian phone number',
//     }),

//   email: Joi.string()
//     .allow('', null)
//     .email()
//     .optional()
//     .messages({
//       'string.email': 'Please provide a valid email address',
//     }),

//   password: Joi.string().min(6).max(100).required(),

//   role: Joi.string().valid('customer', 'provider').default('customer'),

//   city_id: Joi.number().integer().positive().optional(),
//   area_id: Joi.number().integer().positive().optional(),
// })
// .or('phone', 'email')
// .messages({
//   'object.missing': 'Please provide either phone or email',
// });
// middleware/validation/authschema.js
// const signupSchema = Joi.object({
//   first_name: Joi.string().trim().min(1).max(100).required(),

//   last_name: Joi.string().trim().max(100).optional(),

//   phone: Joi.string()
//     .trim()
//     .allow('', null)
//     .pattern(phoneRegex)
//     .optional()
//     .messages({
//       'string.pattern.base': 'Please provide a valid Jordanian phone number',
//     }),

//   email: Joi.string()
//     .trim()
//     .allow('', null)
//     .email()
//     .optional()
//     .messages({
//       'string.email': 'Please provide a valid email address',
//     }),

//   password: Joi.string().min(6).max(100).required(),

//   role: Joi.string().valid('customer', 'provider').default('customer'),

//   city_id: Joi.number().integer().positive().optional(),
//   area_id: Joi.number().integer().positive().optional(),
// })
// .custom((value, helpers) => {
//   const { phone, email } = value;
  
//   // Check if both are empty/null
//   const phoneEmpty = !phone || phone.trim() === '';
//   const emailEmpty = !email || email.trim() === '';
  
//   if (phoneEmpty && emailEmpty) {
//     return helpers.error('any.custom', {
//       message: 'Please provide either phone or email'
//     });
//   }
  
//   return value;
// })
// .messages({
//   'any.custom': 'Please provide either phone or email',
// });
const signupSchema = Joi.object({
  first_name: Joi.string().trim().min(1).max(100).required(),

  last_name: Joi.string().trim().max(100).optional().allow(''),

  phone: Joi.string()
    .trim()
    .allow('', null)
    .pattern(phoneRegex)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid Jordanian phone number',
    }),

  email: Joi.string()
    .trim()
    .allow('', null)
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address',
    }),

  password: Joi.string().min(6).max(100).required(),

  role: Joi.string().valid('customer', 'provider').default('customer'),

  city_id: Joi.number().integer().positive().optional().allow(null),
  area_id: Joi.number().integer().positive().optional().allow(null),
})
.custom((value, helpers) => {
  const { phone, email } = value;
  
  // Convert empty strings to null
  if (phone === '') value.phone = null;
  if (email === '') value.email = null;
  
  // Check if at least one is provided
  const hasPhone = phone && phone !== '';
  const hasEmail = email && email !== '';
  
  if (!hasPhone && !hasEmail) {
    return helpers.error('any.custom', {
      message: 'Please provide either phone or email'
    });
  }
  
  return value;
})
.messages({
  'any.custom': 'Please provide either phone or email',
});
const updateProfileSchema = Joi.object({
  first_name: Joi.string().trim().min(1).max(100).optional(),
  last_name: Joi.string().trim().max(100).optional(),
  email: Joi.string().email().optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  area: Joi.string().max(100).optional(),
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  new_password: Joi.string().min(6).max(100).required().messages({
    'string.min': 'New password must be at least 6 characters',
    'string.max': 'New password cannot exceed 100 characters',
    'any.required': 'New password is required',
  }),
  confirm_password: Joi.string().valid(Joi.ref('new_password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your new password',
  }),
});

const sendBookingOTPSchema = Joi.object({
  customer_phone: Joi.string().pattern(phoneRegex).required().messages({
    'string.pattern.base': 'Please provide a valid phone number',
    'any.required': 'Customer phone number is required',
  }),
});

const validateAuth = {
  sendOTP: (req, res, next) => {
    const { error } = sendOTPSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    next();
  },

  verifyOTP: (req, res, next) => {
    const { error } = verifyOTPSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    next();
  },

  login: (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    next();
  },

  signup: (req, res, next) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    next();
  },

  updateProfile: (req, res, next) => {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    next();
  },

  changePassword: (req, res, next) => {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    next();
  },

  sendBookingOTP: (req, res, next) => {
    const { error } = sendBookingOTPSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    next();
  },
};

module.exports = { validateAuth };
