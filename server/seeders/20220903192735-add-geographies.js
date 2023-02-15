const geographies = require('./import/data/geographies.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const geography of geographies) {
      await queryInterface.bulkInsert('Geographies', [
          {
            id: geography.id,
            title: geography.title,
            createdAt: geography.createdAt? new Date(geography.createdAt) : new Date(),
            updatedAt: geography.updatedAt? new Date(geography.updatedAt) : new Date(),
          },
        ],
      {});
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Geographies');
  }
};
