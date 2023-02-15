const db = require('../models');
const Op = db.Sequelize.Op;

const PersonChairing = db.peopleChairing;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.panelId) {
    errorMsgs.push('Must contain a \'panelId\' field!');
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
    panelId: req.body.panelId,
    personId: req.body.personId,
    name: req.body.name || null,
    title: req.body.title || null,
  };
  // save item in the database
  PersonChairing.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the person-chairing.'
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
    PersonChairing.findAll({
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
    PersonChairing.findAndCountAll({
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
  const panelId = req.params.panelId;
  const personId = req.params.personId;
  PersonChairing.destroy({
    where: { panelId: panelId, personId: personId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Person-chairing was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete person-chairing with panelId=${panelId} and personId=${personId}. Maybe person-chairing was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete person-chairing with panelId=' + panelId + ' and personId=' + personId
      });
    });
};

// Delete all items from the database.
exports.deleteAll = (req, res) => {
  PersonChairing.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} people-chairings were deleted successfully!` });
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while removing all people-chairing.'
      });
    });
};
