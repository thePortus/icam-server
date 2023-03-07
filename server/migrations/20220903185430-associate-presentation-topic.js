/**
 * @file Creates the n:m PresentationTopics table in the database
 * @author David J. Thomas
 */

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PresentationTopics', {
      presentationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Presentations',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      topicId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Topics',
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
    await queryInterface.dropTable('PresentationTopics');
  }
};