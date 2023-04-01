/**
 * @file Routes for modifying links between presentations and topics.
 * @author David J. Thomas
 */

const auth = require('../middleware/auth');
const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/presentation-topic.controller.js');
  var router = require('express').Router();
  // Post item
  router.post('/', limitRate, auth.verifyAdminToken, controller.create);
  // Retrieve all
  router.get('/', controller.findAll);
  // Retrieve a single item
  router.delete('/:presentationId/:topicId', limitRate, auth.verifyAdminToken, controller.delete);
  app.use('/api/presentation-topics', router);
};
