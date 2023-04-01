/**
 * @file Routes for modifying links between presentations and presenters.
 * @author David J. Thomas
 */

const auth = require('../middleware/auth');
const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/person-presenting.controller.js');
  var router = require('express').Router();
  // Post item
  router.post('/', limitRate, auth.verifyAdminToken, controller.create);
  // Retrieve all
  router.get('/', controller.findAll);
  // Retrieve a single item
  router.delete('/:presentationId/:personId', limitRate, auth.verifyAdminToken, controller.delete);
  app.use('/api/people-presenting', router);
};
