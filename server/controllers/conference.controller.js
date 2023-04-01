/**
 * @file Controller for modifying conferences
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const Conference = db.conferences;
const Discipline = db.disciplines;
const Institution = db.institutions;
const Location = db.locations;
const Panel = db.panels;
const Person = db.people;
const Presentation = db.presentations;
const Topic = db.topics;
const Geography = db.geographies;

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
    title: req.body.title,
    locationId: req.body.locationId || null,
    year: req.body.year || null,
    startMonth: req.body.startMonth || null,
    startDay: req.body.startDay || null,
    endMonth: req.body.endMonth || null,
    endDay: req.body.endDay || null,
    disciplines: req.body.disciplines || []
  };
  // save item in the database
  Conference.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the conference.'
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

  let { title, page, size, institution, discipline, location } = req.query;
  let where = {};
  let disciplineWhere = {};
  let institutionWhere = {};
  let locationWhere = {};
  let { limit, offset } = getPagination(page, size);

  if (title) {
    where.title = { [Op.like]: `%${title}%` };
  }
  if (discipline) {
    disciplineWhere.title = {
      [Op.like]: `%${discipline}%`
    };
  }
  if (institution) {
    institutionWhere.title = {
      [Op.like]: `%${institution}%`
    };
  }
  if (location) {
    locationWhere.title = {
      [Op.like]: `%${location}%`
    };
  }

  // if no page or size values provided, return ever item, with no includes (for quick reference lists)
  if (page === undefined || size === undefined) {
    Conference.findAll({
      where,
      order: [
        ['year', 'ASC'],
        ['title', 'ASC']
      ]
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
    // build SQL for custom filtering
    Conference.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,
      order: [
        ['year', 'ASC'],
        ['title', 'ASC']
      ],
      include: [
        {
          model: Location,
          as: 'location',
          attributes: ['id', 'title'],
          where: locationWhere,
          required: locationWhere.title !== undefined
        },
        {
          model: Discipline,
          as: 'disciplines',
          attributes: ['id', 'title'],
          where: disciplineWhere,
          required: disciplineWhere.title !== undefined
        },
        {
          model: Institution,
          as: 'institutions',
          attributes: ['id', 'title'],
          through: {
            attributes: ['sponsor', 'host', 'society'],
            as: 'roles'
          },
          where: institutionWhere,
          required: institutionWhere.title !== undefined
        },
        {
          model: Person,
          as: 'participants',
          attributes: ['id', 'name']
        },
        {
          model: Panel,
          as: 'panels',
          attributes: ['id', 'title', 'type'],
          include: [
            {
              model: Person,
              as: 'chairs',
              attributes: ['id', 'name']
            },
            {
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
        }
      ]
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
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Conference.findByPk(id, {
    include: [
      {
        model: Location,
        as: 'location',
        attributes: ['id', 'title']
      },
      {
        model: Discipline,
        as: 'disciplines',
        attributes: ['id', 'title']
      },
      {
        model: Institution,
        as: 'institutions',
        attributes: ['id', 'title'],
        through: {
          attributes: ['sponsor', 'host', 'society'],
          as: 'roles'
        },
        include: [
          {
            model: Location,
            as: 'location',
            attributes: ['id', 'title']
          }
        ]
      },
      {
        model: Person,
        as: 'participants',
        attributes: ['id', 'name'],
        though: {
          attributes: ['personId', 'conferenceId', 'name', 'role'],
          as: 'participantLink'
        },
        include: [{
          model: Institution,
          as :'affiliationsAsParticipant',
          attributes: ['id', 'title'],
          through: {
            attributes: ['conferenceId', 'personId', 'institutionId', 'department'],
            as: 'participantAffiliation'
          }
        }]
      },
      {
        model: Panel,
        as: 'panels',
        attributes: ['id', 'title', 'type'],
        include: [
          {
            model: Person,
            as: 'chairs',
            attributes: ['id', 'name']
          },
          {
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
      }
    ]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.send({
          message: `Cannot find conference with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error retrieving conference with id=' + id
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
  Conference.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Conference was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update conference with id=${id}. Maybe conference was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error updating conference with id=' + id
      });
    });
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Conference.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Conference was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete conference with id=${id}. Maybe conference was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete conference with id=' + id
      });
    });
};
