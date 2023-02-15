'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Presentation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // panels
      Presentation.belongsTo(models.panels, {
        foreignKey: { name: 'panelId' },
        as: 'panel'
      });
      // people
      Presentation.belongsToMany(models.people, {
        through: 'PersonPresenting',
        as: 'presenters',
        foreignKey: 'presentationId',
        otherKey: 'personId',
      });
      // topics
      Presentation.belongsToMany(models.topics, {
        through: 'PresentationTopics',
        foreignKey: 'presentationId',
        as: 'topics'
      });
      // geographies
      Presentation.belongsToMany(models.geographies, {
        through: 'PresentationGeographies',
        foreignKey: 'presentationId',
        as: 'geographies'
      });
    }
  }
  Presentation.init({
    panelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Panel',
        key: 'id',
      },
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Presentation',
  });
  return Presentation;
};