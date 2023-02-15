const chairAffiliations = require('./import/data/chair-affiliations.json');


module.exports = {
  async up (queryInterface, Sequelize) {
    for (const chairAffiliation of chairAffiliations) {
      await queryInterface.bulkInsert('ChairAffiliations', [
          {
            panelId: chairAffiliation.panelId,
            chairId: chairAffiliation.chairId,
            institutionId: chairAffiliation.institutionId,
            department: chairAffiliation.department,
            createdAt: chairAffiliation.createdAt? new Date(chairAffiliation.createdAt) : new Date(),
            updatedAt: chairAffiliation.updatedAt? new Date(chairAffiliation.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ChairAffiliations');
  }
};
