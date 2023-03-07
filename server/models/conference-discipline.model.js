/**
 * @file Defines the model that associates conferences with disciplines.
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConferenceDiscipline extends Model {
    static associate(models) {
      // conferences
      ConferenceDiscipline.belongsTo(models.conferences, {
        foreignKey: 'conferenceId',
        as: 'conference',
        onDelete: 'NO ACTION',
      });
      // disciplines
      ConferenceDiscipline.belongsTo(models.disciplines, {
        foreignKey: 'disciplineId',
        as: 'discipline',
        onDelete: 'NO ACTION',
      });
    }
  }
  ConferenceDiscipline.init({
    // id of conference
    conferenceId:  {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Conference',
        key: 'id',
      },
    },
    // id of discipline
    disciplineId:  {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Discipline',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'ConferenceDiscipline',
  });
  return ConferenceDiscipline;
};
