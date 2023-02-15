'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ConferenceInstitutions', {
      conferenceId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Conferences',
          key: 'id'
        },
        onDelete: 'NO ACTION'
      },
      institutionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Institutions',
          key: 'id'
        },
        onDelete: 'NO ACTION'
      },
      host: {
        type: Sequelize.BOOLEAN
      },
      sponsor: {
        type: Sequelize.BOOLEAN
      },
      society: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('ConferenceInstitutions');
  }
};