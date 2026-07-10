import request from 'supertest';
import challengeRoutes from '../src/routes/challenges.js';
import { createRouteApp } from './helpers/setup.js';

const { app, authHeader } = createRouteApp(challengeRoutes, '/api/challenges');

describe('Challenge Routes', () => {
  describe('GET /api/challenges', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/challenges');
      expect(response.status).toBe(401);
    });

    it('should return list with auth', async () => {
      const response = await request(app)
        .get('/api/challenges')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/challenges (create challenge)', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/challenges')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app)
        .post('/api/challenges')
        .set('Authorization', authHeader)
        .send({
          description: 'A test challenge',
          type: 'steps',
          goal: { steps: 10000 },
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        });
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing description', async () => {
      const response = await request(app)
        .post('/api/challenges')
        .set('Authorization', authHeader)
        .send({
          name: 'Test Challenge',
          type: 'steps',
          goal: { steps: 10000 },
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        });
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing dates', async () => {
      const response = await request(app)
        .post('/api/challenges')
        .set('Authorization', authHeader)
        .send({
          name: 'Test Challenge',
          description: 'A test',
          type: 'steps',
          goal: { steps: 10000 },
        });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/challenges/:challengeId/join', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/challenges/challenge-1/join');
      expect(response.status).toBe(401);
    });

    it('should return 500 (or valid) with auth (requires DB)', async () => {
      const response = await request(app)
        .post('/api/challenges/challenge-1/join')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/challenges/active', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/challenges/active');
      expect(response.status).toBe(401);
    });

    it('should return active challenges with auth', async () => {
      const response = await request(app)
        .get('/api/challenges/active')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/challenges/mine', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/challenges/mine');
      expect(response.status).toBe(401);
    });

    it('should return my challenges with auth', async () => {
      const response = await request(app)
        .get('/api/challenges/mine')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/challenges/:challengeId/leaderboard', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/challenges/challenge-1/leaderboard');
      expect(response.status).toBe(401);
    });

    it('should return leaderboard with auth', async () => {
      const response = await request(app)
        .get('/api/challenges/challenge-1/leaderboard')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/challenges/:challengeId', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/challenges/challenge-1');
      expect(response.status).toBe(401);
    });
  });
});
