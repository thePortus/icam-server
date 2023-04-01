const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Institution Endpoints', () => {

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

  it('CREATE /api/institutions should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/institutions')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        locationId: 1,
        type: 'University',
        funding: 'Public'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('title');
    createdId = res.body.id;
  });

  it('CREATE /api/institutions should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/institutions')
      .send({
        title: 'Test Title',
        locationId: 1,
        type: 'University',
        funding: 'Public'
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/institutions should reject items without titles', async () => {
    const res = await requestWithSupertest
      .post('/api/institutions')
      .set('Authorization', `${token}`)
      .send({
        locationId: 1,
        type: 'University',
        funding: 'Public'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/institutions should reject items without locationId', async () => {
    const res = await requestWithSupertest
      .post('/api/institutions')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        type: 'University',
        funding: 'Public'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/institutions should reject items without types', async () => {
    const res = await requestWithSupertest
      .post('/api/institutions')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        locationId: 1,
        funding: 'Public'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/institutions should reject items without funding', async () => {
    const res = await requestWithSupertest
      .post('/api/institutions')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        locationId: 1,
        type: 'University'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/institutions should show all institutions', async () => {
    const res = await requestWithSupertest.get('/api/institutions');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/institutions?page=1&size=5 should show paginated institutions', async () => {
    const res = await requestWithSupertest.get('/api/institutions?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/institutions?page=1&size=5&title=xyz should filter by title', async () => {
    const res = await requestWithSupertest.get('/api/institutions?page=0&size=5&title=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/institutions?page=1&size=5&location=xyz should filter by location', async () => {
    const res = await requestWithSupertest.get('/api/institutions?page=0&size=5&location=xyz');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body.rows.length).toBe(0)
  });

  it('GET /api/institutions/1 should return a single institution in full detail', async () => {
    const res = await requestWithSupertest.get('/api/institutions/1');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('title');
      expect(res.body.location).toHaveProperty('title');
      expect(res.body.chairs).toBeInstanceOf(Array);
      expect(res.body.presenters).toBeInstanceOf(Array);
      expect(res.body.participants).toBeInstanceOf(Array);
  });

  it('UPDATE /api/institutions/:id should update a single institution in full detail', async () => {
    const res = await requestWithSupertest.put('/api/institutions/2')
      .set('Authorization', `${token}`)
      .send({
        id: 2,
        title: 'Test Title Updated',
        locationId: 1,
        type: 'University',
        funding: 'Public'
      });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Institution was updated successfully.');
  });

  it('UPDATE /api/institutions/:id should update reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/institutions/2')
      .send({
        id: 2,
        title: 'Test Title Updated',
        locationId: 1,
        type: 'University',
        funding: 'Public'
      });
      expect(res.status).toEqual(401);
  });

  it('DELETE /api/institutions/:id should delete a single institution', async () => {
    const res = await requestWithSupertest.delete('/api/institutions/' + createdId.toString())
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Institution was deleted successfully!');
  });

  it('DELETE /api/institutions/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/institutions/' + createdId.toString())
      expect(res.status).toEqual(401);
  });
  
});