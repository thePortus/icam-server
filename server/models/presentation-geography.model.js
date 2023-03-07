/**
 * @file Defines the model that presentations with their geographies
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PresentationGeography extends Model {
    static associate(models) {
      // presentations
      PresentationGeography.belongsTo(models.presentations, {
        foreignKey: 'presentationId',
        as: 'presentation',
        onDelete: 'NO ACTION',
      });
      // geographies
      PresentationGeography.belongsTo(models.geographies, {
        foreignKey: 'geographyId',
        as: 'geography',
        onDelete: 'NO ACTION',
      });
    }
  }
  PresentationGeography.init({
    // id of presentation
    presentationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Presentations',
        key: 'id',
      }
    },
    // id of geography
    geographyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Geographies',
        key: 'id',
      }
    },
  }, {
    sequelize,
    modelName: 'PresentationGeography',
  });
  return PresentationGeography;
};