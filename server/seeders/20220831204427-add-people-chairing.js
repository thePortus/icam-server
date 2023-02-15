const peopleChairing = require('./import/data/people-chairing.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    for (const personChairing of peopleChairing) {
      await queryInterface.bulkInsert('PersonChairings', [
          {
            panelId: personChairing.panelId,
            personId: personChairing.personId,
            name: personChairing.name || null,
            title: personChairing.title || null,
            createdAt: personChairing.createdAt? new Date(personChairing.createdAt) : new Date(),
            updatedAt: personChairing.updatedAt? new Date(personChairing.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PersonChairings');
  }
};
