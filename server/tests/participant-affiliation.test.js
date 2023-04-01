const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Participant Affiliation Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('CREATE /api/participant-affiliations should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/participant-affiliations')
      .set('Authorization', `${token}`)
      .send({
        conferenceId: 1,
        personId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('conferenceId');
    expect(res.body).toHaveProperty('personId');
    expect(res.body).toHaveProperty('institutionId');
  });

  it('CREATE /api/participant-affiliations should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/participant-affiliations')
      .send({
        conferenceId: 1,
        personId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/participant-affiliations should reject items without conferenceId', async () => {
    const res = await requestWithSupertest
      .post('/api/participant-affiliations')
      .set('Authorization', `${token}`)
      .send({
        personId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/participant-affiliations should reject items without personId', async () => {
    const res = await requestWithSupertest
      .post('/api/participant-affiliations')
      .set('Authorization', `${token}`)
      .send({
        conferenceId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/participant-affiliations should reject items without institutionId', async () => {
    const res = await requestWithSupertest
      .post('/api/participant-affiliations')
      .set('Authorization', `${token}`)
      .send({
        conferenceId: 1,
        personId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/participant-affiliations should show all participant-affiliations', async () => {
    const res = await requestWithSupertest.get('/api/participant-affiliations');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/participant-affiliations?page=1&size=5 should show paginated participant-affiliations', async () => {
    const res = await requestWithSupertest.get('/api/participant-affiliations?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/participant-affiliations/:id should delete a single participant-affiliations', async () => {
    const res = await requestWithSupertest.delete('/api/participant-affiliations/1/1/1')
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Participant-affiliation was deleted successfully!');
  });

  it('DELETE /api/participant-affiliations/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/participant-affiliations/1/1/1')
      expect(res.status).toEqual(401);
  });

});