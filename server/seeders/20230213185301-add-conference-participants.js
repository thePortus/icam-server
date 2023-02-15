const peopleParticipating= require('./import/data/people-participating.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    for (const personParticipating of peopleParticipating) {
      await queryInterface.bulkInsert('PersonParticipatings', [
          {
            conferenceId: personPresenting.conferenceId,
            personId: personPresenting.personId,
            name: personPresenting.name || null,
            role: personPresenting.role || null,
            createdAt: personPresenting.createdAt? new Date(personPresenting.createdAt) : new Date(),
            updatedAt: personPresenting.updatedAt? new Date(personPresenting.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PersonParticipatings');
  }
};
