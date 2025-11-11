const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Area = sequelize.define(
  "area",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Foreign key to the City model",
    },
    name_en: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Area name in English",
    },
    name_ar: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Area name in Arabic",
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "URL-friendly area identifier",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Whether the area is active for service delivery",
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Order for displaying areas within a city",
    },
  },
  {
    tableName: "areas",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["city_id"],
      },
      {
        fields: ["slug"],
      },
      {
        fields: ["is_active"],
      },
      {
        fields: ["display_order"],
      },
      {
        fields: ["city_id", "is_active"],
      },
    ],
    scopes: {
      active: {
        where: {
          is_active: true,
        },
      },
      byCity: (cityId) => ({
        where: {
          city_id: cityId,
        },
      }),
    },
  }
);

module.exports = Area;
