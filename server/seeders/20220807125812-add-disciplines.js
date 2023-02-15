const disciplines = require('./import/data/disciplines.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const discipline of disciplines) {
      await queryInterface.bulkInsert('Disciplines', [
          {
            id: discipline.id,
            title: discipline.title,
            createdAt: discipline.createdAt? new Date(discipline.createdAt) : new Date(),
            updatedAt: discipline.updatedAt? new Date(discipline.updatedAt) : new Date(),
          },
        ],
      {});
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Disciplines');
  }
};
