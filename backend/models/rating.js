const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define(
  'rating',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    provider_response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    provider_response_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    is_verified_purchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    helpful_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'ratings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Rating;
