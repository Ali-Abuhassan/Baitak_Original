const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define(
  'service',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    category_other: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    name_en: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    name_ar: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    base_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price_type: {
      type: DataTypes.ENUM('hourly', 'fixed', 'custom'),
      defaultValue: 'hourly',
    },
    duration_hours: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 1,
    },
    packages: {
      type: DataTypes.JSON,
      defaultValue: [],
      // Example: [
      //   { name: 'Standard', price: 100, description: 'Basic service', features: [] },
      //   { name: 'Premium', price: 200, description: 'Premium service', features: [] }
      // ]
    },
    add_ons: {
      type: DataTypes.JSON,
      defaultValue: [],
      // Example: [
      //   { name: 'Extra room', price: 20, description: 'Clean additional room' }
      // ]
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    included_services: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    excluded_services: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    scope_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    min_advance_booking_hours: {
      type: DataTypes.INTEGER,
      defaultValue: 24,
    },
    max_advance_booking_days: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    booking_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'services',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Service;
