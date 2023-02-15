'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParticipantAffiliation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ParticipantAffiliation.belongsTo(models.conferences, {
        foreignKey: 'conferenceId',
        as: 'conference',
        onDelete: 'CASCADE'
      });
      ParticipantAffiliation.belongsTo(models.people, {
        foreignKey: 'personId',
        as: 'participant',
        onDelete: 'CASCADE'
      });
      ParticipantAffiliation.belongsTo(models.institutions, {
        foreignKey: 'institutionId',
        as: 'institution',
        onDelete: 'CASCADE'
      });
    }
  }
  ParticipantAffiliation.init({
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
    institutionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Institution',
        key: 'id',
      }
    },
    department: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ParticipantAffiliation',
  });
  return ParticipantAffiliation;
};