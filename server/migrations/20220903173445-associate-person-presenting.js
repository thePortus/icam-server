'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PersonPresentings', {
      presentationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Presentations',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      personId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'People',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      name: {
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
    await queryInterface.dropTable('PersonPresentings');
  }
};