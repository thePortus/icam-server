'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PresentationTopic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PresentationTopic.belongsTo(models.presentations, {
        foreignKey: 'presentationId',
        as: 'presentation',
        onDelete: 'NO ACTION',
      });
      PresentationTopic.belongsTo(models.topics, {
        foreignKey: 'topicId',
        as: 'topic',
        onDelete: 'NO ACTION',
      });
    }
  }
  PresentationTopic.init({
    presentationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Presentation',
        key: 'id',
      }
    },
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