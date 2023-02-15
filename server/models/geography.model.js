'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Geography extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Geography.belongsToMany(models.presentations, {
        through: 'PresentationGeographies',
        foreignKey: 'geographyId',
        as: 'presentations'
      });
    }
  }
  Geography.init({
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Geography',
  });
  return Geography;
};