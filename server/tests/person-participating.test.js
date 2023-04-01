const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Person Participating Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('CREATE /api/people-participating should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/people-participating')
      .set('Authorization', `${token}`)
      .send({
        conferenceId: 1,
        personId: 1,
        name: '',
        role: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('conferenceId');
    expect(res.body).toHaveProperty('personId');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('role');
  });

  it('CREATE /api/people-participating should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/people-participating')
      .send({
        conferenceId: 1,
        personId: 1,
        name: '',
        role: ''
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/people-participating should reject items without conferenceId', async () => {
    const res = await requestWithSupertest
      .post('/api/people-participating')
      .set('Authorization', `${token}`)
      .send({
        personId: 1,
        name: '',
        role: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/people-participating should reject items without personId', async () => {
    const res = await requestWithSupertest
      .post('/api/people-participating')
      .set('Authorization', `${token}`)
      .send({
        conferenceId: 1,
        name: '',
        role: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/people-participating should show all people-participating', async () => {
    const res = await requestWithSupertest.get('/api/people-participating');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/people-participating?page=1&size=5 should show paginated people-participating', async () => {
    const res = await requestWithSupertest.get('/api/people-participating?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/people-participating/:id should delete a single people-participating', async () => {
    const res = await requestWithSupertest.delete('/api/people-participating/1/1')
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Person-participating was deleted successfully!');
  });

  it('DELETE /api/people-participating/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/people-participating/1/1')
      expect(res.status).toEqual(401);
  });

});