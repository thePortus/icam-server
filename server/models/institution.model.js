/**
 * @file Defines the model for institutions.
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Institution extends Model {
    static associate(models) {
      // location
      Institution.belongsTo(models.locations, {
        foreignKey: { name: 'locationId' },
        as: 'location'
      });
      // conferences
      Institution.belongsToMany(models.conferences, {
        through: 'ConferenceInstitutions',
        foreignKey: 'institutionId',
        as: 'conferences'
      });
      // people (chairs)
      Institution.belongsToMany(models.people, {
        through: 'ChairAffiliation',
        foreignKey: 'institutionId',
        as: 'chairs'
      });
      // people (respondents)
      Institution.belongsToMany(models.people, {
        through: 'RespondentAffiliation',
        foreignKey: 'institutionId',
        as: 'respondents'
      });
      // people (presenters)
      Institution.belongsToMany(models.people, {
        through: 'PresenterAffiliation',
        foreignKey: 'institutionId',
        as: 'presenters'
      });
      // people (participants)
      Institution.belongsToMany(models.people, {
        through: 'ParticipantAffiliation',
        foreignKey: 'institutionId',
        as: 'participants'
      });
    }
  }
  Institution.init({
    // id of institution's location
    locationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Location',
        key: 'id',
      },
    },
    // title of institution
    title: DataTypes.STRING,
    // type of institution (e.g. University, College, et c.)
    type: DataTypes.STRING,
    // funding of institution (e.g. Public, Private)
    funding: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Institution',
  });
  return Institution;
};