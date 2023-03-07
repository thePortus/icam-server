/**
 * @file Creates the n:m ParticipantAffiliations table in the database
 * @author David J. Thomas
 */

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ParticipantAffiliations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      conferenceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Conferences',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      personId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'People',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      institutionId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('ParticipantAffiliations');
  }
};