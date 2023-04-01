const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Presentation Topic Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('CREATE /api/presentation-topics should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/presentation-topics')
      .set('Authorization', `${token}`)
      .send({
        presentationId: 1,
        topicId: 1,
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('presentationId');
    expect(res.body).toHaveProperty('topicId');
  });

  it('CREATE /api/presentation-topics should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/presentation-topics')
      .send({
        presentationId: 1,
        topicId: 1,
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/presentation-topics should reject items without presentationId', async () => {
    const res = await requestWithSupertest
      .post('/api/presentation-topics')
      .set('Authorization', `${token}`)
      .send({
        topicId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/presentation-topics should reject items without topicId', async () => {
    const res = await requestWithSupertest
      .post('/api/presentation-topics')
      .set('Authorization', `${token}`)
      .send({
        presentationId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/presentation-topics should show all presentation-topics', async () => {
    const res = await requestWithSupertest.get('/api/presentation-topics');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/presentation-topics?page=1&size=5 should show paginated presentation-topics', async () => {
    const res = await requestWithSupertest.get('/api/presentation-topics?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/presentation-topics/:id should delete a single presentation-topics', async () => {
    const res = await requestWithSupertest.delete('/api/presentation-topics/1/1')
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Presentation-topic was deleted successfully!');
  });

  it('DELETE /api/presentation-topics/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/presentation-topics/1/1')
      expect(res.status).toEqual(401);
  });

});