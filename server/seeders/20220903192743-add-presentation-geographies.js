const presentationGeographies = require('./import/data/presentation-geographies.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const presentationGeography of presentationGeographies) {
      await queryInterface.bulkInsert('PresentationGeographies', [
          {
            presentationId: presentationGeography.presentationId,
            geographyId: presentationGeography.geographyId,
            createdAt: presentationGeography.createdAt? new Date(presentationGeography.createdAt) : new Date(),
            updatedAt: presentationGeography.updatedAt? new Date(presentationGeography.updatedAt) : new Date(),
          },
        ],
      {});
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PresentationGeographies');
  }
};
