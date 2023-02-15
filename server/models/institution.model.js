'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Institution extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // location
      Institution.belongsTo(models.locations, {
        foreignKey: { name: 'locationId' },
        as: 'location'
      });
      // conferences
      Institution.belongsToMany(models.conferences, {
        through: 'ConferenceInstitutions',
        foreignKey: 'institutionId',
        as: 'conferences'
      });
      // people
      Institution.belongsToMany(models.people, {
        through: 'ChairAffiliation',
        foreignKey: 'institutionId',
        as: 'chairs'
      });
      Institution.belongsToMany(models.people, {
        through: 'PresenterAffiliation',
        foreignKey: 'institutionId',
        as: 'presenters'
      });
      Institution.belongsToMany(models.people, {
        through: 'ParticipantAffiliation',
        foreignKey: 'institutionId',
        as: 'participants'
      });
    }
  }
  Institution.init({
    locationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Location',
        key: 'id',
      },
    },
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    funding: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Institution',
  });
  return Institution;
};