/**
* @file Seeds the database with starting links between conferences and disciplines.
* @author David J. Thomas
*/

const conferencesDisciplines = require('./import/data/conference-disciplines.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const conferencesDiscipline of conferencesDisciplines) {
      await queryInterface.bulkInsert('ConferenceDisciplines', [
          {
            conferenceId: conferencesDiscipline.conferenceId,
            disciplineId: conferencesDiscipline.disciplineId,
            createdAt: conferencesDiscipline.createdAt? new Date(conferencesDiscipline.createdAt) : new Date(),
            updatedAt: conferencesDiscipline.updatedAt? new Date(conferencesDiscipline.updatedAt) : new Date(),
          },
        ],
      {});
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ConferenceDisciplines');
  }
};
