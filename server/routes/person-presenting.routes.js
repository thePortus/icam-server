const auth = require('../middleware/auth');
const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/person-presenting.controller.js');
  var router = require('express').Router();
  router.post('/', limitRate, auth.verifyAdminToken, controller.create);
  // Retrieve all
  router.get('/', controller.findAll);
  // Retrieve a single item
  router.delete('/:presentationId/:personId', limitRate, auth.verifyAdminToken, controller.delete);
  // Delete all items
  router.delete('/', limitRate, auth.verifyAdminToken, controller.deleteAll);
  app.use('/api/people-presenting', router);
};
