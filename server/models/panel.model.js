/**
 * @file Defines the model for panels
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Panel extends Model {
    static associate(models) {
      // conferences
      Panel.belongsTo(models.conferences, {
        foreignKey: { name: 'conferenceId' },
        as: 'conference'
      });
      // people (chairs)
      Panel.belongsToMany(models.people, {
        through: 'PersonChairings',
        as: 'chairs',
        foreignKey: 'panelId',
        otherKey: 'personId',
      });
      // people (respondents)
      Panel.belongsToMany(models.people, {
        through: 'PersonRespondings',
        as: 'respondents',
        foreignKey: 'panelId',
        otherKey: 'personId',
      });
      // presentations
      Panel.hasMany(models.presentations, {
        foreignKey: 'panelId',
        as: 'presentations'
      });
    }
  }
  Panel.init({
    title: DataTypes.STRING,
    conferenceId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Conference',
        key: 'id',
      },
    },
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Panel',
  });
  return Panel;
};