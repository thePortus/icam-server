const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Chair Affiliation Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('CREATE /api/chair-affiliations should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/chair-affiliations')
      .set('Authorization', `${token}`)
      .send({
        panelId: 1,
        chairId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('panelId');
    expect(res.body).toHaveProperty('chairId');
    expect(res.body).toHaveProperty('institutionId');
  });

  it('CREATE /api/chair-affiliations should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/chair-affiliations')
      .send({
        panelId: 1,
        chairId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/chair-affiliations should reject items without panelId', async () => {
    const res = await requestWithSupertest
      .post('/api/chair-affiliations')
      .set('Authorization', `${token}`)
      .send({
        chairId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/chair-affiliations should reject items without chairId', async () => {
    const res = await requestWithSupertest
      .post('/api/chair-affiliations')
      .set('Authorization', `${token}`)
      .send({
        panelId: 1,
        institutionId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/chair-affiliations should reject items without institutionId', async () => {
    const res = await requestWithSupertest
      .post('/api/chair-affiliations')
      .set('Authorization', `${token}`)
      .send({
        panelId: 1,
        chairId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/chair-affiliations should show all chair-affiliations', async () => {
    const res = await requestWithSupertest.get('/api/chair-affiliations');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/chair-affiliations?page=1&size=5 should show paginated chair-affiliations', async () => {
    const res = await requestWithSupertest.get('/api/chair-affiliations?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/chair-affiliations/:id should delete a single chair-affiliations', async () => {
    const res = await requestWithSupertest.delete('/api/chair-affiliations/1/1/1')
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Chair-affiliation was deleted successfully!');
  });

  it('DELETE /api/chair-affiliations/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/chair-affiliations/1/1/1')
      expect(res.status).toEqual(401);
  });

});