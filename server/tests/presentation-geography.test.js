const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

let createdId = null;

describe('Presentation Geography Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('CREATE /api/presentation-geographies should accept valid data', async () => {
    // first create a geography since one likely does not exist in seeders
    const preRes = await requestWithSupertest
      .post('/api/geographies')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Geography',
      });
    createdId = preRes.body.id;
    const res = await requestWithSupertest
      .post('/api/presentation-geographies')
      .set('Authorization', `${token}`)
      .send({
        presentationId: 1,
        geographyId: createdId,
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('presentationId');
    expect(res.body).toHaveProperty('geographyId');
  });

  it('CREATE /api/presentation-geographies should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/presentation-geographies')
      .send({
        presentationId: 1,
        geographyId: 1,
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/presentation-geographies should reject items without presentationId', async () => {
    const res = await requestWithSupertest
      .post('/api/presentation-geographies')
      .set('Authorization', `${token}`)
      .send({
        geographyId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('CREATE /api/presentation-geographies should reject items without geographyId', async () => {
    const res = await requestWithSupertest
      .post('/api/presentation-geographies')
      .set('Authorization', `${token}`)
      .send({
        presentationId: 1
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0)
  });

  it('GET /api/presentation-geographies should show all presentation-geographies', async () => {
    const res = await requestWithSupertest.get('/api/presentation-geographies');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/presentation-geographies?page=1&size=5 should show paginated presentation-geographies', async () => {
    const res = await requestWithSupertest.get('/api/presentation-geographies?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/presentation-geographies/:id should delete a single presentation-geographies', async () => {
    const res = await requestWithSupertest.delete('/api/presentation-geographies/1/' + createdId.toString())
      .set('Authorization', `${token}`);
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('message', 'Presentation-geography was deleted successfully!');
  });

  it('DELETE /api/presentation-geographies/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/presentation-geographies/1/' + createdId.toString())
      expect(res.status).toEqual(401);
  });

});