/**
 * @file Defines the model for people
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
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
      // panels
      Person.belongsToMany(models.panels, {
        through: 'PersonRespondings',
        as: 'respondentPanels',
        foreignKey: 'personId',
      });
      // conferences
      Person.belongsToMany(models.conferences, {
        through: 'PersonParticipating',
        as: 'participantConferences',
        foreignKey: 'personId',
      });
      // institutions (chair)
      Person.belongsToMany(models.institutions, {
        through: 'ChairAffiliation',
        foreignKey: 'chairId',
        as: 'affiliationsAsChair'
      });
      // institutions (respondent)
      Person.belongsToMany(models.institutions, {
        through: 'RespondentAffiliation',
        foreignKey: 'respondentId',
        as: 'affiliationsAsRespondent'
      });
      // institutions (presenter)
      Person.belongsToMany(models.institutions, {
        through: 'PresenterAffiliation',
        foreignKey: 'presenterId',
        as: 'affiliationsAsPresenter'
      });
      // institutions (participant)
      Person.belongsToMany(models.institutions, {
        through: 'ParticipantAffiliation',
        foreignKey: 'personId',
        as: 'affiliationsAsParticipant'
      });
    }
  }
  Person.init({
    // name of person
    name: DataTypes.STRING,
    // optional orcid of person
    orcid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Person',
  });
  return Person;
};