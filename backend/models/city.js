const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const City = sequelize.define(
  "city",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_en: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "City name in English",
    },
    name_ar: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "City name in Arabic",
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: "URL-friendly city identifier",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Whether the city is active for service delivery",
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Order for displaying cities in lists",
    },
  },
  {
    tableName: "cities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["slug"],
        unique: true,
      },
      {
        fields: ["is_active"],
      },
      {
        fields: ["display_order"],
      },
    ],
    scopes: {
      active: {
        where: {
          is_active: true,
        },
      },
    },
  }
);

module.exports = City;
