/**
 * @file Seeds the database with links between people and institutions, as respondents
 * @author David J. Thomas
 */

const respondentAffiliations = require('./import/data/respondent-affiliations.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    for (const respondentAffiliation of respondentAffiliations) {
      await queryInterface.bulkInsert('RespondentAffiliations', [
          {
            panelId: respondentAffiliation.panelId,
            respondentId: respondentAffiliation.respondentId,
            institutionId: respondentAffiliation.institutionId,
            department: respondentAffiliation.department,
            createdAt: respondentAffiliation.createdAt? new Date(respondentAffiliation.createdAt) : new Date(),
            updatedAt: respondentAffiliation.updatedAt? new Date(respondentAffiliation.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RespondentAffiliations');
  }
};
