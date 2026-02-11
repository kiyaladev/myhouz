import request from 'supertest';
import express from 'express';
import searchRoutes from '../routes/searchRoutes';

const app = express();
app.use(express.json());
app.use('/api/search', searchRoutes);

describe('Search API', () => {
  it('GET /api/search should return 400 without query', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/search?q=a should return 400 for short query', async () => {
    const res = await request(app).get('/api/search?q=a');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/search/suggestions should return empty for no query', async () => {
    const res = await request(app).get('/api/search/suggestions');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });
});
