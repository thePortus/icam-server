/**
 * @file Controller for modifying people.
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const Person = db.people;
const Panel = db.panels;
const Presentation = db.presentations;
const Conference = db.conferences;
const Topic = db.topics;
const Geography = db.geographies;
const Institution = db.institutions;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.name) {
    errorMsgs.push('Must contain a \'name\' field!');
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
    name: req.body.name,
    orcid: req.body.orcid || null
  };
  // save item in the database
  Person.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the person.'
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

  let { name, page, size, panel, presentation, conference } = req.query;
  let where = {};
  let panelWhere = {};
  let presentationWhere = {};
  let conferenceWhere = {};
  let { limit, offset } = getPagination(page, size);

  if (name) {
    where.name = { [Op.like]: `%${name}%` };
  }
  if (panel) {
    panelWhere.title = { [Op.like]: `%${panel}%` };
  }
  if (presentation) {
    presentationWhere.title = { [Op.like]: `%${presentation}%` };
  }
  if (conference) {
    conferenceWhere.title = { [Op.like]: `%${conference}%` };
  }

  // if no page or size values provided, return ever item, with no includes (for quick reference lists)
  if (page === undefined || size === undefined) {
    Person.findAll({
      where,
      order: [['name', 'ASC']],
      include: [{
        model: Panel,
        as: 'chairedPanels',
        attributes: ['id', 'title'],
        where: panelWhere,
        required: panelWhere.title !== undefined
      }, {
        model: Presentation,
        as: 'presentations',
        attributes: ['id', 'title'],
        where: presentationWhere,
        required: presentationWhere.title !== undefined
      }, {
        model: Conference,
        as: 'participantConferences',
        attributes: ['id', 'title'],
        required: conferenceWhere.title !== undefined
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
    Person.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,
      order: [['name', 'ASC']],
      include: [
        {
          model: Panel,
          as: 'chairedPanels',
          attributes: ['id', 'title'],
          where: panelWhere,
          required: panelWhere.title !== undefined
        }, {
          model: Presentation,
          as: 'presentations',
          attributes: ['id', 'title'],
          where: presentationWhere,
          required: presentationWhere.title !== undefined,
          include: [
            {
              model: Topic,
              as: 'topics',
              attributes: ['id', 'title']
            }, {
              model: Geography,
              as: 'geographies',
              attributes: ['id', 'title']
            }
          ]
        }, {
          model: Conference,
          as: 'participantConferences',
          attributes: ['id', 'title'],
          where: conferenceWhere,
          required: conferenceWhere.title !== undefined
        }, {
          model: Institution,
          as: 'affiliationsAsChair'
        }, {
          model: Institution,
          as: 'affiliationsAsPresenter'
        }, {
          model: Institution,
          as: 'affiliationsAsParticipant'
        }
      ]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send({
          message:
            err.message || 'Some error occurred while retrieving people.'
        });
      });
  }
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Person.findByPk(id, {
    include: [
      {
        model: Panel,
        as: 'chairedPanels',
        attributes: ['id', 'title'],
        include: [
          {
            model: Conference,
            as: 'conference'
          }
        ],
        through: {
          attributes: ['panelId', 'personId', 'name', 'title'],
          as: 'chairPanelLink'
        },
      }, {
        model: Presentation,
        as: 'presentations',
        attributes: ['id', 'title'],
        include: [
          {
            model: Topic,
            as: 'topics',
            attributes: ['id', 'title']
          }, {
            model: Geography,
            as: 'geographies',
            attributes: ['id', 'title']
          },
          {
            model: Panel,
            as: 'panel',
            include: [
              {
                model: Conference,
                as: 'conference'
              }
            ]
          }
        ],
        through: {
          attributes: ['presentationId', 'personId', 'name'],
          as: 'presenterLink'
        }
      }, {
        model: Conference,
        as: 'participantConferences',
        attributes: ['id', 'title'],
        through: {
          attributes: ['personId', 'conferenceId', 'name', 'role'],
          as: 'conferenceLink'
        }
      }, {
        model: Institution,
        as: 'affiliationsAsChair',
        through: {
          attributes: ['chairId', 'panelId', 'institutionId', 'department'],
          as: 'chairAffiliationLink'
        }
      }, {
        model: Institution,
        as: 'affiliationsAsPresenter',
        through: {
          attributes: ['presenterId', 'presentationId', 'institutionId', 'department'],
          as: 'presenterAffiliationLink'
        }
      }, {
        model: Institution,
        as: 'affiliationsAsParticipant',
        through: {
          attributes: ['personId', 'conferenceId', 'institutionId', 'department'],
          as: 'participantAffiliationLink'
        }
      }
    ]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.send({
          message: `Cannot find person with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error retrieving person with id=' + id
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
  Person.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Person was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update person with id=${id}. Maybe person was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error updating person with id=' + id
      });
    });
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Person.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Person was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete person with id=${id}. Maybe person was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete person with id=' + id
      });
    });
};

// Delete all items from the database.
exports.deleteAll = (req, res) => {
  Person.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} people were deleted successfully!` });
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while removing all people.'
      });
    });
};
