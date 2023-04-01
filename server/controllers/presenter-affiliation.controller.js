/**
 * @file Controller for modifying links between presenters and institutions.
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const PresenterAffiliation = db.presenterAffiliations;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.presentationId) {
    errorMsgs.push('Must contain a \'presentationId\' field!');
  }
  if (!req.body.presenterId) {
    errorMsgs.push('Must contain a \'presenterId\' field!');
  }
  if (!req.body.institutionId) {
    errorMsgs.push('Must contain a \'institutionId\' field!');
  }
  if (errorMsgs.length > 0) {
    res.send({
      status: 0,
      messages: errorMsgs
    });
    return;
  }
  const requestObj = {
    presentationId: req.body.presentationId,
    presenterId: req.body.presenterId,
    institutionId: req.body.institutionId,
    department: req.body.department
  };
  // save item in the database
  PresenterAffiliation.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the presenter-affiliation.'
      });
    });
};

// retrieve all items from the database.
exports.findAll = (req, res) => {
  // calculate limit and offset values from page and size values
  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };

  let { title, page, size } = req.query;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  let { limit, offset } = getPagination(page, size);
  // if no page or size values provided, return ever item, with no includes (for quick reference lists)
  if (page === undefined || size === undefined) {
    PresenterAffiliation.findAll({
      where: condition
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send({
          message:
            err.message || 'Some error occurred while retrieving conferences.'
        });
      });
  }
  // otherwise return full data for specified items
  else {
    PresenterAffiliation.findAndCountAll({
      where: condition,
      limit,
      offset,
      distinct: true,
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send({
          message:
            err.message || 'Some error occurred while retrieving presenter-affiliations.'
        });
      });
  }
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const presentationId = req.params.presentationId;
  const presenterId = req.params.presenterId;
  const institutionId = req.params.institutionId;
  PresenterAffiliation.destroy({
    where: { presentationId: presentationId, presenterId: presenterId, institutionId: institutionId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Presenter-affiliation was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete presenter-affiliation with presentationId=${presentationId} and presenterId=${presenterId} and institutionId=${institutionId}. Maybe presenter-affiliation was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete presenter-affiliation with presentationId=' + presentationId + ' and presenterId=' + presenterId+ ' and institutionId=' + institutionId
      });
    });
};
