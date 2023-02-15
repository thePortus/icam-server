'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConferenceInstitution extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ConferenceInstitution.belongsTo(models.conferences, {
        foreignKey: 'conferenceId',
        as: 'conference',
        onDelete: 'NO ACTION',
      });
      ConferenceInstitution.belongsTo(models.institutions, {
        foreignKey: 'institutionId',
        as: 'institution',
        onDelete: 'NO ACTION',
      });
    }
  }
  ConferenceInstitution.init({
    conferenceId:  {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Conference',
        key: 'id',
      },
    },
    institutionId:  {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Institution',
        key: 'id',
      },
    },
    host: DataTypes.BOOLEAN,
    sponsor: DataTypes.BOOLEAN,
    society: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ConferenceInstitution',
  });
  return ConferenceInstitution;
};