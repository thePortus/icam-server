'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonResponding extends Model {
    static associate(models) {
      // institutions
      PersonResponding.belongsToMany(models.institutions, {
        through: 'RespondentAffiliations',
        foreignKey: ['panelId', 'personId'],
        as: 'affiliations'
      });
      // panels
      PersonResponding.belongsTo(models.panels, {
        foreignKey: 'panelId',
        as: 'panels'
      });
      // people
      PersonResponding.belongsTo(models.people, {
        foreignKey: 'personId',
        as: 'people'
      });
    }
  }
  PersonResponding.init({// id of panel
    panelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Panels',
        key: 'id'
      },
      allowNull: false,
    },
    // id of person
    personId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'People',
        key: 'id'
      },
      allowNull: false,
    },
    // optional name (if different in this appearance than canonical name)
    name: DataTypes.STRING,
    // optional title
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonResponding',
  });
  return PersonResponding;
};