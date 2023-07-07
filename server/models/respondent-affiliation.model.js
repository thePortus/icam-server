'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RespondentAffiliation extends Model {
    static associate(models) {
      // panels
      RespondentAffiliation.belongsTo(models.panels, {
        foreignKey: 'panelId',
        as: 'panel',
        onDelete: 'CASCADE',
      });
      // people
      RespondentAffiliation.belongsTo(models.people, {
        foreignKey: 'respondentId',
        as: 'respondent',
        onDelete: 'CASCADE',
      });
      // institutions
      RespondentAffiliation.belongsTo(models.institutions, {
        foreignKey: 'institutionId',
        as: 'institution',
        onDelete: 'CASCADE',
      });
    }
  }
  RespondentAffiliation.init({
    // id of panel
    panelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Panel',
        key: 'id',
      }
    },
    // id of person respondint
    respondentId: {
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
    modelName: 'RespondentAffiliation',
  });
  return RespondentAffiliation;
};