const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpire,
    }
  );
};

module.exports = {
  generateToken
};