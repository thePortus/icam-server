/**
 * @file Seeds the database with links between people and panels.
 * @author David J. Thomas
 */

const peopleResponding = require('./import/data/people-responding.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    for (const personResponding of peopleResponding) {
      await queryInterface.bulkInsert('PersonRespondings', [
          {
            panelId: personResponding.panelId,
            personId: personResponding.personId,
            name: personResponding.name || null,
            title: personResponding.title || null,
            createdAt: personResponding.createdAt? new Date(personResponding.createdAt) : new Date(),
            updatedAt: personResponding.updatedAt? new Date(personResponding.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PersonRespondings');
  }
};
