/**
 * @file Controller for modifying disciplines
 * @author David J. Thomas
 */


const db = require('../models');
const Op = db.Sequelize.Op;

const Discipline = db.disciplines;
const Conference = db.conferences;

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
  Discipline.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the discipline.'
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
    Discipline.findAll({
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
    Discipline.findAndCountAll({
      where,
      order: [['title', 'ASC']],
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
            err.message || 'Some error occurred while retrieving disciplines.'
        });
      });
  }
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Discipline.findByPk(id, {
    include: [{
      model: Conference,
      as: 'conferences'
    }]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.send({
          message: `Cannot find Discipline with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error retrieving Discipline with id=' + id
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
  Discipline.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Discipline was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update discipline with id=${id}. Maybe discipline was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error updating discipline with id=' + id
      });
    });
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Discipline.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Discipline was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete discipline with id=${id}. Maybe discipline was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete Discipline with id=' + id
      });
    });
};
