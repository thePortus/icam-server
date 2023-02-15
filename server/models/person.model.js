'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // presentations
      Person.belongsToMany(models.presentations, {
        through: 'PersonPresenting',
        as: 'presentations',
        foreignKey: 'personId',
        otherKey: 'presentationId',
      });
      // panels
      Person.belongsToMany(models.panels, {
        through: 'PersonChairings',
        as: 'chairedPanels',
        foreignKey: 'personId',
      });
      // conferences
      Person.belongsToMany(models.conferences, {
        through: 'PersonParticipating',
        as: 'participantConferences',
        foreignKey: 'personId',
      });
      // institutions
      Person.belongsToMany(models.institutions, {
        through: 'ChairAffiliation',
        foreignKey: 'chairId',
        as: 'affiliationsAsChair'
      });
      Person.belongsToMany(models.institutions, {
        through: 'PresenterAffiliation',
        foreignKey: 'presenterId',
        as: 'affiliationsAsPresenter'
      });
      Person.belongsToMany(models.institutions, {
        through: 'ParticipantAffiliation',
        foreignKey: 'personId',
        as: 'affiliationsAsParticipant'
      });
    }
  }
  Person.init({
    name: DataTypes.STRING,
    orcid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Person',
  });
  return Person;
};