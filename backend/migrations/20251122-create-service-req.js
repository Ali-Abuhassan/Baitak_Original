'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('service_req', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      city_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'cities', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      budget: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
      },

      service_date_type: {
        type: Sequelize.ENUM('today','tomorrow','day_after','other'),
        allowNull: false,
        defaultValue: 'today',
      },

      service_date_value: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: "Only set when service_date_type = 'other'",
      },

      service_time: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Free-text time (e.g., "8 PM", "Morning", "After 3 PM")',
      },

      address: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      images: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of image file paths or URLs',
      },

      status: {
        type: Sequelize.ENUM('pending','accepted','assigned','rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },

      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'providers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Add common indexes
    await queryInterface.addIndex('service_req', ['status']);
    await queryInterface.addIndex('service_req', ['category_id']);
    await queryInterface.addIndex('service_req', ['created_at']);
  },

  down: async (queryInterface /* Sequelize */) => {
    await queryInterface.dropTable('service_req');

    // Drop enums (Postgres needs cleanup; MySQL will drop when table dropped)
    // If using Postgres, remove enums explicitly if necessary.
  },
};
