/**
 * @file Controller for modifying links between panel respondents and institutions.
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const RespondentAffiliation = db.respondentAffiliations;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.panelId) {
    errorMsgs.push('Must contain a \'panelId\' field!');
  }
  if (!req.body.respondentId) {
    errorMsgs.push('Must contain a \'respondentId\' field!');
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
    panelId: req.body.panelId,
    respondentId: req.body.respondentId,
    institutionId: req.body.institutionId,
    department: req.body.department
  };
  // save item in the database
  RespondentAffiliation.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the respoondent-affiliation.'
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
    RespondentAffiliation.findAll({
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
    RespondentAffiliation.findAndCountAll({
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
            err.message || 'Some error occurred while retrieving respoondent-affiliations.'
        });
      });
  }
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const panelId = req.params.panelId;
  const respondentId = req.params.respondentId;
  const institutionId = req.params.institutionId;
  RespondentAffiliation.destroy({
    where: { panelId: panelId, respondentId: respondentId, institutionId: institutionId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Respondent-affiliation was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete respoondent-affiliation with panelId=${panelId} and respondentId=${respondentId} and institutionId=${institutionId}. Maybe respoondent-affiliation was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete respoondent-affiliation with panelId=' + panelId + ' and respondentId=' + respondentId+ ' and institutionId=' + institutionId
      });
    });
};
