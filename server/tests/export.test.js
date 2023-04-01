const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Export Endpoints', () => {

  let token = '';
  let createdId = 1;

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('GET /api/export should show all export data', async () => {
    const res = await requestWithSupertest.get('/api/export')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.conferences).toBeInstanceOf(Array);
    expect(res.body.disciplines).toBeInstanceOf(Array);
    expect(res.body.institutions).toBeInstanceOf(Array);
    expect(res.body.locations).toBeInstanceOf(Array);
    expect(res.body.panels).toBeInstanceOf(Array);
    expect(res.body.people).toBeInstanceOf(Array);
    expect(res.body.presentations).toBeInstanceOf(Array);
    expect(res.body.topics).toBeInstanceOf(Array);
    expect(res.body.geographies).toBeInstanceOf(Array);
    expect(res.body.chairAffiliations).toBeInstanceOf(Array);
    expect(res.body.conferenceDisciplines).toBeInstanceOf(Array);
    expect(res.body.conferenceInstitutions).toBeInstanceOf(Array);
    expect(res.body.peopleChairing).toBeInstanceOf(Array);
    expect(res.body.peoplePresenting).toBeInstanceOf(Array);
    expect(res.body.peopleParticipating).toBeInstanceOf(Array);
    expect(res.body.presentationGeographies).toBeInstanceOf(Array);
    expect(res.body.presentationTopics).toBeInstanceOf(Array);
    expect(res.body.presenterAffiliations).toBeInstanceOf(Array);
    expect(res.body.participantAffiliations).toBeInstanceOf(Array);
  });

  it('GET /api/export should reject a request without proper authorization', async () => {
    const res = await requestWithSupertest.get('/api/export');
    expect(res.status).toEqual(401);
  });
  
});