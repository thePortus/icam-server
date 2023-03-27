/**
 * @file Controller for modifying links between presentations and presenters.
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const PersonPresenting = db.peoplePresenting;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.presentationId) {
    errorMsgs.push('Must contain a \'presentationId\' field!');
  }
  if (!req.body.personId) {
    errorMsgs.push('Must contain a \'personId\' field!');
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
    personId: req.body.personId,
    name: req.body.name || null,
    isRespondent: req.body.isRespondent || false
  };
  // save item in the database
  PersonPresenting.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the person-presenting.'
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
    PersonPresenting.findAll({
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
    PersonPresenting.findAndCountAll({
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
            err.message || 'Some error occurred while retrieving people-chairing.'
        });
      });
  }
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const presentationId = req.params.presentationId;
  const personId = req.params.personId;
  PersonPresenting.destroy({
    where: { presentationId: presentationId, personId: personId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Person-presenting was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete person-presenting with presentationId=${presentationId} and personId=${personId}. Maybe person-presenting was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete person-presenting with presentationId=' + presentationId + ' and personId=' + personId
      });
    });
};

// Delete all items from the database.
exports.deleteAll = (req, res) => {
  PersonPresenting.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} people-presenting were deleted successfully!` });
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while removing all people-chairing.'
      });
    });
};
