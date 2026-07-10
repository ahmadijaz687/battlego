import request from 'supertest';
import habitRoutes from '../src/routes/habits.js';
import { createRouteApp } from './helpers/setup.js';

const { app, authHeader } = createRouteApp(habitRoutes, '/api/habits');

describe('Habit Routes', () => {
  describe('GET /api/habits', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/habits');
      expect(response.status).toBe(401);
    });

    it('should return list with auth', async () => {
      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/habits/active', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/habits/active');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/habits/stats', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/habits/stats');
      expect(response.status).toBe(401);
    });

    it('should return stats with auth', async () => {
      const response = await request(app)
        .get('/api/habits/stats')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/habits (create habit)', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', authHeader)
        .send({ category: 'health', frequency: 'daily' });
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid frequency', async () => {
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', authHeader)
        .send({ name: 'Drink Water', category: 'health', frequency: 'yearly' });
      expect(response.status).toBe(400);
    });

    it('should return 400 for negative target', async () => {
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', authHeader)
        .send({ name: 'Drink Water', category: 'health', frequency: 'daily', target: -1 });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/habits/:habitId/log', () => {
    it('should return 400 for missing date', async () => {
      const response = await request(app)
        .post('/api/habits/habit-1/log')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for negative value', async () => {
      const response = await request(app)
        .post('/api/habits/habit-1/log')
        .set('Authorization', authHeader)
        .send({ date: '2024-01-01', value: -1 });
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/habits/:habitId', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .put('/api/habits/habit-1')
        .send({ name: 'Updated' });
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/habits/:habitId', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).delete('/api/habits/habit-1');
      expect(response.status).toBe(401);
    });
  });
});
