'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PresentationGeography extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PresentationGeography.belongsTo(models.presentations, {
        foreignKey: 'presentationId',
        as: 'presentation',
        onDelete: 'NO ACTION',
      });
      PresentationGeography.belongsTo(models.geographies, {
        foreignKey: 'geographyId',
        as: 'geography',
        onDelete: 'NO ACTION',
      });
    }
  }
  PresentationGeography.init({
    presentationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Presentations',
        key: 'id',
      }
    },
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