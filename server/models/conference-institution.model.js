/**
 * @file Defines the model that associates conferences and institutions
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConferenceInstitution extends Model {
    static associate(models) {
      // conferences
      ConferenceInstitution.belongsTo(models.conferences, {
        foreignKey: 'conferenceId',
        as: 'conference',
        onDelete: 'NO ACTION',
      });
      // institutions
      ConferenceInstitution.belongsTo(models.institutions, {
        foreignKey: 'institutionId',
        as: 'institution',
        onDelete: 'NO ACTION',
      });
    }
  }
  ConferenceInstitution.init({
    // id of conference
    conferenceId:  {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Conference',
        key: 'id',
      },
    },
    // id of institution
    institutionId:  {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Institution',
        key: 'id',
      },
    },
    // flags, whether institution acted as host, sponsor, or society
    host: DataTypes.BOOLEAN,
    sponsor: DataTypes.BOOLEAN,
    society: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ConferenceInstitution',
  });
  return ConferenceInstitution;
};