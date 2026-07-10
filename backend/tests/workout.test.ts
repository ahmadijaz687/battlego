import request from 'supertest';
import workoutRoutes from '../src/routes/workout.js';
import { createRouteApp } from './helpers/setup.js';

const { app, authHeader } = createRouteApp(workoutRoutes, '/api/workouts');

describe('Workout Routes', () => {
  describe('GET /api/workouts/exercises', () => {
    it('should return exercises (or 500 gracefully if no DB)', async () => {
      const response = await request(app).get('/api/workouts/exercises');
      expect(response.status).toBe(200);
    });
  });

  describe('Protected routes without auth', () => {
    it('should return 401 for history', async () => {
      const response = await request(app).get('/api/workouts/history');
      expect(response.status).toBe(401);
    });

    it('should return 401 for records', async () => {
      const response = await request(app).get('/api/workouts/records');
      expect(response.status).toBe(401);
    });

    it('should return 401 for analytics', async () => {
      const response = await request(app).get('/api/workouts/analytics');
      expect(response.status).toBe(401);
    });

    it('should return 401 for create workout', async () => {
      const response = await request(app)
        .post('/api/workouts')
        .send({ name: 'Test', type: 'strength', difficulty: 'beginner', duration: 30 });
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/workouts (create)', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid type', async () => {
      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', authHeader)
        .send({ name: 'Test', type: 'invalid', difficulty: 'beginner', duration: 30 });
      expect(response.status).toBe(400);
    });

    it('should return 400 for negative duration', async () => {
      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', authHeader)
        .send({ name: 'Test', type: 'strength', difficulty: 'beginner', duration: -10 });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/workouts/:workoutId/complete', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/workouts/123/complete');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/workouts/templates', () => {
    it('should return templates (or 500 gracefully)', async () => {
      const response = await request(app).get('/api/workouts/templates');
      expect(response.status).toBe(200);
    });
  });
});
