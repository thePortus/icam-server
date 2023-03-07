/**
 * @file Creates the n:m PresenterAffiliations table in the database
 * @author David J. Thomas
 */

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PresenterAffiliations', {
      presentationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Presentations',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      presenterId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'People',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      institutionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Institutions',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      department: {
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
    await queryInterface.dropTable('PresenterAffiliations');
  }
};