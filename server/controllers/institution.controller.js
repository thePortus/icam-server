/**
 * @file Controller for modifying institutions
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const Institution = db.institutions;
const Conference = db.conferences;
const Location = db.locations;
const Person = db.people;
const ConferenceInstitution = db.conferenceInstitutions;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.title) {
    errorMsgs.push('Must contain a \'title\' field!');
  }
  if (!req.body.locationId) {
    errorMsgs.push('Must contain a \'locationId\' field!');
  }
  if (!req.body.type) {
    errorMsgs.push('Must contain a \'type\' field!');
  }
  if (!req.body.funding) {
    errorMsgs.push('Must contain a \'funding\' field!');
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
    title: req.body.title,
    locationId: req.body.locationId,
    type: req.body.type,
    funding: req.body.funding
  };
  // save item in the database
  Institution.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the institution.'
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

  let { title, page, size, location } = req.query;
  let where = {};
  let locationWhere = {};
  let { limit, offset } = getPagination(page, size);

  if (title) {
    where.title = { [Op.like]: `%${title}%` };
  }
  if (location) {
    locationWhere.title = { [Op.like]: `%${location}%` };
  }
  // if no page or size values provided, return ever item, with no includes (for quick reference lists)
  if (page === undefined || size === undefined) {
    Institution.findAll({
      where,
      order: [['title', 'ASC']],
      include: [{
        model: Location,
        as: 'location',
        attributes: ['id', 'title'],
        where: locationWhere,
        required: locationWhere.title !== undefined
      }]
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
    Institution.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,
      order: [['title', 'ASC']],
      include: [
        {
          model: Conference,
          as: 'conferences',
          through: {
            attributes: ['sponsor', 'host', 'society'],
            as: 'roles'
          },
        },
        {
          model: Location,
          as: 'location',
          where: locationWhere,
          required: locationWhere.title !== undefined
        },
        {
          model: Person,
          as: 'chairs'
        },
        {
          model: Person,
          as: 'presenters'
        },
        {
          model: Person,
          as: 'participants'
        }
      ]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send({
          message:
            err.message || 'Some error occurred while retrieving institutions.'
        });
      });
  }
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Institution.findByPk(id, {
    include: [
      {
        model: Conference,
        as: 'conferences',
        through: {
          attributes: ['sponsor', 'host', 'society'],
          as: 'roles'
        },
      },
      {
        model: Location,
        as: 'location'
      },
      {
        model: Person,
        as: 'chairs'
      },
      {
        model: Person,
        as: 'presenters'
      },
      {
        model: Person,
        as: 'participants'
      }
    ]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.send({
          message: `Cannot find institution with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error retrieving institution with id=' + id
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
  Institution.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Institution was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update institution with id=${id}. Maybe institution was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error updating institution with id=' + id
      });
    });
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Institution.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Institution was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete institution with id=${id}. Maybe institution was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete institution with id=' + id
      });
    });
};
