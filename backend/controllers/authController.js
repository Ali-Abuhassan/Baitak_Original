const { User, OtpVerification } = require('../models');
const { generateToken } = require('../middleware/auth');
const NotificationFactory = require('../services/notificationService');
const emailService = require('../services/emailService');
const { Op } = require('sequelize');
const { sendSuccess, sendError, sendNotFound, sendConflict, sendCreated, sendUnauthorized, sendForbidden, sendValidationError } = require('../utils/responseHelper');
const { normalizePhoneNumber } = require('../utils/phoneNormalizer');

const sendOTP = async (req, res) => {
  try {
    let { phone, email, purpose } = req.body;
    
    // Normalize phone number if provided
    if (phone) {
      phone = normalizePhoneNumber(phone);
    }
    
    // Determine notification type and recipient
    const notificationType = phone ? 'sms' : 'email';
    const recipient = phone || email;
    const fieldType = phone ? 'phone' : 'email';
    
    // For login, check if user exists
    if (purpose === 'login') {
      const user = await User.findOne({
        where: { [fieldType]: recipient },
      });
      
      if (!user) {
        return sendNotFound(res, {
          message: 'user_not_found_signup',
          language: req.language
        });
      }
    }
    
    // For signup, check if user already exists
    if (purpose === 'signup') {
      const existingUser = await User.findOne({
        where: { [fieldType]: recipient },
      });
      
      if (existingUser) {
        return sendConflict(res, {
          message: 'user_already_exists',
          language: req.language,
          variables: { field: fieldType }
        });
      }
    }
    
    // Generate and save OTP
    const otpRecord = await OtpVerification.createOTP(recipient, purpose, fieldType);
    
    // Send OTP via appropriate channel
    const notificationService = NotificationFactory.getService(notificationType);
    await notificationService.sendOTP(recipient, otpRecord.otp, purpose);
    
    return sendSuccess(res, {
      message: 'otp_sent',
      language: req.language,
      data: {
        purpose,
        expires_in: '10 minutes',
      },
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    let { phone, email, otp, purpose, first_name, last_name, password, role } = req.body;
    
    // Normalize phone number if provided
    if (phone) {
      phone = normalizePhoneNumber(phone);
    }
    
    const recipient = phone || email;
    const fieldType = phone ? 'phone' : 'email';
    
    // For signup verification, also accept 'verify_phone' or 'verify_email' purposes
    // If user is trying to verify with 'verify_phone'/'verify_email' but there's an unverified user,
    // it means they're verifying after signup, so use 'signup' purpose instead
    let isSignupVerification = false;
    if (purpose === 'verify_phone' || purpose === 'verify_email') {
      const unverifiedUser = await User.findOne({
        where: { [fieldType]: recipient, is_verified: false },
      });
      if (unverifiedUser) {
        isSignupVerification = true;
        purpose = 'signup'; // Use signup purpose for verification since OTP was sent with signup purpose
      }
    }
    
    // Verify OTP
    const isValid = await OtpVerification.verifyOTP(recipient, otp, purpose, fieldType);
    
    if (!isValid) {
      return sendError(res, {
        message: 'otp_invalid',
        statusCode: 400,
        language: req.language
      });
    }
    
    let user;
    let isNewUser = false;
    
    // Handle different purposes
    if (purpose === 'signup' || isSignupVerification) {
      // Find existing unverified user created during signup (include provider profile if exists)
      user = await User.findOne({
        where: { [fieldType]: recipient, is_verified: false },
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
          message: 'user_not_found_or_already_verified',
          language: req.language
        });
      }
      
      // Verify the user
      user.is_verified = true;
      await user.save();
      isNewUser = true;
      
      // Send welcome email if email is provided
      if (email || user.email) {
        try {
          await emailService.sendWelcomeEmail(email || user.email, user.first_name);
        } catch (emailError) {
          console.error('Welcome email error:', emailError);
        }
      }
    } else if (purpose === 'login') {
      // Find existing user (include provider profile)
      user = await User.findOne({
        where: { [fieldType]: recipient },
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
      
      // Ensure user is verified before allowing login
      if (!user.is_verified) {
        // Verify the user during login OTP verification
        user.is_verified = true;
        await user.save();
      }
      
      // Update last login
      user.last_login = new Date();
      await user.save();
    } else if (purpose === 'verify_phone' || purpose === 'verify_email') {
      // Find user and mark as verified (for existing verified users updating their phone/email)
      user = await User.findOne({
        where: { [fieldType]: recipient },
      });
      
      if (!user) {
        return sendNotFound(res, {
          message: 'user_not_found',
          language: req.language
        });
      }
      
      // Only verify if not already verified (to avoid overriding signup verification)
      if (!user.is_verified) {
        user.is_verified = true;
        await user.save();
      }
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Prepare user data with provider profile if exists
    const userData = user.toJSON ? user.toJSON() : user;
    const responseData = {
      token,
      user: userData,
      is_new_user: isNewUser,
    };
    
    // Include provider profile if user is a provider
    if (user.provider_profile) {
      responseData.provider_profile = user.provider_profile;
    } else if (userData.role === 'provider') {
      // Fetch provider profile if not included in query
      const { Provider } = require('../models');
      const providerProfile = await Provider.findOne({
        where: { user_id: user.id },
      });
      if (providerProfile) {
        responseData.provider_profile = providerProfile.toJSON ? providerProfile.toJSON() : providerProfile;
      }
    }
    
    return sendSuccess(res, {
      message: isNewUser ? 'account_created' : 'otp_verified',
      language: req.language,
      data: responseData,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    sendError(res, {
      message: 'server_error',
      language: req.language,
      error: error.message,
    });
  }
};

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
    
    // Check if user phone is verified
    if (!user.is_verified) {
      return sendForbidden(res, {
        message: 'phone_verification_required',
        language: req.language,
        data: {
          message: 'Please verify your phone number before logging in. Use /send-otp and /verify-otp endpoints.',
        },
      });
    }
    
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

const signup = async (req, res) => {
  try {
    let { first_name, last_name, phone, email, password, role, city_id, area_id } = req.body;
    
    // Normalize phone number if provided
    if (phone) {
      phone = normalizePhoneNumber(phone);
    }
    
    // Validate required fields
    if (!first_name || !phone) {
      return sendValidationError(res, {
        errors: [
          { field: 'first_name', message: 'first_name_required' },
          { field: 'phone', message: 'phone_required' }
        ],
        language: req.language
      });
    }
    
    // Validate city and area if provided
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
        
        // If both city_id and area_id are provided, validate that area belongs to city
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
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { phone },
          ...(email ? [{ email }] : []),
        ],
      },
    });
    
    if (existingUser) {
      const field = existingUser.phone === phone ? 'phone' : 'email';
      return sendConflict(res, {
        message: 'user_already_exists',
        language: req.language,
        variables: { field }
      });
    }
    
    // Create new user
    const user = await User.create({
      first_name,
      last_name,
      phone,
      email,
      password,
      role: role || 'customer',
      city_id,
      area_id,
      is_verified: false, // Will be verified via OTP
    });
    
    // Generate OTP for verification
    const otpRecord = await OtpVerification.createOTP(phone, 'signup', 'phone');
    
    // Send OTP
    const notificationService = NotificationFactory.getService('sms');
    await notificationService.sendOTP(phone, otpRecord.otp, 'signup');
    
    // Don't return token or user data - user must verify OTP first
    // Don't send welcome email yet - will be sent after OTP verification
    return sendCreated(res, {
      message: 'account_created_verify_otp',
      language: req.language,
      data: {
        message: 'Please verify your phone number with the OTP sent to your phone',
        expires_at: otpRecord.expires_at,
        phone: phone,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    sendError(res, {
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
