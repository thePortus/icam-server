/**
 * @file Defines the model that associates presenters with institutions.
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ParticipantAffiliation extends Model {
    static associate(models) {
      // conferences
      ParticipantAffiliation.belongsTo(models.conferences, {
        foreignKey: 'conferenceId',
        as: 'conference',
        onDelete: 'CASCADE'
      });
      // people
      ParticipantAffiliation.belongsTo(models.people, {
        foreignKey: 'personId',
        as: 'participant',
        onDelete: 'CASCADE'
      });
      // institutions
      ParticipantAffiliation.belongsTo(models.institutions, {
        foreignKey: 'institutionId',
        as: 'institution',
        onDelete: 'CASCADE'
      });
    }
  }
  ParticipantAffiliation.init({
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
    // id of institution
    institutionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Institution',
        key: 'id',
      }
    },
    // department (can be blank string)
    department: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ParticipantAffiliation',
  });
  return ParticipantAffiliation;
};