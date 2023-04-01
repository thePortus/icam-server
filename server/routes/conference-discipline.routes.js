/**
 * @file Routes for modifying links between conferences and disciplines.
 * @author David J. Thomas
 */

const auth = require('../middleware/auth');
const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/conference-discipline.controller.js');
  var router = require('express').Router();
  // Post item
  router.post('/', limitRate, auth.verifyAdminToken, controller.create);
  // Retrieve all
  router.get('/', controller.findAll);
  // Retrieve a single item
  router.delete('/:conferenceId/:disciplineId', limitRate, auth.verifyAdminToken, controller.delete);
  app.use('/api/conference-disciplines', router);
};
