import request from 'supertest';
import aiRoutes from '../src/routes/ai.js';
import { createRouteApp } from './helpers/setup.js';

const { app, authHeader } = createRouteApp(aiRoutes, '/api/ai');

describe('AI Routes', () => {
  describe('POST /api/ai/chat', () => {
    it('should return 500 when DB is unavailable (chat needs DB)', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', authHeader)
        .send({ conversationId: 'test-conv', content: 'hello' });
      expect(response.status).toBe(500);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/ai/workout', () => {
    it('should return 201 with default workout generation', async () => {
      const response = await request(app)
        .post('/api/ai/workout')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(201);
    });
  });

  describe('POST /api/ai/nutrition', () => {
    it('should return nutrition plan with correct response shape', async () => {
      const response = await request(app)
        .post('/api/ai/nutrition')
        .set('Authorization', authHeader)
        .send({ calories: 2000 });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('dailyCalories', 2000);
      expect(response.body.data).toHaveProperty('macros');
      expect(response.body.data).toHaveProperty('meals');
    });

    it('should return 400 for invalid calories', async () => {
      const response = await request(app)
        .post('/api/ai/nutrition')
        .set('Authorization', authHeader)
        .send({ calories: -1 });
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/ai/personalities', () => {
    it('should return list of coach personalities', async () => {
      const response = await request(app)
        .get('/api/ai/personalities')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
    });
  });

  describe('GET /api/ai/proactive', () => {
    it('should return proactive suggestion (or null data) gracefully', async () => {
      const response = await request(app)
        .get('/api/ai/proactive')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('POST /api/ai/recovery', () => {
    it('should return recovery analysis with score', async () => {
      const response = await request(app)
        .post('/api/ai/recovery')
        .set('Authorization', authHeader)
        .send({ sleepHours: 7, stressLevel: 3 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('score');
      expect(response.body.data).toHaveProperty('recommendations');
    });
  });

  describe('POST /api/ai/replacement', () => {
    it('should return replacement exercises even without DB', async () => {
      const response = await request(app)
        .post('/api/ai/replacement')
        .set('Authorization', authHeader)
        .send({ exerciseId: 'test-id' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/ai/overload', () => {
    it('should return progressive overload calculation', async () => {
      const response = await request(app)
        .post('/api/ai/overload')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('nextWeight');
      expect(response.body.data).toHaveProperty('nextReps');
      expect(response.body.data).toHaveProperty('suggestion');
    });
  });

  describe('Unauthenticated access', () => {
    it('should return 401 for all endpoints without token', async () => {
      const endpoints = [
        { method: 'post' as const, path: '/api/ai/chat', body: { conversationId: '1', content: 'hi' } },
        { method: 'post' as const, path: '/api/ai/workout', body: {} },
        { method: 'post' as const, path: '/api/ai/nutrition', body: { calories: 2000 } },
        { method: 'get' as const, path: '/api/ai/personalities' },
        { method: 'get' as const, path: '/api/ai/proactive' },
        { method: 'post' as const, path: '/api/ai/recovery', body: {} },
        { method: 'post' as const, path: '/api/ai/replacement', body: {} },
        { method: 'post' as const, path: '/api/ai/overload', body: {} },
      ];
      for (const ep of endpoints) {
        let req = request(app)[ep.method](ep.path);
        if ('body' in ep && ep.body) req = req.send(ep.body);
        const response = await req;
        expect(response.status).toBe(401);
      }
    });
  });
});
