/**
 * @file Routes for modifying topics.
 * @author David J. Thomas
 */

const auth = require('../middleware/auth');
const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/topic.controller.js');
  var router = require('express').Router();
  // Post item
  router.post('/', limitRate, auth.verifyAdminToken, controller.create);
  // Retrieve all
  router.get('/', controller.findAll);
  // Retrieve a single item
  router.get('/:id', limitRate, controller.findOne);
  // Update item
  router.put('/:id', limitRate, auth.verifyAdminToken, controller.update);
  // Delete an item
  router.delete('/:id', limitRate, auth.verifyAdminToken, controller.delete);
  app.use('/api/topics', router);
};
