/**
 * @file Seeds the database with links between conferences and people.
 * @author David J. Thomas
 */

const peopleParticipating= require('./import/data/people-participating.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    for (const personParticipating of peopleParticipating) {
      await queryInterface.bulkInsert('PersonParticipatings', [
          {
            conferenceId: personParticipating.conferenceId,
            personId: personParticipating.personId,
            name: personParticipating.name || null,
            role: personParticipating.role || null,
            createdAt: personParticipating.createdAt? new Date(personParticipating.createdAt) : new Date(),
            updatedAt: personParticipating.updatedAt? new Date(personParticipating.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PersonParticipatings');
  }
};
