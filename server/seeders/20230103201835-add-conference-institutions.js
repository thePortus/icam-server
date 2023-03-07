/**
 * @file Seeds the database with links conferences and institutions.
 * @author David J. Thomas
 */

const conferencesInstitutions = require('./import/data/conference-institutions.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    for (const conferencesInstitution of conferencesInstitutions) {
      await queryInterface.bulkInsert('ConferenceInstitutions', [
          {
            conferenceId: conferencesInstitution.conferenceId,
            institutionId: conferencesInstitution.institutionId,
            sponsor: conferencesInstitution.sponsor,
            host: conferencesInstitution.host,
            society: conferencesInstitution.society,
            createdAt: conferencesInstitution.createdAt? new Date(conferencesInstitution.createdAt) : new Date(),
            updatedAt: conferencesInstitution.updatedAt? new Date(conferencesInstitution.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ConferenceInstitutions');
  }
};
