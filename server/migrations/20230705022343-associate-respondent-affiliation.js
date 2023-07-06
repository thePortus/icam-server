/**
 * @file Creates the n:m RespondentAffiliations table in the database
 * @author David J. Thomas
 */

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RespondentAffiliations', {
      panelId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Panels', key: 'id' },
        onDelete: 'CASCADE'
      },
      respondentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'People', key: 'id' },
        onDelete: 'CASCADE'
      },
      institutionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Institutions', key: 'id' },
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
    await queryInterface.dropTable('RespondentAffiliations');
  }
};