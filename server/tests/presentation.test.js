const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Presentation Endpoints', () => {

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

  it('CREATE /api/presentations should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/presentations')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Name',
        panelId: 1,
        description: '',
        text: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('title');
    createdId = res.body.id;
  });

  it('CREATE /api/presentations should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/presentations')
      .send({
        title: 'Test Name',
        panelId: 1,
        description: '',
        text: ''
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/presentations should reject items without panelId', async () => {
    const res = await requestWithSupertest
      .post('/api/presentations')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Name',
        description: '',
        text: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/presentations should show all presentations', async () => {
    const res = await requestWithSupertest.get('/api/presentations');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/presentations?page=1&size=5 should show paginated presentations', async () => {
    const res = await requestWithSupertest.get('/api/presentations?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/presentations?page=1&size=5&name=xyz should filter by title', async () => {
    const res = await requestWithSupertest.get('/api/presentations?page=0&size=5&title=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/presentations?page=1&size=5&conference=xyz should filter by conference', async () => {
    const res = await requestWithSupertest.get('/api/presentations?page=0&size=5&conference=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/presentations?page=1&size=5&panel=xyz should filter by panel', async () => {
    const res = await requestWithSupertest.get('/api/presentations?page=0&size=5&panel=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/presentations?page=1&size=5&presenter=xyz should filter by presenter', async () => {
    const res = await requestWithSupertest.get('/api/presentations?page=0&size=5&presenter=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/presentations?page=1&size=5&topic=xyz should filter by topic', async () => {
    const res = await requestWithSupertest.get('/api/presentations?page=0&size=5&topic=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/presentations?page=1&size=5&place=xyz should filter by place', async () => {
    const res = await requestWithSupertest.get('/api/presentations?page=0&size=5&place=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/presentations/1 should return a single presentation in full detail', async () => {
    const res = await requestWithSupertest.get('/api/presentations/1');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('title');
      expect(res.body.panel).toHaveProperty('title');
      expect(res.body.topics).toBeInstanceOf(Array);
      expect(res.body.geographies).toBeInstanceOf(Array);
      expect(res.body.presenters).toBeInstanceOf(Array);
  });

  it('UPDATE /api/presentations/:id should update a single presentation in full detail', async () => {
    const res = await requestWithSupertest.put('/api/presentations/1')
      .set('Authorization', `${token}`)
      .send({
        id: 1,
        title: 'Test Name Updated',
        panelId: 1,
        description: '',
        text: ''
      });
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Presentation was updated successfully.');
  });

  it('UPDATE /api/presentations/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/presentations/1')
      .send({
        id: 1,
        title: 'Test Name Updated',
        panelId: 1,
        description: '',
        text: ''
      });
      expect(res.status).toEqual(401);
  });

  it('DELETE /api/presentations/:id should delete a single presentation', async () => {
    const res = await requestWithSupertest.delete('/api/presentations/' + createdId.toString())
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Presentation was deleted successfully!');
  });

  it('DELETE /api/presentations/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/presentations/' + createdId.toString())
      expect(res.status).toEqual(401);
  });
  
});