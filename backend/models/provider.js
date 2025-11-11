const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Provider = sequelize.define(
  'provider',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    business_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    business_name_en: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    business_name_ar: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bio_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bio_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    min_booking_hours: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    experience_years: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'suspended'),
      defaultValue: 'pending',
    },
    rating_avg: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    rating_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_bookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_earnings: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    available_days: {
      type: DataTypes.JSON,
      defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    },
    working_hours: {
      type: DataTypes.JSON,
      defaultValue: {
        start: '09:00',
        end: '18:00'
      },
    },
    service_areas: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    portfolio_images: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    certifications: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    languages: {
      type: DataTypes.JSON,
      defaultValue: ['English'],
    },
    instant_booking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    cancellation_policy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Verification documents
    id_verified_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    vocational_license_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    police_clearance_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // Verification badges (shown after admin approval)
    is_id_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_license_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_police_clearance_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'providers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Provider;
