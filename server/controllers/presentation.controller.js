/**
 * @file Controller for modifying presentations.
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const Presentation = db.presentations;
const Conference = db.conferences;
const Panel = db.panels;
const Topic = db.topics;
const Geography = db.geographies;
const Person = db.people;
const Institution = db.institutions;
const Place = db.geographies;

// create and save a new item
exports.create = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.panelId) {
    errorMsgs.push('Must contain a \'panelId\' field!');
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
    title: req.body.title || null,
    panelId: req.body.panelId,
    description: req.body.description,
    text: req.body.text
  };
  // save item in the database
  Presentation.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || 'Some error occurred while creating the presentation.'
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

  let { title, page, size, panel, conference, presenter, topic, place } = req.query;
  let where = {};
  let panelWhere = {};
  let conferenceWhere = {};
  let presenterWhere = {};
  let topicWhere = {};
  let placeWhere = {};
  let { limit, offset } = getPagination(page, size);

  if (title) {
    where.title = { [Op.like]: `%${title}%` };
  }
  if (panel) {
    panelWhere.title = { [Op.like]: `%${panel}%` };
  }
  if (conference) {
    conferenceWhere.title = { [Op.like]: `%${conference}%` };
  }
  if (presenter) {
    presenterWhere.name = { [Op.like]: `%${presenter}%` };
  }
  if (topic) {
    topicWhere.title = { [Op.like]: `%${topic}%` };
  }
  if (place) {
    placeWhere.title = { [Op.like]: `%${place}%` };
  }
  // if no page or size values provided, return every item, with few includes (for quick reference lists)
  if (page === undefined || size === undefined) {
    Presentation.findAll({
      where,
      order: [['title', 'ASC']],
      include: [{
        model: Panel,
        as: 'panel',
        attributes: ['id', 'title'],
        where: panelWhere,
        required: panelWhere.title !== undefined,
        include: [{
          model: Conference,
          as: 'conference',
          attributes: ['id', 'title'],
          where: conferenceWhere,
          required: conferenceWhere.title !== undefined,
        }]
      }, {
        model: Person,
        as: 'presenters',
        attributes: ['id', 'name'],
        where: presenterWhere,
        required: presenterWhere.name !== undefined
      }, {
        model: Topic,
        as: 'topics',
        attributes: ['id', 'title'],
        where: topicWhere,
        required: topicWhere.title !== undefined
      }, {
        model: Place,
        as: 'geographies',
        attributes: ['id', 'title'],
        where: placeWhere,
        required: placeWhere.title !== undefined
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
    Presentation.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,
      order: [['title', 'ASC']],
      include: [{
        model: Panel,
        as: 'panel',
        where: panelWhere,
        required: panelWhere.title !== undefined || conferenceWhere !== undefined,
        include: [{
          model: Conference,
          as: 'conference',
          where: conferenceWhere,
          required: conferenceWhere.title !== undefined,
        }, {
          model: Person,
          as: 'chairs'
        }]
      },
      {
        model: Topic,
        as: 'topics',
        where: topicWhere,
        required: topicWhere.title !== undefined,
      }, {
        model: Geography,
        as: 'geographies',
        where: placeWhere,
        required: placeWhere.title !== undefined,
      }, {
        model: Person,
        as: 'presenters',
        where: presenterWhere,
        required: presenterWhere.name !== undefined
      }]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send({
          message:
            err.message || 'Some error occurred while retrieving presentations.'
        });
      });
  }
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Presentation.findByPk(id, {
    include: [{
      model: Panel,
      as: 'panel',
      include: [{
        model: Conference,
        as: 'conference'
      }, {
        model: Person,
        as: 'chairs'
      }]
    }, {
      model: Topic,
      as: 'topics'
    }, {
      model: Geography,
      as: 'geographies'
    }, {
      model: Person,
      as: 'presenters',
      through: {
        attributes: ['presentationId', 'personId', 'name', 'isRespondent'],
        as: 'presenterLink'
      },
      include: [{
        model: Institution,
        as: 'affiliationsAsPresenter',
        through: {
          attributes: ['presenterId', 'presentationId', 'institutionId', 'department'],
          as: 'presenterAffiliationLink'
        }
      }]
    }]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.send({
          message: `Cannot find presentation with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error retrieving presentation with id=' + id
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
  Presentation.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Presentation was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update presentation with id=${id}. Maybe presentation was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: 'Error updating presentation with id=' + id
      });
    });
};

// delete an item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Presentation.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Presentation was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete presentation with id=${id}. Maybe presentation was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: err.message || 'Could not delete presentation with id=' + id
      });
    });
};
