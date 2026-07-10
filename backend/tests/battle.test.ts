import request from 'supertest';
import battleRoutes from '../src/routes/battle.js';
import { createRouteApp } from './helpers/setup.js';

const { app, authHeader } = createRouteApp(battleRoutes, '/api/battles');

describe('Battle Routes', () => {
  describe('GET /api/battles', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/battles');
      expect(response.status).toBe(401);
    });

    it('should return list (or 500 gracefully) with auth', async () => {
      const response = await request(app)
        .get('/api/battles')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/battles (create battle)', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/battles')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing opponentId', async () => {
      const response = await request(app)
        .post('/api/battles')
        .set('Authorization', authHeader)
        .send({ type: 'strength' });
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid opponentId', async () => {
      const response = await request(app)
        .post('/api/battles')
        .set('Authorization', authHeader)
        .send({ type: 'strength', opponentId: 'not-a-uuid' });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/battles/:battleId/accept', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/battles/battle-1/accept');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/battles/:battleId/start', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/battles/battle-1/start');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/battles/:battleId/score (update score)', () => {
    it('should return 400 for negative score', async () => {
      const response = await request(app)
        .post('/api/battles/battle-1/score')
        .set('Authorization', authHeader)
        .send({ score: -1 });
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing score', async () => {
      const response = await request(app)
        .post('/api/battles/battle-1/score')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/battles/:battleId/complete', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/battles/battle-1/complete');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/battles/leaderboard', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/battles/leaderboard');
      expect(response.status).toBe(401);
    });

    it('should return leaderboard with auth', async () => {
      const response = await request(app)
        .get('/api/battles/leaderboard')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });
});
