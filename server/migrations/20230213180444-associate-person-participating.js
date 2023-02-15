'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PersonParticipatings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      conferenceId: {
        type: Sequelize.INTEGER
      },
      personId: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PersonParticipatings');
  }
};