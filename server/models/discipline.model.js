/**
 * @file Defines the model for disciplines.
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Discipline extends Model {
    static associate(models) {
      // conferences
      Discipline.belongsToMany(models.conferences, {
        through: 'ConferenceDisciplines',
        foreignKey: 'disciplineId',
        as: 'conferences'
      });
    }
  }
  Discipline.init({
    // title of discipline
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Discipline',
  });
  return Discipline;
};