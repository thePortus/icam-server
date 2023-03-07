/**
 * @file Defines the model that presentations with their topics
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PresentationTopic extends Model {
    static associate(models) {
      // presentations
      PresentationTopic.belongsTo(models.presentations, {
        foreignKey: 'presentationId',
        as: 'presentation',
        onDelete: 'NO ACTION',
      });
      // topics
      PresentationTopic.belongsTo(models.topics, {
        foreignKey: 'topicId',
        as: 'topic',
        onDelete: 'NO ACTION',
      });
    }
  }
  PresentationTopic.init({
    // id of presentation
    presentationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Presentation',
        key: 'id',
      }
    },
    // id of topic
    topicId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Topic',
        key: 'id',
      }
    }
  }, {
    sequelize,
    modelName: 'PresentationTopic',
  });
  return PresentationTopic;
};