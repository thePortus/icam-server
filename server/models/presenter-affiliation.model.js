/**
 * @file Defines the model that associates conference participants with institutions.
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PresenterAffiliation extends Model {
    static associate(models) {
      // presentations
      PresenterAffiliation.belongsTo(models.presentations, {
        foreignKey: 'presentationId',
        as: 'presentation',
        onDelete: 'CASCADE'
      });
      // people
      PresenterAffiliation.belongsTo(models.people, {
        foreignKey: 'personId',
        as: 'presenter',
        onDelete: 'CASCADE'
      });
      // institutions
      PresenterAffiliation.belongsTo(models.institutions, {
        foreignKey: 'institutionId',
        as: 'institution',
        onDelete: 'CASCADE'
      });
    }
  }
  PresenterAffiliation.init({
    // id of presentation
    presentationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Geographies',
        key: 'id',
      }
    },
    // id of presenter
    presenterId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'People',
        key: 'id',
      }
    },
    // id of institution
    institutionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Institutions',
        key: 'id',
      }
    },
    // department (can be empty string)
    department: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'PresenterAffiliation',
  });
  return PresenterAffiliation;
};