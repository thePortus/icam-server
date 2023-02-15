const db = require('../models');
const Op = db.Sequelize.Op;

const ChairAffiliation = db.chairAffiliations;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.panelId) {
    errorMsgs.push('Must contain a \'panelId\' field!');
  }
  if (!req.body.chairId) {
    errorMsgs.push('Must contain a \'chairId\' field!');
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
    chairId: req.body.chairId,
    institutionId: req.body.institutionId,
    department: req.body.department
  };
  // save item in the database
  ChairAffiliation.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the chair-affiliation.'
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
    ChairAffiliation.findAll({
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
    ChairAffiliation.findAndCountAll({
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
            err.message || 'Some error occurred while retrieving chair-affiliations.'
        });
      });
  }
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const panelId = req.params.panelId;
  const chairId = req.params.chairId;
  const institutionId = req.params.institutionId;
  ChairAffiliation.destroy({
    where: { panelId: panelId, chairId: chairId, institutionId: institutionId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Chair-affiliation was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete chair-affiliation with panelId=${panelId} and chairId=${chairId} and institutionId=${institutionId}. Maybe chair-affiliation was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete chair-affiliation with panelId=' + panelId + ' and chairId=' + chairId+ ' and institutionId=' + institutionId
      });
    });
};

// Delete all items from the database.
exports.deleteAll = (req, res) => {
  ChairAffiliation.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} chair-affiliations were deleted successfully!` });
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while removing all chair-affiliations.'
      });
    });
};
