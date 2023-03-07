/**
 * @file Seeds the database with links between people and institutions, as participants
 * @author David J. Thomas
 */

const participantAffiliations = require('./import/data/participant-affiliations.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    for (const participantAffiliation of participantAffiliations) {
      await queryInterface.bulkInsert('ParticipantAffiliations', [
          {
            conferenceId: participantAffiliation.conferenceId,
            personId: participantAffiliation.personId,
            institutionId: participantAffiliation.institutionId,
            department: participantAffiliation.department,
            createdAt: participantAffiliation.createdAt? new Date(participantAffiliation.createdAt) : new Date(),
            updatedAt: participantAffiliation.updatedAt? new Date(participantAffiliation.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ParticipantAffiliations');
  }
};
