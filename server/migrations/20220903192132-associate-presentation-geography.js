/**
 * @file Creates the n:m PresentationGeographies table in the database
 * @author David J. Thomas
 */

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PresentationGeographies', {
      presentationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Presentations',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      geographyId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Geographies',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('PresentationGeographies');
  }
};