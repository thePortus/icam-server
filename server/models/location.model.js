'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // institutions
      Location.hasMany(models.institutions, {
        foreignKey: 'locationId',
        as: 'institutions'
      });
      // panels
      Location.hasMany(models.institutions, {
        foreignKey: 'locationId',
        as: 'conferences'
      });
    }
  }
  Location.init({
    title: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};