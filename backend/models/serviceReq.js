// // models/serviceReq.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const ServiceReq = sequelize.define(
//   'service_req',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     name: {
//       type: DataTypes.STRING(150),
//       allowNull: false,
//     },
//     phone: {
//       type: DataTypes.STRING(40),
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING(150),
//       allowNull: true,
//       validate: {
//         isEmail: true,
//       },
//     },
//     city_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'cities',
//         key: 'id',
//       },
//     },
//     category_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'categories',
//         key: 'id',
//       },
//     },
//     service_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },
//     service_time: {
//       type: DataTypes.TIME,
//       allowNull: true,
//     },
//     images: {
//       type: DataTypes.JSON,
//       allowNull: true,
//       defaultValue: [],
//       comment: 'Array of uploaded image file paths/URLs',
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     status: {
//       type: DataTypes.ENUM('pending', 'accepted', 'assigned', 'rejected'),
//       defaultValue: 'pending',
//     },
//     provider_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'providers',
//         key: 'id',
//       },
//     },
//   },
//   {
//     tableName: 'service_req',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   }
// );

// module.exports = ServiceReq;
// models/serviceReq.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceReq = sequelize.define(
  'service_req',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: { isEmail: true },
    },

    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'cities', key: 'id' },
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    budget: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },

    service_date_type: {
      type: DataTypes.ENUM('today','tomorrow','day_after','other'),
      allowNull: false,
      defaultValue: 'today',
    },

    service_date_value: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Only filled if user chose 'other'",
    },

    service_time: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Array of image file paths/URLs',
    },

    status: {
      type: DataTypes.ENUM('pending','accepted','assigned','rejected'),
      defaultValue: 'pending',
    },

    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'providers', key: 'id' },
    },
  },
  {
    tableName: 'service_req',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = ServiceReq;
