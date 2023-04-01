/**
 * @file Routes for modifying links between conferences and participants.
 * @author David J. Thomas
 */

const auth = require('../middleware/auth');
const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/person-participating.controller.js');
  var router = require('express').Router();
  router.post('/', limitRate, auth.verifyAdminToken, controller.create);
  // Retrieve all
  router.get('/', controller.findAll);
  // Retrieve a single item
  router.delete('/:conferenceId/:personId', limitRate, auth.verifyAdminToken, controller.delete);
  app.use('/api/people-participating', router);
};
