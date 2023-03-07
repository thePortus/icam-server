/**
 * @file Seeds the database with links between people and institutions, as presenters
 * @author David J. Thomas
 */

const presenterAffiliations = require('./import/data/presenter-affiliations.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    for (const presenterAffiliation of presenterAffiliations) {
      await queryInterface.bulkInsert('PresenterAffiliations', [
          {
            presentationId: presenterAffiliation.presentationId,
            presenterId: presenterAffiliation.presenterId,
            institutionId: presenterAffiliation.institutionId,
            department: presenterAffiliation.department,
            createdAt: presenterAffiliation.createdAt? new Date(presenterAffiliation.createdAt) : new Date(),
            updatedAt: presenterAffiliation.updatedAt? new Date(presenterAffiliation.updatedAt) : new Date(),
          },
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PresenterAffiliations');
  }
};
