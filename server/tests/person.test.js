const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Person Endpoints', () => {

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

  it('CREATE /api/people should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/people')
      .set('Authorization', `${token}`)
      .send({
        name: 'Test Name',
        orcId: '0000-0000-0000-0000'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('name');
    createdId = res.body.id;
  });

  it('CREATE /api/people should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/people')
      .send({
        name: 'Test Name',
        orcId: '0000-0000-0000-0000'
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/people should reject items without name', async () => {
    const res = await requestWithSupertest
      .post('/api/people')
      .set('Authorization', `${token}`)
      .send({
        orcId: '0000-0000-0000-0000'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/people should show all people', async () => {
    const res = await requestWithSupertest.get('/api/people');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/people?page=1&size=5 should show paginated people', async () => {
    const res = await requestWithSupertest.get('/api/people?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/people?page=1&size=5&name=xyz should filter by name', async () => {
    const res = await requestWithSupertest.get('/api/people?page=0&size=5&name=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/people?page=1&size=5&conference=xyz should filter by conference', async () => {
    const res = await requestWithSupertest.get('/api/people?page=0&size=5&conference=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/people?page=1&size=5&panel=xyz should filter by panel', async () => {
    const res = await requestWithSupertest.get('/api/people?page=0&size=5&panel=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/people?page=1&size=5&presentation=xyz should filter by presentation', async () => {
    const res = await requestWithSupertest.get('/api/people?page=0&size=5&presentation=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/people/1 should return a single person in full detail', async () => {
    const res = await requestWithSupertest.get('/api/people/1');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('name');
      expect(res.body.chairedPanels).toBeInstanceOf(Array);
      expect(res.body.presentations).toBeInstanceOf(Array);
      expect(res.body.participantConferences).toBeInstanceOf(Array);
  });

  it('UPDATE /api/people/:id should update a single person in full detail', async () => {
    const res = await requestWithSupertest.put('/api/people/1')
      .set('Authorization', `${token}`)
      .send({
        id: 1,
        name: 'Test Name Updated',
        orcId: '0000-0000-0000-0000'
      });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Person was updated successfully.');
  });

  it('UPDATE /api/people/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/people/1')
      .send({
        id: 1,
        name: 'Test Name Updated',
        orcId: '0000-0000-0000-0000'
      });
      expect(res.status).toEqual(401);
  });

  it('DELETE /api/people/:id should delete a single person', async () => {
    const res = await requestWithSupertest.delete('/api/people/' + createdId.toString())
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Person was deleted successfully!');
  });

  it('DELETE /api/people/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/people/' + createdId.toString())
      expect(res.status).toEqual(401);
  });
  
});