/**
 * @file Defines the model of locations.
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
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
    // title of location (can be custom, other than city/state)
    title: DataTypes.STRING,
    // geography information
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};