/**
 * @file Controller for modifying links between conferences and disciplines.
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const ConferenceDiscipline = db.conferenceDisciplines;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.conferenceId) {
    errorMsgs.push('Must contain a \'conferenceId\' field!');
  }
  if (!req.body.disciplineId) {
    errorMsgs.push('Must contain a \'disciplineId\' field!');
  }
  if (errorMsgs.length > 0) {
    res.send({
      status: 0,
      messages: errorMsgs
    });
    return;
  }
  const requestObj = {
    conferenceId: req.body.conferenceId,
    disciplineId: req.body.disciplineId,
  };
  // save item in the database
  ConferenceDiscipline.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the conference-discipline.'
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
    ConferenceDiscipline.findAll({
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
    ConferenceDiscipline.findAndCountAll({
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
            err.message || 'Some error occurred while retrieving conference-disciplines.'
        });
      });
  }
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const conferenceId = req.params.conferenceId;
  const disciplineId = req.params.disciplineId;
  ConferenceDiscipline.destroy({
    where: { conferenceId: conferenceId, disciplineId: disciplineId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Conference-discipline was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete conference-discipline with conferenceId=${conferenceId} and disciplineId=${disciplineId}. Maybe conference-discipline was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete conference-dicipline with conferenceId=' + conferenceId + ' and disciplineId=' + disciplineId
      });
    });
};

// Delete all items from the database.
exports.deleteAll = (req, res) => {
  ConferenceDiscipline.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} conferences-disciplines were deleted successfully!` });
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while removing all conference-disciplines.'
      });
    });
};
