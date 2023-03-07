/**
 * @file Seeds the database with starting institution data.
 * @author David J. Thomas
 */

const institutions = require('./import/data/institutions.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const institution of institutions) {
      await queryInterface.bulkInsert('Institutions', [
          {
            id: institution.id,
            locationId: institution.locationId,
            title: institution.title,
            type: institution.type,
            funding: institution.funding,
            createdAt: institution.createdAt? new Date(institution.createdAt) : new Date(),
            updatedAt: institution.updatedAt? new Date(institution.updatedAt) : new Date(),
          },
        ],
      {});
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Institutions');
  }
};
