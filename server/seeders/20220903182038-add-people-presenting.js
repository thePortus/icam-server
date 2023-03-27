/**
 * @file Seeds the database with links between people and presentations.
 * @author David J. Thomas
 */

const peoplePresenting = require('./import/data/people-presenting.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    for (const personPresenting of peoplePresenting) {
      await queryInterface.bulkInsert('PersonPresentings', [
          {
            presentationId: personPresenting.presentationId,
            personId: personPresenting.personId,
            name: personPresenting.name || null,
            isRespondent: personPresenting.isRespondent || false,
            createdAt: personPresenting.createdAt? new Date(personPresenting.createdAt) : new Date(),
            updatedAt: personPresenting.updatedAt? new Date(personPresenting.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PersonPresentings');
  }
};
