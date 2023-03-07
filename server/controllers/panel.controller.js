/**
 * @file Controller for modifying panels
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const Panel = db.panels;
const Conference = db.conferences;
const Person = db.people;
const Presentation = db.presentations;
const Topic = db.topics;
const Geography = db.geographies;
const Institution = db.institutions;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.title) {
    errorMsgs.push('Must contain a \'title\' field!');
  }
  if (!req.body.conferenceId) {
    errorMsgs.push('Must contain a \'conferenceId\' field!');
  }
  if (!req.body.type) {
    errorMsgs.push('Must contain a \'type\' field!');
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
    conferenceId: req.body.conferenceId,
    type: req.body.type
  };
  // save item in the database
  Panel.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the panel.'
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

  let { title, page, size, type, conference } = req.query;
  let where = {};
  let conferenceWhere = {};
  let { limit, offset } = getPagination(page, size);

  if (title) {
    where.title = { [Op.like]: `%${title}%` };
  }
  if (type) {
    where.type = { [Op.like]: `%${type}%` };
  }
  if (conference) {
    conferenceWhere.title = {
      [Op.like]: `%${conference}%`
    };
  }

  // if no page or size values provided, return every item, with few includes (for quick reference lists)
  if (page === undefined || size === undefined) {
    Panel.findAll({
      where,
      include: [{
        model: Conference,
        as: 'conference',
        attributes: ['id', 'title'],
        where: conferenceWhere,
        required: conferenceWhere.title !== undefined,
        order: [['title', 'ASC']]
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
    let conferenceWhere = {};
    // build SQL for custom filtering
    Panel.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,
      order: [['title', 'ASC']],
      include: [
        {
          model: Conference,
          as: 'conference',
          where: conferenceWhere,
          required: conferenceWhere.title !== undefined
        }, {
          model: Person,
          as: 'chairs',
          attributes: ['id', 'name']
        }, {
          model: Presentation,
          as: 'presentations',
          attributes: ['id', 'title'],
          include: [
            {
              model: Person,
              as: 'presenters',
              attributes: ['id', 'name']
            }, {
              model: Topic,
              as: 'topics',
              attributes: ['id', 'title']
            }, {
              model: Geography,
              as: 'geographies',
              attributes: ['id', 'title']
            }
          ]
        }
      ]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send({
          message:
            err.message || 'Some error occurred while retrieving panels.'
        });
      });
  }
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Panel.findByPk(id, {
    include: [
      {
        model: Conference,
        as: 'conference'
      }, {
        model: Person,
        as: 'chairs',
        attributes: ['id', 'name'],
        through: {
          attributes: ['personId', 'panelId', 'title', 'name']
        },
        include: [{
          model: Institution,
          as: 'affiliationsAsChair',
          through: {
            attributes: ['chairId', 'panelId', 'institutionId', 'department'],
            as: 'chairAffiliationLink'
          }
        }]
      }, {
        model: Presentation,
        as: 'presentations',
        attributes: ['id', 'title'],
        include: [
          {
            model: Person,
            as: 'presenters',
            attributes: ['id', 'name']
          }, {
            model: Topic,
            as: 'topics',
            attributes: ['id', 'title']
          }, {
            model: Geography,
            as: 'geographies',
            attributes: ['id', 'title']
          }
        ]
      }
    ]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.send({
          message: `Cannot find panel with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error retrieving panel with id=' + id
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
  Panel.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Panel was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update panel with id=${id}. Maybe panel was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error updating panel with id=' + id
      });
    });
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Panel.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Panel was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete panel with id=${id}. Maybe panel was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete panel with id=' + id
      });
    });
};

// Delete all items from the database.
exports.deleteAll = (req, res) => {
  Panel.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} panels were deleted successfully!` });
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while removing all panels.'
      });
    });
};
