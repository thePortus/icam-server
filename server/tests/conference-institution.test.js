const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Conference Institution Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('DELETE /api/conference-institutions/:id should delete a single conference-institutions', async () => {
    const res = await requestWithSupertest.delete('/api/conference-institutions/1/1')
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Conference-institution was deleted successfully!');
  });

  it('CREATE /api/conference-institutions should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/conference-institutions')
      .set('Authorization', `${token}`)
      .send({
        conferenceId: 1,
        institutionId: 1,
        host: false,
        sponsor: false,
        society: false
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('conferenceId');
    expect(res.body).toHaveProperty('institutionId');
  });

  it('CREATE /api/conference-institutions should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/conference-institutions')
      .send({
        conferenceId: 1,
        institutionId: 1,
        host: false,
        sponsor: false,
        society: false
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/conference-institutions should reject items without conferenceId', async () => {
    const res = await requestWithSupertest
      .post('/api/conference-institutions')
      .set('Authorization', `${token}`)
      .send({
        institutionId: 1,
        host: false,
        sponsor: false,
        society: false
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/conference-institutions should reject items without institutionId', async () => {
    const res = await requestWithSupertest
      .post('/api/conference-institutions')
      .set('Authorization', `${token}`)
      .send({
        conferenceId: 1,
        host: false,
        sponsor: false,
        society: false
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/conference-institutions should show all conference-institutions', async () => {
    const res = await requestWithSupertest.get('/api/conference-institutions');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/conference-institutions?page=1&size=5 should show paginated conference-institutions', async () => {
    const res = await requestWithSupertest.get('/api/conference-institutions?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/conference-institutions/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/conference-institutions/1/1')
      expect(res.status).toEqual(401);
  });

});