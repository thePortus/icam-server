const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Conference Discipline Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('DELETE /api/conference-disciplines/:id should delete a single conference-disciplines', async () => {
    const res = await requestWithSupertest.delete('/api/conference-disciplines/1/1')
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Conference-discipline was deleted successfully!');
  });

  it('CREATE /api/conference-disciplines should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/conference-disciplines')
      .set('Authorization', `${token}`)
      .send({
        conferenceId: 1,
        disciplineId: 1,
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('conferenceId');
    expect(res.body).toHaveProperty('disciplineId');
  });

  it('CREATE /api/conference-disciplines should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/conference-disciplines')
      .send({
        confrenceId: 1,
        disciplineId: 1,
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/conference-disciplines should reject items without conferenceId', async () => {
    const res = await requestWithSupertest
      .post('/api/conference-disciplines')
      .set('Authorization', `${token}`)
      .send({
        disciplineId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/conference-disciplines should reject items without disciplineId', async () => {
    const res = await requestWithSupertest
      .post('/api/conference-disciplines')
      .set('Authorization', `${token}`)
      .send({
        confrenceId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/conference-disciplines should show all conference-disciplines', async () => {
    const res = await requestWithSupertest.get('/api/conference-disciplines');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/conference-disciplines?page=1&size=5 should show paginated conference-disciplines', async () => {
    const res = await requestWithSupertest.get('/api/conference-disciplines?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/conference-disciplines/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/conference-disciplines/1/1')
      expect(res.status).toEqual(401);
  });

});