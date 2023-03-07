/**
 * @file Seeds the database with starting conference data.
 * @author David J. Thomas
 */

const conferences = require('./import/data/conferences.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const conference of conferences) {
      await queryInterface.bulkInsert('Conferences', [
          {
            id: conference.id,
            locationId: conference.locationId,
            title: conference.title,
            year: conference.year,
            startMonth: conference.startMonth,
            startDay: conference.startDay,
            endMonth: conference.endMonth,
            endDay: conference.endDay,
            createdAt: conference.createdAt? new Date(conference.createdAt) : new Date(),
            updatedAt: conference.updatedAt? new Date(conference.updatedAt) : new Date(),
          },
        ],
      {});
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Conferences');
  }
};
