'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PresenterAffiliation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PresenterAffiliation.init({
    presentationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Geographies',
        key: 'id',
      }
    },
    presenterId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'People',
        key: 'id',
      }
    },
    institutionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Institutions',
        key: 'id',
      }
    },
    department: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'PresenterAffiliation',
  });
  return PresenterAffiliation;
};