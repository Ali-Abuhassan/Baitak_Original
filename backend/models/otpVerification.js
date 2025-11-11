const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OtpVerification = sequelize.define(
  'otp_verification',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    purpose: {
      type: DataTypes.ENUM('login', 'signup', 'reset_password', 'verify_phone', 'verify_email', 'booking_confirmation'),
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'otp_verifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Static methods
OtpVerification.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

OtpVerification.createOTP = async (phoneOrEmail, purpose, type = 'phone') => {
  const otp = OtpVerification.generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  const data = {
    otp,
    purpose,
    expires_at: expiresAt,
  };
  
  if (type === 'phone') {
    data.phone = phoneOrEmail;
  } else {
    data.email = phoneOrEmail;
  }
  
  // Invalidate previous OTPs
  await OtpVerification.update(
    { is_verified: true },
    {
      where: {
        [type]: phoneOrEmail,
        purpose,
        is_verified: false,
      },
    }
  );
  
  return await OtpVerification.create(data);
};

OtpVerification.verifyOTP = async (phoneOrEmail, otp, purpose, type = 'phone') => {
  const where = {
    otp,
    purpose,
    is_verified: false,
    expires_at: {
      [require('sequelize').Op.gt]: new Date(),
    },
  };
  
  if (type === 'phone') {
    where.phone = phoneOrEmail;
  } else {
    where.email = phoneOrEmail;
  }
  
  const verification = await OtpVerification.findOne({ where });
  
  if (!verification) {
    // Increment attempts for wrong OTP
    await OtpVerification.increment('attempts', {
      where: {
        [type]: phoneOrEmail,
        purpose,
        is_verified: false,
      },
    });
    return false;
  }
  
  // Mark as verified
  verification.is_verified = true;
  verification.verified_at = new Date();
  await verification.save();
  
  return true;
};

module.exports = OtpVerification;
