/**
 * @file Defines the model that chairs with their panels
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonChairing extends Model {
    static associate(models) {
      // institutions
      PersonChairing.belongsToMany(models.institutions, {
        through: 'ChairAffiliations',
        foreignKey: ['panelId', 'personId'],
        as: 'affiliations'
      });
      // panels
      PersonChairing.belongsTo(models.panels, {
        foreignKey: 'panelId',
        as: 'panels'
      });
      // people
      PersonChairing.belongsTo(models.people, {
        foreignKey: 'personId',
        as: 'people'
      });
    }
  }
  PersonChairing.init({
    // id of panel
    panelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Panels',
        key: 'id'
      },
      allowNull: false,
    },
    // id of person
    personId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'People',
        key: 'id'
      },
      allowNull: false,
    },
    // optional name (if different in this appearance than canonical name)
    name: DataTypes.STRING,
    // optional title
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonChairing'
  });
  return PersonChairing;
};