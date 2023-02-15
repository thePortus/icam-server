'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discipline extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // conferences
      Discipline.belongsToMany(models.conferences, {
        through: 'ConferenceDisciplines',
        foreignKey: 'disciplineId',
        as: 'conferences'
      });
    }
  }
  Discipline.init({
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Discipline',
  });
  return Discipline;
};