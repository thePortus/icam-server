const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Presenter Affiliation Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('DELETE /api/presenter-affiliations/:id should delete a single presenter-affiliations', async () => {
    const res = await requestWithSupertest.delete('/api/presenter-affiliations/1/1/1')
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Presenter-affiliation was deleted successfully!');
  });

  it('CREATE /api/presenter-affiliations should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/presenter-affiliations')
      .set('Authorization', `${token}`)
      .send({
        presentationId: 1,
        presenterId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('presentationId');
    expect(res.body).toHaveProperty('presenterId');
    expect(res.body).toHaveProperty('institutionId');
  });

  it('CREATE /api/presenter-affiliations should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/presenter-affiliations')
      .send({
        presentationId: 1,
        presenterId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/presenter-affiliations should reject items without presentationId', async () => {
    const res = await requestWithSupertest
      .post('/api/presenter-affiliations')
      .set('Authorization', `${token}`)
      .send({
        presenterId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/presenter-affiliations should reject items without presenterId', async () => {
    const res = await requestWithSupertest
      .post('/api/presenter-affiliations')
      .set('Authorization', `${token}`)
      .send({
        presentationId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/presenter-affiliations should reject items without institutionId', async () => {
    const res = await requestWithSupertest
      .post('/api/presenter-affiliations')
      .set('Authorization', `${token}`)
      .send({
        presentationId: 1,
        presenterId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/presenter-affiliations should show all presenter-affiliations', async () => {
    const res = await requestWithSupertest.get('/api/presenter-affiliations');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/presenter-affiliations?page=1&size=5 should show paginated presenter-affiliations', async () => {
    const res = await requestWithSupertest.get('/api/presenter-affiliations?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/presenter-affiliations/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/presenter-affiliations/1/1/1')
      expect(res.status).toEqual(401);
  });

});