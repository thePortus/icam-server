/**
 * @file Seeds the database with starting topic data.
 * @author David J. Thomas
 */

const topics = require('./import/data/topics.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const topic of topics) {
      await queryInterface.bulkInsert('Topics', [
          {
            id: topic.id,
            title: topic.title,
            createdAt: topic.createdAt? new Date(topic.createdAt) : new Date(),
            updatedAt: topic.updatedAt? new Date(topic.updatedAt) : new Date(),
          },
        ],
      {});
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Topics');
  }
};
