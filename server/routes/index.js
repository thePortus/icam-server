/**
 * @file Index file that gathers all relevant routes in one spot for inclusion by app.
 * @author David J. Thomas
 */

module.exports = app => {
  require('./user.routes')(app);
  require('./profile.routes')(app);
  require('./location.routes')(app);
  require('./institution.routes')(app);
  require('./discipline.routes')(app);
  require('./conference.routes')(app);
  require('./conference-discipline.routes')(app);
  require('./conference-institution.routes')(app);
  require('./panel.routes')(app);
  require('./person.routes')(app);
  require('./person-chairing.routes')(app);
  require('./chair-affiliation.routes')(app);
  require('./presentation.routes')(app);
  require('./person-presenting.routes')(app);
  require('./presenter-affiliation.routes')(app);
  require('./topic.routes')(app);
  require('./presentation-topic.routes')(app);
  require('./geography.routes')(app);
  require('./presentation-geography.routes')(app);
  require('./person-participating.routes')(app);
  require('./participant-affiliation.routes')(app);
  require('./person-responding.routes')(app);
  require('./respondent-affiliation.routes')(app);
  require('./export.routes')(app);
};
