/**
 * @file Defines the model that participants with their conferences
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonParticipating extends Model {
    static associate(models) {
      // institutions
      PersonParticipating.belongsToMany(models.institutions, {
        through: 'ParticipantAffiliations',
        foreignKey: ['conferenceId', 'personId'],
        as: 'affiliations'
      });
      // conferences
      PersonParticipating.belongsTo(models.conferences, {
        foreignKey: 'conferenceId',
        as: 'conferences'
      });
      // people
      PersonParticipating.belongsTo(models.people, {
        foreignKey: 'personId',
        as: 'people'
      });
    }
  }
  PersonParticipating.init({
    // id of conference
    conferenceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Conferences',
        key: 'id'
      },
      allowNull: false,
    },
    // id of participant
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
    // role in which they were acting
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonParticipating',
  });
  return PersonParticipating;
};