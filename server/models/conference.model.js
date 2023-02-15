'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // institutions
      Conference.belongsToMany(models.institutions, {
        through: 'ConferenceInstitutions',
        foreignKey: 'conferenceId',
        as: 'institutions'
      });
      // disciplines
      Conference.belongsToMany(models.disciplines, {
        through: 'ConferenceDisciplines',
        foreignKey: 'conferenceId',
        as: 'disciplines'
      });
      // panels
      Conference.hasMany(models.panels, {
        foreignKey: 'conferenceId',
        as: 'panels'
      });
      // location
      Conference.belongsTo(models.locations, {
        foreignKey: { name: 'locationId' },
        as: 'location'
      });
      // people
      Conference.belongsToMany(models.people, {
        through: 'PersonParticipating',
        as: 'participants',
        foreignKey: 'conferenceId',
        otherKey: 'personId',
      });
    }
  }
  Conference.init({
    locationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Location',
        key: 'id',
      },
    },
    title: DataTypes.STRING,
    year: DataTypes.INTEGER,
    startMonth: DataTypes.INTEGER,
    startDay: DataTypes.INTEGER,
    endMonth: DataTypes.INTEGER,
    endDay: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Conference',
  });
  return Conference;
};