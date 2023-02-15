'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ConferenceDisciplines', {
      conferenceId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Conferences',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      disciplineId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Disciplines',
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
    await queryInterface.dropTable('ConferenceDisciplines');
  }
};
