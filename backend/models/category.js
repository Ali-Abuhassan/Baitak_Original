const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define(
  'category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    name_en: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    name_ar: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
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
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    meta_title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    suggested_price_range: {
      type: DataTypes.JSON,
      defaultValue: {
        min: 0,
        max: 0,
        currency: 'USD'
      },
    },
  },
  {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Category;
