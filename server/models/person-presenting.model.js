/**
 * @file Defines the model that presenters with their presentations
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonPresenting extends Model {
    static associate(models) {
      // people
      PersonPresenting.belongsTo(models.people, {
        foreignKey: 'personId',
        as: 'person',
        onDelete: 'NO ACTION',
      });
      // presentations
      PersonPresenting.belongsTo(models.presentations, {
        foreignKey: 'presentationId',
        as: 'presentation',
        onDelete: 'NO ACTION',
      });
    }
  }
  PersonPresenting.init({
    // id of presentation
    presentationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Presentation',
        key: 'id',
      },
    },
    // id of person
    personId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Person',
        key: 'id',
      },
    },
    // optional name (if different in this appearance than canonical name)
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonPresenting',
  });
  return PersonPresenting;
};