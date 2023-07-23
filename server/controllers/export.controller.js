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
const PersonParticipating= db.peopleParticipating;
const PresentationGeography = db.presentationGeographies;
const PresentationTopic = db.presentationTopics;
const PresenterAffiliation = db.presenterAffiliations;
const ParticipantAfilliation = db.participantAffiliations;
const PersonResponding = db.peopleResponding;
const RespondantAffiliation = db.respondentAffiliations;

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
    peopleParticipating: [],
    presentationGeographies: [],
    presentationTopics: [],
    presenterAffiliations: [],
    participantAffiliations: []
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
                                                                      PersonParticipating.findAll()
                                                                        .then(personParticipatingData => {
                                                                          ParticipantAfilliation.findAll()
                                                                            .then(participantAffilationData => {
                                                                              PersonResponding.findAll()
                                                                                .then(personRespondingData => {
                                                                                  RespondantAffiliation.findAll()
                                                                                    .then(respondentAffiliationData => {
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
                                                                                        peopleParticipating: personParticipatingData,
                                                                                        presentationGeographies: presentationGeographyData,
                                                                                        presentationTopics: presentationTopicData,
                                                                                        presenterAffiliations: presenterAffiliationData,
                                                                                        participantAffiliations: participantAffilationData,
                                                                                        peopleResponding: personRespondingData,
                                                                                        respondentAffiliations: respondentAffiliationData
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
                });
            });
        });
    });
};