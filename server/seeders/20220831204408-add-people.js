/**
 * @file Seeds the database with starting people data.
 * @author David J. Thomas
 */

const people = require('./import/data/people.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    for (const person of people) {
      await queryInterface.bulkInsert('People', [
          {
            id: person.id,
            name: person.name,
            orcid: person.orcid,
            createdAt: person.createdAt? new Date(person.createdAt) : new Date(),
            updatedAt: person.updatedAt? new Date(person.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('People');
  }
};
