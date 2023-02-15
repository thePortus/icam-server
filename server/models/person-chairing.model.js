'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonChairing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PersonChairing.belongsToMany(models.institutions, {
        through: 'ChairAffiliations',
        foreignKey: ['panelId', 'personId'],
        as: 'affiliations'
      });
      PersonChairing.belongsTo(models.panels, {
        foreignKey: 'panelId',
        as: 'panels'
      });
      PersonChairing.belongsTo(models.people, {
        foreignKey: 'personId',
        as: 'people'
      });
    }
  }
  PersonChairing.init({
    panelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Panels',
        key: 'id'
      },
      allowNull: false,
    },
    personId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'People',
        key: 'id'
      },
      allowNull: false,
    },
    name: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonChairing'
  });
  return PersonChairing;
};