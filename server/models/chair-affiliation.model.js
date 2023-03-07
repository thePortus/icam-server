/**
 * @file Defines the model that associates panel chairs with institutions.
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChairAffiliation extends Model {
    static associate(models) {
      // panels
      ChairAffiliation.belongsTo(models.panels, {
        foreignKey: 'panelId',
        as: 'panel',
        onDelete: 'CASCADE',
      });
      // people
      ChairAffiliation.belongsTo(models.people, {
        foreignKey: 'chairId',
        as: 'chair',
        onDelete: 'CASCADE',
      });
      // institutions
      ChairAffiliation.belongsTo(models.institutions, {
        foreignKey: 'institutionId',
        as: 'institution',
        onDelete: 'CASCADE',
      });
    }
  }
  ChairAffiliation.init({
    // id of panel
    panelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Panel',
        key: 'id',
      }
    },
    // id of person chairing
    chairId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Person',
        key: 'id',
      }
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
    department: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'ChairAffiliation',
  });
  return ChairAffiliation;
};
