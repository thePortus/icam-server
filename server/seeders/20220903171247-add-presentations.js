/**
 * @file Seeds the database with starting presentation data.
 * @author David J. Thomas
 */

const presentations = require('./import/data/presentations.json');

module.exports = {
  async up (queryInterface, Sequelize) {
      for (const presentation of presentations) {
        await queryInterface.bulkInsert('Presentations', [
            {
              id: presentation.id,
              panelId: presentation.panelId,
              title: presentation.title || null,
              description: presentation.description || null,
              text: presentation.text || null,
              createdAt: presentation.createdAt? new Date(presentation.createdAt) : new Date(),
              updatedAt: presentation.updatedAt? new Date(presentation.updatedAt) : new Date(),
            },
          ],
        {});
      }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Presentations');
  }
};
