const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define(
  'booking',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_number: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
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
    booking_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    booking_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    duration_hours: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'pending_provider_accept',
        'confirmed',
        'provider_on_way',
        'provider_arrived',
        'in_progress',
        'completed',
        'cancelled',
        'refunded'
      ),
      defaultValue: 'pending_provider_accept',
    },
    package_selected: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    add_ons_selected: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    service_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    service_city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    service_area: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    base_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    add_ons_price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM('cash', 'card', 'online'),
      defaultValue: 'cash',
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded'),
      defaultValue: 'pending',
    },
    customer_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    provider_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellation_category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cancelled_by: {
      type: DataTypes.ENUM('customer', 'provider', 'admin'),
      allowNull: true,
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    confirmed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    customer_attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    provider_attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Actual amount paid by customer (can differ from total_price)',
    },
    provider_satisfaction: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Provider satisfaction rating with customer (1.00 to 5.00)',
      validate: {
        min: 1.0,
        max: 5.0,
      },
    },
  },
  {
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (booking) => {
        // Generate unique booking number if not provided
        if (!booking.booking_number) {
          const timestamp = Date.now().toString(36).toUpperCase();
          const random = Math.random().toString(36).substring(2, 5).toUpperCase();
          booking.booking_number = `BK${timestamp}${random}`;
        }
      },
      beforeValidate: async (booking) => {
        // Ensure booking number is generated before validation
        if (!booking.booking_number) {
          const timestamp = Date.now().toString(36).toUpperCase();
          const random = Math.random().toString(36).substring(2, 5).toUpperCase();
          booking.booking_number = `BK${timestamp}${random}`;
        }
      },
    },
  }
);

module.exports = Booking;
