const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Discipline Endpoints', () => {

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

  it('CREATE /api/disciplines should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/disciplines')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('title');
    createdId = res.body.id;
  });

  it('CREATE /api/disciplines should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/disciplines')
      .send({
        title: 'Test Title',
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/disciplines should reject items without titles', async () => {
    const res = await requestWithSupertest
      .post('/api/disciplines')
      .set('Authorization', `${token}`)
      .send({});
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/disciplines should show all disciplines', async () => {
    const res = await requestWithSupertest.get('/api/disciplines');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/disciplines?page=1&size=5 should show paginated disciplines', async () => {
    const res = await requestWithSupertest.get('/api/disciplines?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/disciplines?page=1&size=5&title=xyz should filter by title', async () => {
    const res = await requestWithSupertest.get('/api/disciplines?page=0&size=5&title=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/disciplines/1 should return a single discipline in full detail', async () => {
    const res = await requestWithSupertest.get('/api/disciplines/1');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('title');
      expect(res.body.conferences).toBeInstanceOf(Array);
  });

  it('UPDATE /api/disciplines/:id should update a single discipline in full detail', async () => {
    const res = await requestWithSupertest.put('/api/disciplines/2')
      .set('Authorization', `${token}`)
      .send({
        id: 2,
        title: 'Test Title Updated'
      });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Discipline was updated successfully.');
  });

  it('UPDATE /api/disciplines/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/disciplines/2')
      .send({
        id: 2,
        title: 'Test Title Updated'
      });
      expect(res.status).toEqual(401);
  });

  it('DELETE /api/disciplines/:id should delete a single discipline', async () => {
    const res = await requestWithSupertest.delete('/api/disciplines/' + createdId.toString())
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Discipline was deleted successfully!');
  });

  it('DELETE /api/disciplines/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/disciplines/' + createdId.toString())
      expect(res.status).toEqual(401);
  });
  
});