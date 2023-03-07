/**
 * @file Defines the model for geographies
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Geography extends Model {
    static associate(models) {
      // presentations
      Geography.belongsToMany(models.presentations, {
        through: 'PresentationGeographies',
        foreignKey: 'geographyId',
        as: 'presentations'
      });
    }
  }
  Geography.init({
    // title of geography
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Geography',
  });
  return Geography;
};