/**
 * @file Seeds the database with starting location data.
 * @author David J. Thomas
 */
const locations = require('./import/data/locations.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const location of locations) {
      await queryInterface.bulkInsert('Locations', [
          {
            id: location.id,
            title: location.title,
            city: location.city,
            state: location.state,
            country: location.country,
            createdAt: location.createdAt? new Date(location.createdAt) : new Date(),
            updatedAt: location.updatedAt? new Date(location.updatedAt) : new Date(),
          },
        ],
      {});
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Locations');
  }
};
