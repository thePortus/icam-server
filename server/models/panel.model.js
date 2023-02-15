'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Panel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // conferences
      Panel.belongsTo(models.conferences, {
        foreignKey: { name: 'conferenceId' },
        as: 'conference'
      });
      // people
      Panel.belongsToMany(models.people, {
        through: 'PersonChairings',
        as: 'chairs',
        foreignKey: 'panelId',
        otherKey: 'personId',
      });
      // presentations
      Panel.hasMany(models.presentations, {
        foreignKey: 'panelId',
        as: 'presentations'
      });
    }
  }
  Panel.init({
    title: DataTypes.STRING,
    conferenceId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Conference',
        key: 'id',
      },
    },
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Panel',
  });
  return Panel;
};