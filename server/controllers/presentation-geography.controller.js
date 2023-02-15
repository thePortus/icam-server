const db = require('../models');
const Op = db.Sequelize.Op;

const PresentationGeography = db.presentationGeographies;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.presentationId) {
    errorMsgs.push('Must contain a \'presentationId\' field!');
  }
  if (!req.body.geographyId) {
    errorMsgs.push('Must contain a \'geographyId\' field!');
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
    geographyId: req.body.geographyId,
  };
  // save item in the database
  PresentationGeography.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the presentation-geography.'
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
    PresentationGeography.findAll({
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
    PresentationGeography.findAndCountAll({
      where: condition,
      limit,
      distinct: true,
      offset
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send({
          message:
            err.message || 'Some error occurred while retrieving presentation-geographies.'
        });
      });
  }
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const presentationId = req.params.presentationId;
  const geographyId = req.params.geographyId;
  PresentationGeography.destroy({
    where: { presentationId: presentationId, geographyId: geographyId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Presentation-geography was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete presentation-geography with presentationId=${presentationId} and geographyId=${geographyId}. Maybe presentation-geography was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete presentation-geography with presentationId=' + presentationId + ' and geographyId=' + geographyId
      });
    });
};

// Delete all items from the database.
exports.deleteAll = (req, res) => {
  PresentationGeography.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} presentation-geographies were deleted successfully!` });
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while removing all presentation-geographies.'
      });
    });
};
