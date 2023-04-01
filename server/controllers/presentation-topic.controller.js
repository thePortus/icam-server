/**
 * @file Controller for modifying links between presentations and topics.
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const PresentationTopic = db.presentationTopics;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.presentationId) {
    errorMsgs.push('Must contain a \'presentationId\' field!');
  }
  if (!req.body.topicId) {
    errorMsgs.push('Must contain a \'topicId\' field!');
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
    topicId: req.body.topicId,
  };
  // save item in the database
  PresentationTopic.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the presentation-topic.'
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
    PresentationTopic.findAll({
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
    PresentationTopic.findAndCountAll({
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
            err.message || 'Some error occurred while retrieving presentation-topics.'
        });
      });
  }
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const presentationId = req.params.presentationId;
  const topicId = req.params.topicId;
  PresentationTopic.destroy({
    where: { presentationId: presentationId, topicId: topicId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Presentation-topic was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete presentation-topic with presentationId=${presentationId} and topicId=${topicId}. Maybe presentation-topic was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete presentation-topic with presentationId=' + presentationId + ' and topicId=' + topicId
      });
    });
};
