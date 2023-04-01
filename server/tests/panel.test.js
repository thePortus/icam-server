const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Panel Endpoints', () => {

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

  it('CREATE /api/panels should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/panels')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        conferenceId: 1,
        type: 'General'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('title');
    createdId = res.body.id;
  });

  it('CREATE /api/panels should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/panels')
      .send({
        title: 'Test Title',
        conferenceId: 1,
        type: 'General'
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/panels should reject items without titles', async () => {
    const res = await requestWithSupertest
      .post('/api/panels')
      .set('Authorization', `${token}`)
      .send({
        conferenceId: 1,
        type: 'General'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/panels should reject items without type', async () => {
    const res = await requestWithSupertest
      .post('/api/panels')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        conferenceId: 1,
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/panels should show all panels', async () => {
    const res = await requestWithSupertest.get('/api/panels');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/panels?page=1&size=5 should show paginated panels', async () => {
    const res = await requestWithSupertest.get('/api/panels?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/panels?page=1&size=5&title=xyz should filter by title', async () => {
    const res = await requestWithSupertest.get('/api/panels?page=0&size=5&title=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/panels?page=1&size=5&type=xyz should filter by type', async () => {
    const res = await requestWithSupertest.get('/api/panels?page=0&size=5&type=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/panels?page=1&size=5&conference=xyz should filter by conference', async () => {
    const res = await requestWithSupertest.get('/api/panels?page=0&size=5&conference=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/panels/1 should return a single panel in full detail', async () => {
    const res = await requestWithSupertest.get('/api/panels/1');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('title');
      expect(res.body.conference).toHaveProperty('title');
      expect(res.body.chairs).toBeInstanceOf(Array);
      expect(res.body.presentations).toBeInstanceOf(Array);
  });

  it('UPDATE /api/panels/:id should update a single panel in full detail', async () => {
    const res = await requestWithSupertest.put('/api/panels/1')
      .set('Authorization', `${token}`)
      .send({
        id: 1,
        title: 'Test Title',
        conferenceId: 1,
        type: 'General'
      });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Panel was updated successfully.');
  });

  it('UPDATE /api/panels/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/panels/1')
      .send({
        id: 1,
        title: 'Test Title',
        conferenceId: 1,
        type: 'General'
      });
      expect(res.status).toEqual(401);
  });

  it('DELETE /api/panels/:id should delete a single panel', async () => {
    const res = await requestWithSupertest.delete('/api/panels/' + createdId.toString())
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Panel was deleted successfully!');
  });

  it('DELETE /api/panels/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/panels/' + createdId.toString())
      expect(res.status).toEqual(401);
  });
  
});