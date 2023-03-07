/**
 * @file Controller for exporting database data for backup
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
const ChairAffiliation = db.chairAffiliations;
const ConferenceDiscipline = db.conferenceDisciplines;
const ConferenceInstitution = db.conferenceInstitutions;
const PersonChairing = db.peopleChairing;
const PersonPresenting = db.peoplePresenting;
const PresentationGeography = db.presentationGeographies;
const PresentationTopic = db.presentationTopics;
const PresenterAffiliation = db.presenterAffiliations;

// retrieve all items from the database.
exports.findAll = (req, res) => {
  let responseData = {
    conferences: [],
    disciplines: [],
    institutions: [],
    locations: [],
    panels: [],
    people: [],
    presentations: [],
    topics: [],
    geographies: [],
    chairAffiliations: [],
    conferenceDisciplines: [],
    conferenceInstitutions: [],
    peopleChairing: [],
    peoplePresenting: [],
    presentationGeographies: [],
    presentationTopics: [],
    presenterAffiliations: []
  };

  // Nest each request for async chaining
  Conference.findAll()
    .then(conferenceData => {
      Discipline.findAll()
        .then(disciplineData => {
          Institution.findAll()
            .then(institutionData => {
              Location.findAll()
                .then(locationData => {
                  Panel.findAll()
                    .then(panelData => {
                      Person.findAll()
                        .then(personData => {
                          Presentation.findAll()
                            .then(presentationData => {
                              Topic.findAll()
                                .then(topicData => {
                                  Geography.findAll()
                                    .then(geographyData => {
                                      ChairAffiliation.findAll()
                                        .then(chairAffiliationData => {
                                          ConferenceDiscipline.findAll()
                                            .then(conferenceDisciplineData => {
                                              ConferenceInstitution.findAll()
                                                .then(conferenceInstitutionData => {
                                                  PersonChairing.findAll()
                                                    .then(personChairingData => {
                                                      PersonPresenting.findAll()
                                                        .then(personPresentingData => {
                                                          PresentationGeography.findAll()
                                                            .then(presentationGeographyData => {
                                                              PresentationTopic.findAll()
                                                                .then(presentationTopicData => {
                                                                  PresenterAffiliation.findAll()
                                                                    .then(presenterAffiliationData => {
                                                                      // store all response data
                                                                      responseData = {
                                                                        conferences: conferenceData,
                                                                        disciplines: disciplineData,
                                                                        institutions: institutionData,
                                                                        locations: locationData,
                                                                        panels: panelData,
                                                                        people: personData,
                                                                        presentations: presentationData,
                                                                        topics: topicData,
                                                                        geographies: geographyData,
                                                                        chairAffiliations: chairAffiliationData,
                                                                        conferenceDisciplines: conferenceDisciplineData,
                                                                        conferenceInstitutions: conferenceInstitutionData,
                                                                        peopleChairing: personChairingData,
                                                                        peoplePresenting: personPresentingData,
                                                                        presentationGeographies: presentationGeographyData,
                                                                        presentationTopics: presentationTopicData,
                                                                        presenterAffiliations: presenterAffiliationData
                                                                      };
                                                                      res.send(responseData);
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};