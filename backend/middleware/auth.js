const jwt = require('jsonwebtoken');
const { User, Provider } = require('../models');
const env = require('../config/env');
const { generateToken } = require('../services/jwtHelper');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Provider,
          as: 'provider_profile',
          required: false,
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found',
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      provider_id: user.provider_profile?.id || null,
      provider_status: user.provider_profile?.status || null,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message,
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

const authorizeProvider = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'provider') {
    return res.status(403).json({
      success: false,
      message: 'Provider access required',
    });
  }

  if (req.user.provider_status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Provider account not approved',
    });
  }

  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findByPk(decoded.id);

    if (user && user.is_active) {
      req.user = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
      };
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }
  
  next();
};

// const generateToken = (user) => {
//   return jwt.sign(
//     {
//       id: user.id,
//       email: user.email,
//       phone: user.phone,
//       role: user.role,
//     },
//     env.jwtSecret,
//     {
//       expiresIn: env.jwtExpire,
//     }
//   );
// };

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeProvider,
  optionalAuth,
  generateToken,
};
