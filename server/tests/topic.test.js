const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Topic Endpoints', () => {

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

  it('CREATE /api/topics should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/topics')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Name',
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('title');
    createdId = res.body.id;
  });

  it('CREATE /api/topics should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/topics')
      .send({
        title: 'Test Name',
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/topics should reject items without title', async () => {
    const res = await requestWithSupertest
      .post('/api/topics')
      .set('Authorization', `${token}`)
      .send({});
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/topics should show all topics', async () => {
    const res = await requestWithSupertest.get('/api/topics');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/topics?page=1&size=5 should show paginated topics', async () => {
    const res = await requestWithSupertest.get('/api/topics?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/topics?page=1&size=5&name=xyz should filter by title', async () => {
    const res = await requestWithSupertest.get('/api/topics?page=0&size=5&title=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/topics/1 should return a single topic in full detail', async () => {
    const res = await requestWithSupertest.get('/api/topics/1');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('title');
      expect(res.body.presentations).toBeInstanceOf(Array);
  });

  it('UPDATE /api/topics/:id should update a single topic in full detail', async () => {
    const res = await requestWithSupertest.put('/api/topics/1')
      .set('Authorization', `${token}`)
      .send({
        id: 1,
        title: 'Test Name Updated'
      });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Topic was updated successfully.');
  });

  it('UPDATE /api/topics/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/topics/1')
      .send({
        id: 1,
        title: 'Test Name Updated'
      });
      expect(res.status).toEqual(401);
  });

  it('DELETE /api/topics/:id should delete a single topic', async () => {
    const res = await requestWithSupertest.delete('/api/topics/' + createdId.toString())
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Topic was deleted successfully!');
  });

  it('DELETE /api/topics/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/topics/' + createdId.toString())
      expect(res.status).toEqual(401);
  });
  
});