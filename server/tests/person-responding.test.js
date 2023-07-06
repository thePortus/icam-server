const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Person Responding Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('CREATE /api/people-responding should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/people-responding')
      .set('Authorization', `${token}`)
      .send({
        panelId: 1,
        personId: 1,
        name: '',
        title: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('panelId');
    expect(res.body).toHaveProperty('personId');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('title');
  });

  it('CREATE /api/people-responding should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/people-responding')
      .send({
        panelId: 1,
        personId: 1,
        name: '',
        title: ''
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/people-responding should reject items without panelId', async () => {
    const res = await requestWithSupertest
      .post('/api/people-responding')
      .set('Authorization', `${token}`)
      .send({
        personId: 1,
        name: '',
        title: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/people-responding should reject items without personId', async () => {
    const res = await requestWithSupertest
      .post('/api/people-responding')
      .set('Authorization', `${token}`)
      .send({
        panelId: 1,
        name: '',
        title: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  /*
  it('GET /api/people-responding should show all people-responding', async () => {
    const res = await requestWithSupertest.get('/api/people-responding');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/people-responding?page=1&size=5 should show paginated people-responding', async () => {
    const res = await requestWithSupertest.get('/api/people-responding?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/people-responding/:id should delete a single people-responding', async () => {
    const res = await requestWithSupertest.delete('/api/people-responding/1/1')
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Person-responding was deleted successfully!');
  });
  */

  it('DELETE /api/people-responding/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/people-responding/1/1')
      expect(res.status).toEqual(401);
  });

});