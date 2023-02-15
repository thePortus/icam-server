'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonPresenting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // people
      PersonPresenting.belongsTo(models.people, {
        foreignKey: 'personId',
        as: 'person',
        onDelete: 'NO ACTION',
      });
      // presentations
      PersonPresenting.belongsTo(models.presentations, {
        foreignKey: 'presentationId',
        as: 'presentation',
        onDelete: 'NO ACTION',
      });
    }
  }
  PersonPresenting.init({
    presentationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Presentation',
        key: 'id',
      },
    },
    personId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Person',
        key: 'id',
      },
    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonPresenting',
  });
  return PersonPresenting;
};