module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ratings', 'city', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('ratings', 'review_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ratings', 'city');
    await queryInterface.removeColumn('ratings', 'review_ar');
  }
};
