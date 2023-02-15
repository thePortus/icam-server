const presentationTopics = require('./import/data/presentation-topics.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const presentationTopic of presentationTopics) {
      await queryInterface.bulkInsert('PresentationTopics', [
          {
            presentationId: presentationTopic.presentationId,
            topicId: presentationTopic.topicId,
            createdAt: presentationTopic.createdAt? new Date(presentationTopic.createdAt) : new Date(),
            updatedAt: presentationTopic.updatedAt? new Date(presentationTopic.updatedAt) : new Date(),
          },
        ],
      {});
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PresentationTopics');
  }
};
