/**
 * @file Seeds the database with starting panel data.
 * @author David J. Thomas
 */
const panels = require('./import/data/panels.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    for (const panel of panels) {
      await queryInterface.bulkInsert('Panels', [
          {
            id: panel.id,
            conferenceId: panel.conferenceId,
            title: panel.title || null,
            type: panel.type || null,
            createdAt: panel.createdAt? new Date(panel.createdAt) : new Date(),
            updatedAt: panel.updatedAt? new Date(panel.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Panels');
  }
};
