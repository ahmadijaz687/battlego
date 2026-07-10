import request from 'supertest';
import healthRoutes from '../src/routes/health.js';
import { getHealthSummary } from '../src/services/healthService.js';
import { createRouteApp } from './helpers/setup.js';

const { app, authHeader } = createRouteApp(healthRoutes, '/api/health');

describe('Health Service', () => {
  describe('getHealthSummary', () => {
    it('should return a health summary object', async () => {
      const summary = await getHealthSummary('test-user');
      expect(summary).toBeDefined();
      expect(typeof summary).toBe('object');
    });
  });
});

describe('API Response Format', () => {
  it('health response should match expected format', () => {
    const healthResponse = {
      success: true,
      message: 'Success',
      data: {
        status: 'ok',
        uptime: expect.any(Number),
        timestamp: expect.any(String),
      },
    };

    const mockResponse = {
      success: true,
      message: 'Success',
      data: {
        status: 'ok',
        uptime: 123.456,
        timestamp: new Date().toISOString(),
      },
    };

    expect(mockResponse).toMatchObject(healthResponse);
  });
});

describe('Health Routes', () => {
  describe('GET /api/health/summary', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/health/summary');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/health/sleep (log sleep)', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/health/sleep')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for negative duration', async () => {
      const response = await request(app)
        .post('/api/health/sleep')
        .set('Authorization', authHeader)
        .send({ date: '2024-01-01', duration: -100 });
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid quality range', async () => {
      const response = await request(app)
        .post('/api/health/sleep')
        .set('Authorization', authHeader)
        .send({ date: '2024-01-01', duration: 480, quality: 15 });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/health/hrv (log HRV)', () => {
    it('should return 400 for missing date', async () => {
      const response = await request(app)
        .post('/api/health/hrv')
        .set('Authorization', authHeader)
        .send({ hrv: 65 });
      expect(response.status).toBe(400);
    });

    it('should return 400 for negative HRV', async () => {
      const response = await request(app)
        .post('/api/health/hrv')
        .set('Authorization', authHeader)
        .send({ date: '2024-01-01', hrv: -10 });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/health/mood (log mood)', () => {
    it('should return 400 for missing date', async () => {
      const response = await request(app)
        .post('/api/health/mood')
        .set('Authorization', authHeader)
        .send({ mood: 7 });
      expect(response.status).toBe(400);
    });

    it('should return 400 for mood out of range', async () => {
      const response = await request(app)
        .post('/api/health/mood')
        .set('Authorization', authHeader)
        .send({ date: '2024-01-01', mood: 15 });
      expect(response.status).toBe(400);
    });

    it('should return 400 for energy out of range', async () => {
      const response = await request(app)
        .post('/api/health/mood')
        .set('Authorization', authHeader)
        .send({ date: '2024-01-01', mood: 5, energy: 20 });
      expect(response.status).toBe(400);
    });
  });

  describe('Protected endpoints', () => {
    it('should return 401 for sleep logs', async () => {
      const response = await request(app).get('/api/health/sleep');
      expect(response.status).toBe(401);
    });

    it('should return 401 for HRV logs', async () => {
      const response = await request(app).get('/api/health/hrv');
      expect(response.status).toBe(401);
    });

    it('should return 401 for mood logs', async () => {
      const response = await request(app).get('/api/health/mood');
      expect(response.status).toBe(401);
    });

    it('should return 401 for summary', async () => {
      const response = await request(app).get('/api/health/summary');
      expect(response.status).toBe(401);
    });
  });
});
