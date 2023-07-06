const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Respondent Affiliation Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('CREATE /api/respondent-affiliations should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/respondent-affiliations')
      .set('Authorization', `${token}`)
      .send({
        panelId: 1,
        respondentId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('panelId');
    expect(res.body).toHaveProperty('respondentId');
    expect(res.body).toHaveProperty('institutionId');
  });

  it('CREATE /api/respondent-affiliations should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/respondent-affiliations')
      .send({
        panelId: 1,
        respondentId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/respondent-affiliations should reject items without panelId', async () => {
    const res = await requestWithSupertest
      .post('/api/respondent-affiliations')
      .set('Authorization', `${token}`)
      .send({
        respondentId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/respondent-affiliations should reject items without respondentId', async () => {
    const res = await requestWithSupertest
      .post('/api/respondent-affiliations')
      .set('Authorization', `${token}`)
      .send({
        panelId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/respondent-affiliations should reject items without institutionId', async () => {
    const res = await requestWithSupertest
      .post('/api/respondent-affiliations')
      .set('Authorization', `${token}`)
      .send({
        panelId: 1,
        respondentId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  /* REINSTATE AFTER ADDING RESPONDENT DATA
  it('GET /api/respondent-affiliations should show all respondent-affiliations', async () => {
    const res = await requestWithSupertest.get('/api/respondent-affiliations');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/respondent-affiliations?page=1&size=5 should show paginated respondent-affiliations', async () => {
    const res = await requestWithSupertest.get('/api/respondent-affiliations?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/respondent-affiliations/:id should delete a single respondent-affiliations', async () => {
    const res = await requestWithSupertest.delete('/api/respondent-affiliations/1/1/1')
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Chair-affiliation was deleted successfully!');
  });
  */

  it('DELETE /api/respondent-affiliations/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/respondent-affiliations/1/1/1')
      expect(res.status).toEqual(401);
  });

});