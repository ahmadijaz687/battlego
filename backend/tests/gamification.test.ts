import request from 'supertest';
import gamificationRoutes from '../src/routes/gamification.js';
import { createRouteApp } from './helpers/setup.js';

const { app, authHeader } = createRouteApp(gamificationRoutes, '/api/gamification');

describe('Gamification Routes', () => {
  describe('GET /api/gamification/achievements', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/gamification/achievements');
      expect(response.status).toBe(401);
    });

    it('should return achievements with auth', async () => {
      const response = await request(app)
        .get('/api/gamification/achievements')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/gamification/achievements/mine', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/gamification/achievements/mine');
      expect(response.status).toBe(401);
    });

    it('should return user achievements with auth', async () => {
      const response = await request(app)
        .get('/api/gamification/achievements/mine')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/gamification/achievements/:achievementName/unlock', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/gamification/achievements/first-workout/unlock');
      expect(response.status).toBe(401);
    });

    it('should return 500 (or valid) with auth (requires DB)', async () => {
      const response = await request(app)
        .post('/api/gamification/achievements/first-workout/unlock')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/gamification/level', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/gamification/level');
      expect(response.status).toBe(401);
    });

    it('should return level data with auth', async () => {
      const response = await request(app)
        .get('/api/gamification/level')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('GET /api/gamification/leaderboard', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/gamification/leaderboard');
      expect(response.status).toBe(401);
    });

    it('should return leaderboard with auth', async () => {
      const response = await request(app)
        .get('/api/gamification/leaderboard')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/gamification/seasons/active', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/gamification/seasons/active');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/gamification/battle-pass', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/gamification/battle-pass');
      expect(response.status).toBe(401);
    });

    it('should return battle pass with auth', async () => {
      const response = await request(app)
        .get('/api/gamification/battle-pass')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/gamification/battle-pass/claim', () => {
    it('should return 400 for missing tier', async () => {
      const response = await request(app)
        .post('/api/gamification/battle-pass/claim')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid tier', async () => {
      const response = await request(app)
        .post('/api/gamification/battle-pass/claim')
        .set('Authorization', authHeader)
        .send({ tier: 0 });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/gamification/battle-pass/upgrade', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/gamification/battle-pass/upgrade');
      expect(response.status).toBe(401);
    });
  });
});
