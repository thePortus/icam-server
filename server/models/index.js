/**
 * @file Configures database connection for models, gathers
 * models together in one location, and calls their respective
 * association functions.
 * @author David J. Thomas
 */

const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,
  dialectOptions: {
    // comment out the line below for running on ubuntu
    // socketPath: '/tmp/mysql.sock' //  Specify the socket file path
  },
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// make models available for reference by controllers
db.users = require('./user.model.js')(sequelize, Sequelize);
db.locations = require('./location.model.js')(sequelize, Sequelize);
db.institutions = require('./institution.model.js')(sequelize, Sequelize);
db.disciplines = require('./discipline.model.js')(sequelize, Sequelize);
db.conferences = require('./conference.model.js')(sequelize, Sequelize);
db.conferenceDisciplines = require('./conference-discipline.model.js')(sequelize, Sequelize);
db.conferenceInstitutions = require('./conference-institution.model.js')(sequelize, Sequelize);
db.panels = require('./panel.model.js')(sequelize, Sequelize);
db.people = require('./person.model.js')(sequelize, Sequelize);
db.peopleChairing = require('./person-chairing.model.js')(sequelize, Sequelize);
db.chairAffiliations = require('./chair-affiliation.model.js')(sequelize, Sequelize);
db.presentations =  require('./presentation.model.js')(sequelize, Sequelize);
db.peoplePresenting = require('./person-presenting.model.js')(sequelize, Sequelize);
db.presenterAffiliations = require('./presenter-affiliation.model.js')(sequelize, Sequelize);
db.peopleParticipating = require('./person-participating.model.js')(sequelize, Sequelize);
db.participantAffiliations = require('./participant-affiliation.model')(sequelize, Sequelize);
db.topics = require('./topic.model.js')(sequelize, Sequelize);
db.presentationTopics = require('./presentation-topic.model.js')(sequelize, Sequelize);
db.geographies = require('./geography.model.js')(sequelize, Sequelize);
db.presentationGeographies = require('./presentation-geography.model.js')(sequelize, Sequelize);

// call association functions on all models and set fk constraints
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
