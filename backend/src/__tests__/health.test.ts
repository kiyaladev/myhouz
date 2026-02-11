import request from 'supertest';
import express from 'express';
import apiRoutes from '../routes';

// Create a test app (without DB connection)
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('API Health', () => {
  it('GET /api/health should return status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/test should return welcome message', async () => {
    const res = await request(app).get('/api/test');
    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });
});
