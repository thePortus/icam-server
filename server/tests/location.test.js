const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Location Endpoints', () => {

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

  it('CREATE /api/locations should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/locations')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        city: 'Test City',
        state: 'Arizona',
        country: 'United States'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('title');
    createdId = res.body.id;
  });

  it('CREATE /api/locations should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/locations')
      .send({
        title: 'Test Title',
        city: 'Test City',
        state: 'Arizona',
        country: 'United States'
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/locations should reject items without titles', async () => {
    const res = await requestWithSupertest
      .post('/api/locations')
      .set('Authorization', `${token}`)
      .send({
        city: 'Test City',
        state: 'Arizona',
        country: 'United States'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/locations should reject items without city', async () => {
    const res = await requestWithSupertest
      .post('/api/locations')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        state: 'Arizona',
        country: 'United States'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/locations should reject items without state', async () => {
    const res = await requestWithSupertest
      .post('/api/locations')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        city: 'Test City',
        country: 'United States'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/locations should reject items without country', async () => {
    const res = await requestWithSupertest
      .post('/api/locations')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        city: 'Test City',
        state: 'Arizona'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/locations should show all locations', async () => {
    const res = await requestWithSupertest.get('/api/locations');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/locations?page=1&size=5 should show paginated locations', async () => {
    const res = await requestWithSupertest.get('/api/locations?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/locations?page=1&size=5&title=xyz should filter by title', async () => {
    const res = await requestWithSupertest.get('/api/locations?page=0&size=5&title=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/locations/1 should return a single location in full detail', async () => {
    const res = await requestWithSupertest.get('/api/locations/1');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('title');
  });

  it('UPDATE /api/locations/:id should update a single location in full detail', async () => {
    const res = await requestWithSupertest.put('/api/locations/1')
      .set('Authorization', `${token}`)
      .send({
        id: 1,
        title: 'Test Title',
        city: 'Test City',
        state: 'Arizona',
        country: 'United States'
      });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Location was updated successfully.');
  });

  it('UPDATE /api/locations/:id should update reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/locations/1')
      .send({
        id: 1,
        title: 'Test Title',
        city: 'Test City',
        state: 'Arizona',
        country: 'United States'
      });
      expect(res.status).toEqual(401);
  });

  it('DELETE /api/locations/:id should delete a single location', async () => {
    const res = await requestWithSupertest.delete('/api/locations/' + createdId.toString())
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Location was deleted successfully!');
  });

  it('DELETE /api/locations/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/locations/' + createdId.toString())
      expect(res.status).toEqual(401);
  });
  
});