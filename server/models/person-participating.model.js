'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonParticipating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PersonParticipating.belongsToMany(models.institutions, {
        through: 'ParticipantAffiliations',
        foreignKey: ['conferenceId', 'personId'],
        as: 'affiliations'
      });
      PersonParticipating.belongsTo(models.conferences, {
        foreignKey: 'conferenceId',
        as: 'conferences'
      });
      PersonParticipating.belongsTo(models.people, {
        foreignKey: 'personId',
        as: 'people'
      });
    }
  }
  PersonParticipating.init({
    conferenceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Conferences',
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
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonParticipating',
  });
  return PersonParticipating;
};