/**
 * @file Defines the model for presentations
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presentation extends Model {
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
    // id of panel
    panelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Panel',
        key: 'id',
      },
    },
    // title
    title: DataTypes.STRING,
    // short text description (or abstract)
    description: DataTypes.STRING,
    // full text of presentation
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Presentation',
  });
  return Presentation;
};