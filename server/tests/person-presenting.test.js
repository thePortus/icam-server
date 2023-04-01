const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Person Presenting Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('DELETE /api/people-presenting/:id should delete a single people-presenting', async () => {
    const res = await requestWithSupertest.delete('/api/people-presenting/1/1')
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Person-presenting was deleted successfully!');
  });

  it('CREATE /api/people-presenting should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/people-presenting')
      .set('Authorization', `${token}`)
      .send({
        presentationId: 1,
        personId: 1,
        name: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('presentationId');
    expect(res.body).toHaveProperty('personId');
    expect(res.body).toHaveProperty('name');
  });

  it('CREATE /api/people-presenting should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/people-presenting')
      .send({
        presentationId: 1,
        personId: 1,
        name: ''
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/people-presenting should reject items without presentationId', async () => {
    const res = await requestWithSupertest
      .post('/api/people-presenting')
      .set('Authorization', `${token}`)
      .send({
        personId: 1,
        name: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/people-presenting should reject items without personId', async () => {
    const res = await requestWithSupertest
      .post('/api/people-presenting')
      .set('Authorization', `${token}`)
      .send({
        presentationId: 1,
        name: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/people-presenting should show all people-presenting', async () => {
    const res = await requestWithSupertest.get('/api/people-presenting');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/people-presenting?page=1&size=5 should show paginated people-presenting', async () => {
    const res = await requestWithSupertest.get('/api/people-presenting?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/people-presenting/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/people-presenting/1/1')
      expect(res.status).toEqual(401);
  });

});