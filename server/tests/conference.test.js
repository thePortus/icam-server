const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Conference Endpoints', () => {

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

  it('CREATE /api/conferences should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/conferences')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        locationId: 1,
        year: 2023,
        startMonth: 1,
        startDay: 1,
        endMonth: 1,
        endDay: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('title');
    createdId = res.body.id;
  });

  it('CREATE /api/conferences should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/conferences')
      .send({
        title: 'Test Title',
        locationId: 1,
        year: 2023,
        startMonth: 1,
        startDay: 1,
        endMonth: 1,
        endDay: 1
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/conferences should reject items without titles', async () => {
    const res = await requestWithSupertest
      .post('/api/conferences')
      .set('Authorization', `${token}`)
      .send({
        locationId: 1,
        year: 2023,
        startMonth: 1,
        startDay: 1,
        endMonth: 1,
        endDay: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/conferences should show all conferences', async () => {
    const res = await requestWithSupertest.get('/api/conferences');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/conferences?page=1&size=5 should show paginated conferences', async () => {
    const res = await requestWithSupertest.get('/api/conferences?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/conferences?page=1&size=5&title=xyz should filter by title', async () => {
    const res = await requestWithSupertest.get('/api/conferences?page=0&size=5&title=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/conferences?page=1&size=5&institution=xyz should filter by institutions', async () => {
    const res = await requestWithSupertest.get('/api/conferences?page=0&size=5&institution=xyz');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body.rows.length).toBe(0)
  });

  it('GET /api/conferences?page=1&size=5&location=xyz should filter by location', async () => {
    const res = await requestWithSupertest.get('/api/conferences?page=0&size=5&location=xyz');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body.rows.length).toBe(0)
  });

  it('GET /api/conferences?page=1&size=5&discipline=xyz should filter by disciplines', async () => {
    const res = await requestWithSupertest.get('/api/conferences?page=0&size=5&discipline=xyz');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body.rows.length).toBe(0)
  });

  it('GET /api/conferences/1 should return a single conference in full detail', async () => {
    const res = await requestWithSupertest.get('/api/conferences/1');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('title');
      expect(res.body.location).toHaveProperty('title');
      expect(res.body.panels).toBeInstanceOf(Array);
      expect(res.body.disciplines).toBeInstanceOf(Array);
      expect(res.body.institutions).toBeInstanceOf(Array);
      expect(res.body.participants).toBeInstanceOf(Array);
  });

  it('UPDATE /api/conferences/:id should update a single conference in full detail', async () => {
    const res = await requestWithSupertest.put('/api/conferences/2')
      .set('Authorization', `${token}`)
      .send({
        id: 2,
        title: 'test title',
        locationId: 1,
        year: 2023,
        startMonth: 1,
        startDay: 1,
        endMonth: 1,
        endDay: 1
      });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Conference was updated successfully.');
  });

  it('UPDATE /api/conferences/:id should update reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/conferences/2')
      .send({
        id: 2,
        title: 'test title',
        locationId: 1,
        year: 2023,
        startMonth: 1,
        startDay: 1,
        endMonth: 1,
        endDay: 1
      });
      expect(res.status).toEqual(401);
  });

  it('DELETE /api/conferences/:id should delete a single conference', async () => {
    const res = await requestWithSupertest.delete('/api/conferences/' + createdId.toString())
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Conference was deleted successfully!');
  });

  it('DELETE /api/conferences/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/conferences/' + createdId.toString())
      expect(res.status).toEqual(401);
  });
  
});