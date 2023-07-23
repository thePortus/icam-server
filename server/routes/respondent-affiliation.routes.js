/**
 * @file Routes for modifying links between panel respondents and institutions.
 * @author David J. Thomas
 */

const auth = require('../middleware/auth');
const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/respondent-affiliation.controller.js');
  var router = require('express').Router();
  // Post item
  router.post('/', limitRate, auth.verifyAdminToken, controller.create);
  // Retrieve all
  router.get('/', controller.findAll);
  // Retrieve a single item
  router.delete('/:panelId/:respondentId/:institutionId', limitRate, auth.verifyAdminToken, controller.delete);
  app.use('/api/respondent-affiliations', router);
};
