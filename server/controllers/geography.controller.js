/**
 * @file Controller for modifying geographies
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const Geography = db.geographies;
const Presentation = db.presentations;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.title) {
    errorMsgs.push('Must contain a \'title\' field!');
  }
  if (errorMsgs.length > 0) {
    res.send({
      status: 0,
      messages: errorMsgs
    });
    return;
  }
  const requestObj = {
    id: req.body.id || null,
    title: req.body.title
  };
  // save item in the database
  Geography.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the geography.'
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
  let where = {};
  let { limit, offset } = getPagination(page, size);

  if (title) {
    where.title = { [Op.like]: `%${title}%` };
  }
  // if no page or size values provided, return ever item, with no includes (for quick reference lists)
  if (page === undefined || size === undefined) {
    Geography.findAll({
      where,
      order: [['title', 'ASC']]
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
    Geography.findAndCountAll({
      where,
      order: [['title', 'ASC']],
      limit,
      offset,
      distinct: true,
      include: [{
        model: Presentation,
        as: 'presentations'
      }]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send({
          message:
            err.message || 'Some error occurred while retrieving geographies.'
        });
      });
  }
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Geography.findByPk(id, {
    include: [{
      model: Presentation,
      as: 'presentations'
    }]})
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.send({
          message: `Cannot find Geography with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error retrieving Geography with id=' + id
      });
    });
};

// Update an item by the id in the request
exports.update = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.id) {
    errorMsgs.push('Must contain an \'id\' field!');
  }
  if (errorMsgs.length > 0) {
    res.send({
      status: 0,
      messages: errorMsgs
    });
    return;
  }
  const id = req.params.id;
  // update updatedAt to current time
  req.body.updatedAt = new Date();
  Geography.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Geography was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update geography with id=${id}. Maybe geography was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error updating geography with id=' + id
      });
    });
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Geography.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Geography was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete geography with id=${id}. Maybe geography was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete Geography with id=' + id
      });
    });
};

// Delete all items from the database.
exports.deleteAll = (req, res) => {
  Geography.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} geographies were deleted successfully!` });
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while removing all geographies.'
      });
    });
};
