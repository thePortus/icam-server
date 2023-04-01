const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Geography Endpoints', () => {

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

  it('CREATE /api/geographies should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/geographies')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Name',
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('title');
    createdId = res.body.id;
  });

  it('CREATE /api/geographies should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/geographies')
      .send({
        title: 'Test Name',
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/geographies should reject items without title', async () => {
    const res = await requestWithSupertest
      .post('/api/geographies')
      .set('Authorization', `${token}`)
      .send({});
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/geographies should show all geographies', async () => {
    const res = await requestWithSupertest.get('/api/geographies');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });

  it('GET /api/geographies?page=1&size=5 should show paginated geographies', async () => {
    const res = await requestWithSupertest.get('/api/geographies?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(0);
  });

  it('GET /api/geographies?page=1&size=5&name=xyz should filter by title', async () => {
    const res = await requestWithSupertest.get('/api/geographies?page=0&size=5&title=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/geographies/1 should return a single geography in full detail', async () => {
    const res = await requestWithSupertest.get('/api/geographies/1');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('title');
  });

  it('UPDATE /api/geographies/:id should update a single geography in full detail', async () => {
    const res = await requestWithSupertest.put('/api/geographies/1')
      .set('Authorization', `${token}`)
      .send({
        id: 1,
        title: 'Test Name Updated',
      });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Geography was updated successfully.');
  });

  it('UPDATE /api/geographies/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/geographies/1')
      .send({
        id: 1,
        title: 'Test Name Updated',
      });
      expect(res.status).toEqual(401);
  });

  it('DELETE /api/geographies/:id should delete a single geography', async () => {
    const res = await requestWithSupertest.delete('/api/geographies/' + createdId.toString())
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Geography was deleted successfully!');
  });

  it('DELETE /api/geographies/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/geographies/' + createdId.toString())
      expect(res.status).toEqual(401);
  });
  
});