const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const NotificationFactory = require('../services/notificationService');
const emailService = require('../services/emailService');
const { Op } = require('sequelize');
// const redis = require("../config/redis");   // <-- correct path
const { redis } = require("../config/redis");

const { sendSuccess, sendError, sendNotFound, sendConflict, sendCreated, sendUnauthorized, sendForbidden, sendValidationError } = require('../utils/responseHelper');
const { normalizePhoneNumber } = require('../utils/phoneNormalizer');
const OTPService = require("../services/otpService");
const otpService = require('../services/otpService');

//with redis worked:
const sendOTP = async (req, res) => {
  try {
    let { phone, email, purpose } = req.body;

    if (phone) phone = normalizePhoneNumber(phone);

    const notificationType = phone ? 'sms' : 'email';
    const recipient = phone || email;
    const fieldType = phone ? 'phone' : 'email';

    // LOGIN → must exist
    if (purpose === 'login') {
      const user = await User.findOne({ where: { [fieldType]: recipient } });
      if (!user) {
        return sendNotFound(res, {
          message: 'user_not_found_signup',
          language: req.language
        });
      }
    }

    // SIGNUP → must NOT exist
    if (purpose === 'signup') {
      const exists = await User.findOne({ where: { [fieldType]: recipient } });
      if (exists) {
        return sendConflict(res, {
          message: 'user_already_exists',
          language: req.language,
          variables: { field: fieldType }
        });
      }
    }

    // Redis OTP key format
    const otpKey = `${recipient}:${purpose}`;

    // Generate OTP
// const otp = await OTPService.generateOTP(recipient, purpose);
const otp=await OTPService.generateOTP(recipient, purpose);

    // const otp = await OTPService.generateOTP(recipient, purpose);

    console.log("📌 Trying to generate OTP for:", recipient);


console.log("📌 OTP generated:", otp);

// const testGet = await redis.get(`OTP:${recipient}`);
const testGet = await redis.get(`OTP:${recipient}:${purpose}`);

console.log("📌 Redis stored:", testGet);


    // Send OTP using your existing service
    const notificationService = NotificationFactory.getService(notificationType);
    await notificationService.sendOTP(recipient, otp, purpose);

    return sendSuccess(res, {
      message: 'otp_sent',
      language: req.language,
      data: {
        purpose,
        expires_in: '5 minutes',
      },
    });

  } catch (error) {
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};


const verifyOTP = async (req, res) => {
  try {
    let { phone, email, otp, purpose } = req.body;

    if (phone) phone = normalizePhoneNumber(phone);

    const recipient = phone || email;
    const fieldType = phone ? 'phone' : 'email';

    // Convert verify_phone/verify_email → signup
    let isSignupVerification = false;

    if (purpose === 'verify_phone' || purpose === 'verify_email') {
      const unverifiedUser = await User.findOne({
        where: { [fieldType]: recipient, is_verified: false },
      });

      if (unverifiedUser) {
        isSignupVerification = true;
        purpose = 'signup';
      }
    }

    // Redis OTP key
    const otpKey = `${recipient}:${purpose}`;

    // Check OTP
    // const otpCheck = await OTPService.verifyOTP(otpKey, otp);
    const isValid = await OTPService.verifyOTP(recipient, purpose, otp);

    // const isValid = await OTPService.verifyOTP(recipient, purpose, otp);


    if (!isValid.success) {
      return sendError(res, {
        message: 'otp_invalid',
        statusCode: 400,
        language: req.language
      });
    }

    // Continue with your user logic exactly as before…

    let user;
    let isNewUser = false;

    if (purpose === 'signup' || isSignupVerification) {
      user = await User.findOne({
        where: { [fieldType]: recipient, is_verified: false },
        include: [{ model: require('../models/provider'), as: 'provider_profile', required: false }],
      });

      if (!user) {
        return sendNotFound(res, {
          message: 'user_not_found_or_already_verified',
          language: req.language
        });
      }

      user.is_verified = true;
      await user.save();
      isNewUser = true;
    }

    else if (purpose === 'login') {
      user = await User.findOne({
        where: { [fieldType]: recipient },
        include: [{ model: require('../models/provider'), as: 'provider_profile', required: false }],
      });

      if (!user) {
        return sendNotFound(res, {
          message: 'user_not_found',
          language: req.language
        });
      }

      if (!user.is_verified) {
        user.is_verified = true;
        await user.save();
      }

      user.last_login = new Date();
      await user.save();
    }

    const token = generateToken(user);

    return sendSuccess(res, {
      message: isNewUser ? 'account_created' : 'otp_verified',
      language: req.language,
      data: {
        token,
        user: user.toJSON(),
        is_new_user: isNewUser,
        provider_profile: user.provider_profile || null,
      },
    });

  } catch (error) {
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};


// const login = async (req, res) => {
//   try {
//     let { phone, email, password } = req.body;
    
//     // Normalize phone number if provided
//     if (phone) {
//       phone = normalizePhoneNumber(phone);
//     }
    
//     const whereClause = phone ? { phone } : { email };
    
//     // Find user
//     const user = await User.findOne({
//       where: whereClause,
//       include: [
//         {
//           model: require('../models/provider'),
//           as: 'provider_profile',
//           required: false,
//         },
//       ],
//     });
    
//     if (!user) {
//       return sendUnauthorized(res, {
//         message: 'invalid_credentials',
//         language: req.language
//       });
//     }
    
//     // Check if user phone is verified
//     if (!user.is_verified) {
//       return sendForbidden(res, {
//         message: 'phone_verification_required',
//         language: req.language,
//         data: {
//           message: 'Please verify your phone number before logging in. Use /send-otp and /verify-otp endpoints.',
//         },
//       });
//     }
    
//     // Check password
//     const isPasswordValid = await user.comparePassword(password);
    
//     if (!isPasswordValid) {
//       return sendUnauthorized(res, {
//         message: 'invalid_credentials',
//         language: req.language
//       });
//     }
    
//     // Check if account is active
//     if (!user.is_active) {
//       return sendForbidden(res, {
//         message: 'account_deactivated',
//         language: req.language
//       });
//     }
    
//     // Update last login
//     user.last_login = new Date();
//     await user.save();
    
//     // Generate token
//     const token = generateToken(user);
    
//     return sendSuccess(res, {
//       message: 'login_successful',
//       language: req.language,
//       data: {
//         token,
//         user: user.toJSON(),
//         provider_profile: user.provider_profile || null,
      
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     sendError(res, {
//       message: 'server_error',
//       language: req.language,
//       error: error.message,
//     });
//   }
// };
const login = async (req, res) => {
  try {
    let { phone, email, password } = req.body;

    // Normalize phone number if provided
    if (phone) {
      phone = normalizePhoneNumber(phone);
    }

    const whereClause = phone ? { phone } : { email };

    // Find user
    const user = await User.findOne({
      where: whereClause,
      include: [
        {
          model: require('../models/provider'),
          as: 'provider_profile',
          required: false,
        },
      ],
    });

    if (!user) {
      return sendUnauthorized(res, {
        message: 'invalid_credentials',
        language: req.language
      });
    }

    // ❌ REMOVED: phone verification check

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendUnauthorized(res, {
        message: 'invalid_credentials',
        language: req.language
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return sendForbidden(res, {
        message: 'account_deactivated',
        language: req.language
      });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    return sendSuccess(res, {
      message: 'login_successful',
      language: req.language,
      data: {
        token,
        user: user.toJSON(),
        provider_profile: user.provider_profile || null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};


// const signup = async (req, res) => {
//   try {
//     let { first_name, last_name, phone, email, password, role, city_id, area_id } = req.body;

//     if (phone) phone = normalizePhoneNumber(phone);

//     // Required fields
//     if (!first_name || !phone) {
//       return sendValidationError(res, {
//         errors: [
//           { field: 'first_name', message: 'first_name_required' },
//           { field: 'phone', message: 'phone_required' }
//         ],
//         language: req.language
//       });
//     }

//     // Validate city & area
//     if (city_id || area_id) {
//       const { City, Area } = require('../models');

//       if (city_id) {
//         const city = await City.findByPk(city_id);
//         if (!city) {
//           return sendError(res, {
//             message: 'invalid_city_id',
//             statusCode: 400,
//             language: req.language
//           });
//         }
//       }

//       if (area_id) {
//         const area = await Area.findByPk(area_id);
//         if (!area) {
//           return sendError(res, {
//             message: 'invalid_area_id',
//             statusCode: 400,
//             language: req.language
//           });
//         }

//         if (city_id && area.city_id !== city_id) {
//           return sendError(res, {
//             message: 'area_does_not_belong',
//             statusCode: 400,
//             language: req.language
//           });
//         }
//       }
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({
//       where: {
//         [Op.or]: [
//           { phone },
//           ...(email ? [{ email }] : []),
//         ],
//       },
//     });

//     if (existingUser) {
//       const field = existingUser.phone === phone ? 'phone' : 'email';
//       return sendConflict(res, {
//         message: 'user_already_exists',
//         language: req.language,
//         variables: { field }
//       });
//     }

//     // Create new user
//     const user = await User.create({
//       first_name,
//       last_name,
//       phone,
//       email,
//       password,
//       role: role || 'customer',
//       city_id,
//       area_id,
//       is_verified: false,
//     });

//     console.log("✅ User.create() executed!");

//     // Generate OTP with Redis
//     const otpKey = `${phone}:signup`;
//     // const otp = await OTPService.generateOTP(otpKey);
//     // const otp=await OTPService.generateOTP(recipient, purpose);
//     const otp = await OTPService.generateOTP(phone, "signup");


//     // Send SMS
//     // const notificationService = NotificationFactory.getService('sms');
//     // await notificationService.sendOTP(phone, otp, 'signup');
//     const notificationService = NotificationFactory.getService('sms');
// await notificationService.sendOTP(phone, otp, "signup");

//     // Respond
//     return sendCreated(res, {
//       message: 'account_created_verify_otp',
//       language: req.language,
//       data: {
//         message: 'Please verify your phone number with the OTP sent to your phone',
//         expires_in: '5 minutes',
//         phone,
//       },
//     });

//   } catch (error) {
//     console.error('Signup error:', error);
//     return sendError(res, {
//       message: 'server_error',
//       language: req.language,
//       error: error.message,
//     });
//   }
// };
// const signup = async (req, res) => {
//   try {
//     let { first_name, last_name, phone, email, password, role, city_id, area_id } = req.body;

//     // Normalize phone only if provided
//     if (phone) phone = normalizePhoneNumber(phone);

//     // Required fields
//     if (!first_name || !last_name || (!phone && !email) || !password) {
//       return sendValidationError(res, {
//         errors: [{ message: "missing_required_fields" }],
//         language: req.language,
//       });
//     }

//     // Validate city & area
//     if (city_id || area_id) {
//       const { City, Area } = require('../models');

//       if (city_id) {
//         const city = await City.findByPk(city_id);
//         if (!city) {
//           return sendError(res, {
//             message: 'invalid_city_id',
//             statusCode: 400,
//             language: req.language
//           });
//         }
//       }

//       if (area_id) {
//         const area = await Area.findByPk(area_id);
//         if (!area) {
//           return sendError(res, {
//             message: 'invalid_area_id',
//             statusCode: 400,
//             language: req.language
//           });
//         }

//         if (city_id && area.city_id !== city_id) {
//           return sendError(res, {
//             message: 'area_does_not_belong',
//             statusCode: 400,
//             language: req.language
//           });
//         }
//       }
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({
//       where: {
//         [Op.or]: [
//           phone ? { phone } : {},
//           email ? { email } : {},
//         ],
//       },
//     });

//     if (existingUser) {
//       return sendConflict(res, {
//         message: 'user_already_exists',
//         language: req.language,
//       });
//     }

//     // Create user
//     const user = await User.create({
//       first_name,
//       last_name,
//       phone,
//       email,
//       password,
//       role: role || 'customer', // << save selected role
//       city_id,
//       area_id,
//       is_verified: true, // << auto-verified since we removed OTP
//     });

//     // Generate a token immediately
//     const token = generateToken(user);

//     return sendCreated(res, {
//       message: 'account_created_successfully',
//       language: req.language,
//       data: {
//         token,
//         user: user.toJSON(),
//       },
//     });

//   } catch (error) {
//     console.error('Signup error:', error);
//     return sendError(res, {
//       message: 'server_error',
//       language: req.language,
//       error: error.message,
//     });
//   }
// };
// controllers/auth.js
// const signup = async (req, res) => {
//   try {
//     let { first_name, last_name, phone, email, password, role, city_id, area_id } = req.body;

//     // Trim and normalize values
//     first_name = first_name?.trim();
//     last_name = last_name?.trim();
//     phone = phone?.trim();
//     email = email?.trim();

//     // Normalize phone only if provided and not empty
//     if (phone && phone !== '') {
//       phone = normalizePhoneNumber(phone);
//     } else {
//       phone = null; // Set to null if empty string
//     }

//     // Set email to null if empty string
//     if (email === '') {
//       email = null;
//     }

//     // Required fields - check for actual values (not empty strings)
//     const hasPhone = phone && phone !== '';
//     const hasEmail = email && email !== '';
    
//     if (!first_name || !last_name || (!hasPhone && !hasEmail) || !password) {
//       return sendValidationError(res, {
//         errors: [{ message: "missing_required_fields" }],
//         language: req.language,
//       });
//     }

//     // Validate city & area
//     if (city_id || area_id) {
//       const { City, Area } = require('../models');

//       if (city_id) {
//         const city = await City.findByPk(city_id);
//         if (!city) {
//           return sendError(res, {
//             message: 'invalid_city_id',
//             statusCode: 400,
//             language: req.language
//           });
//         }
//       }

//       if (area_id) {
//         const area = await Area.findByPk(area_id);
//         if (!area) {
//           return sendError(res, {
//             message: 'invalid_area_id',
//             statusCode: 400,
//             language: req.language
//           });
//         }

//         if (city_id && area.city_id !== city_id) {
//           return sendError(res, {
//             message: 'area_does_not_belong',
//             statusCode: 400,
//             language: req.language
//           });
//         }
//       }
//     }

//     // Check if user already exists - only check non-empty values
//     const whereConditions = [];
//     if (hasPhone) whereConditions.push({ phone });
//     if (hasEmail) whereConditions.push({ email });

//     const existingUser = await User.findOne({
//       where: {
//         [Op.or]: whereConditions
//       },
//     });

//     if (existingUser) {
//       return sendConflict(res, {
//         message: 'user_already_exists',
//         language: req.language,
//       });
//     }

//     // Create user
//     const user = await User.create({
//       first_name,
//       last_name,
//       phone: hasPhone ? phone : null, // Store as null if empty
//       email: hasEmail ? email : null, // Store as null if empty
//       password,
//       role: role || 'customer',
//       city_id,
//       area_id,
//       is_verified: true,
//     });

//     // Generate a token immediately
//     const token = generateToken(user);

//     return sendCreated(res, {
//       message: 'account_created_successfully',
//       language: req.language,
//       data: {
//         token,
//         user: user.toJSON(),
//       },
//     });

//   } catch (error) {
//     console.error('Signup error:', error);
//     return sendError(res, {
//       message: 'server_error',
//       language: req.language,
//       error: error.message,
//     });
//   }
// };
const signup = async (req, res) => {
  try {
    let { first_name, last_name, phone, email, password, role, city_id, area_id } = req.body;

    // Trim values
    first_name = first_name?.trim();
    last_name = last_name?.trim();
    phone = phone?.trim();
    email = email?.trim();

    // Convert empty strings to null
    if (phone === '') phone = null;
    if (email === '') email = null;

    // Normalize phone only if provided and not null
    if (phone) {
      phone = normalizePhoneNumber(phone);
    }

    // Required fields validation
    const hasPhone = phone && phone !== '';
    const hasEmail = email && email !== '';
    
    if (!first_name || !last_name || (!hasPhone && !hasEmail) || !password) {
      return sendValidationError(res, {
        errors: [{ message: "missing_required_fields" }],
        language: req.language,
      });
    }

    // Validate city & area
    if (city_id || area_id) {
      const { City, Area } = require('../models');

      if (city_id) {
        const city = await City.findByPk(city_id);
        if (!city) {
          return sendError(res, {
            message: 'invalid_city_id',
            statusCode: 400,
            language: req.language
          });
        }
      }

      if (area_id) {
        const area = await Area.findByPk(area_id);
        if (!area) {
          return sendError(res, {
            message: 'invalid_area_id',
            statusCode: 400,
            language: req.language
          });
        }

        if (city_id && area.city_id !== city_id) {
          return sendError(res, {
            message: 'area_does_not_belong',
            statusCode: 400,
            language: req.language
          });
        }
      }
    }

    // Check if user already exists
    const whereConditions = [];
    if (hasPhone) whereConditions.push({ phone });
    if (hasEmail) whereConditions.push({ email });

    const existingUser = await User.findOne({
      where: {
        [Op.or]: whereConditions
      },
    });

    if (existingUser) {
      return sendConflict(res, {
        message: 'user_already_exists',
        language: req.language,
      });
    }

    // Create user
    const user = await User.create({
      first_name,
      last_name,
      phone: hasPhone ? phone : null, // Store as null if not provided
      email: hasEmail ? email : null, // Store as null if not provided
      password,
      role: role || 'customer',
      city_id: city_id || null,
      area_id: area_id || null,
      is_verified: true,
    });

    // Generate a token immediately
    const token = generateToken(user);

    return sendCreated(res, {
      message: 'account_created_successfully',
      language: req.language,
      data: {
        token,
        user: user.toJSON(),
      },
    });

  } catch (error) {
    console.error('Signup error:', error);
    return sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      include: [
        {
          model: require('../models/provider'),
          as: 'provider_profile',
          required: false,
        },
      ],
    });
    
    if (!user) {
      return sendNotFound(res, {
        message: 'user_not_found',
        language: req.language
      });
    }
    
    return sendSuccess(res, {
      message: 'profile_retrieved',
      language: req.language,
      data: {
        user: user.toJSON(),
        provider_profile: user.provider_profile || null,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, email, address, city, area } = req.body;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return sendNotFound(res, {
        message: 'user_not_found',
        language: req.language
      });
    }
    
    // Check if email is being changed and is unique
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: { email, id: { [Op.ne]: userId } },
      });
      
      if (existingUser) {
        return sendConflict(res, {
          message: 'email_in_use',
          language: req.language
        });
      }
    }
    
    // Update user
    await user.update({
      first_name: first_name || user.first_name,
      last_name: last_name !== undefined ? last_name : user.last_name,
      email: email || user.email,
      address: address !== undefined ? address : user.address,
      city: city || user.city,
      area: area || user.area,
    });
    
    return sendSuccess(res, {
      message: 'profile_updated',
      language: req.language,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return sendNotFound(res, {
        message: 'user_not_found',
        language: req.language
      });
    }
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(current_password);
    
    if (!isPasswordValid) {
      return sendError(res, {
        message: 'current_password_incorrect',
        statusCode: 400,
        language: req.language
      });
    }
    
    // Update password
    user.password = new_password;
    await user.save();
    
    return sendSuccess(res, {
      message: 'password_changed',
      language: req.language
    });
  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    
    if (!user || !user.is_active) {
      return sendUnauthorized(res, {
        message: 'invalid_user',
        language: req.language
      });
    }
    
    // Generate new token
    const token = generateToken(user);
    
    return sendSuccess(res, {
      message: 'token_refreshed',
      language: req.language,
      data: {
        token,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  login,
  signup,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
};
