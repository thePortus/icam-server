/**
 * @file Routes for modifying links between presentations and geographies.
 * @author David J. Thomas
 */

const auth = require('../middleware/auth');
const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/presentation-geography.controller.js');
  var router = require('express').Router();
  // Post item
  router.post('/', limitRate, auth.verifyAdminToken, controller.create);
  // Retrieve all
  router.get('/', controller.findAll);
  // Retrieve a single item
  router.delete('/:presentationId/:geographyId', limitRate, auth.verifyAdminToken, controller.delete);
  app.use('/api/presentation-geographies', router);
};
