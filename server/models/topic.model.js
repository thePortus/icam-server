/**
 * @file Defines the model for topics
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    static associate(models) {
      // presentations
      Topic.belongsToMany(models.presentations, {
        through: 'PresentationTopics',
        foreignKey: 'topicId',
        as: 'presentations'
      });
    }
  }
  Topic.init({
    // title of topic
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Topic',
  });
  return Topic;
};