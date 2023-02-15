'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChairAffiliation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChairAffiliation.belongsTo(models.panels, {
        foreignKey: 'panelId',
        as: 'panel',
        onDelete: 'CASCADE',
      });
      ChairAffiliation.belongsTo(models.people, {
        foreignKey: 'chairId',
        as: 'chair',
        onDelete: 'CASCADE',
      });
      ChairAffiliation.belongsTo(models.institutions, {
        foreignKey: 'institutionId',
        as: 'institution',
        onDelete: 'CASCADE',
      });
    }
  }
  ChairAffiliation.init({
    panelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Panel',
        key: 'id',
      }
    },
    chairId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Person',
        key: 'id',
      }
    },
    institutionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Institution',
        key: 'id',
      }
    },
    department: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'ChairAffiliation',
  });
  return ChairAffiliation;
};
