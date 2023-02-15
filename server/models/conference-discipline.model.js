'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConferenceDiscipline extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ConferenceDiscipline.belongsTo(models.conferences, {
        foreignKey: 'conferenceId',
        as: 'conference',
        onDelete: 'NO ACTION',
      });
      ConferenceDiscipline.belongsTo(models.disciplines, {
        foreignKey: 'disciplineId',
        as: 'discipline',
        onDelete: 'NO ACTION',
      });
    }
  }
  ConferenceDiscipline.init({
    conferenceId:  {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Conference',
        key: 'id',
      },
    },
    disciplineId:  {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Discipline',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'ConferenceDiscipline',
  });
  return ConferenceDiscipline;
};
