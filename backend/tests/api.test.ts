import 'express-async-errors';
import request from 'supertest';
import { createTestApp } from './helpers/setup.js';
import { prisma } from '../src/services/database.js';
import jwt from 'jsonwebtoken';

const app = createTestApp();

describe('API Integration: Full User Journey', () => {
  let authToken: string;

  describe('Health check', () => {
    it('GET /health should return ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('ok');
    });
  });

  describe('Auth flow', () => {
    it('POST /api/v1/auth/register should validate input', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'invalid', password: 'short', name: 'A' });
      expect(response.status).toBe(400);
    });

    it('POST /api/v1/auth/login should return 401 for wrong password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'WrongPass1' });
      expect(response.status).toBe(401);
    });
  });

  describe('Protected routes', () => {
    beforeAll(() => {
      authToken = jwt.sign(
        { id: 'test-user-id', email: 'test@example.com' },
        process.env.JWT_SECRET || 'test-secret-key-for-testing-purposes-only'
      );
    });

    it('GET /api/v1/profile should require auth', async () => {
      const response = await request(app).get('/api/v1/profile');
      expect(response.status).toBe(401);
    });

    it('GET /api/v1/profile should return profile with valid auth', async () => {
      const response = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
    });

    it('GET /api/v1/profile/settings should return settings', async () => {
      const response = await request(app)
        .get('/api/v1/profile/settings')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
    });
  });

  describe('Workout flow', () => {
    beforeAll(() => {
      authToken = jwt.sign(
        { id: 'test-user-id', email: 'test@example.com' },
        process.env.JWT_SECRET || 'test-secret-key-for-testing-purposes-only'
      );
    });

    it('GET /api/v1/workouts/exercises should be accessible', async () => {
      const response = await request(app).get('/api/v1/workouts/exercises');
      expect(response.status).toBe(200);
    });

    it('POST /api/v1/workouts should create workout', async () => {
      const response = await request(app)
        .post('/api/v1/workouts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Integration Workout', type: 'strength', difficulty: 'beginner', duration: 30 });
      expect(response.status).toBe(201);
    });
  });

  describe('Nutrition flow', () => {
    beforeEach(() => {
      authToken = jwt.sign(
        { id: 'test-user-id', email: 'test@example.com' },
        process.env.JWT_SECRET || 'test-secret-key-for-testing-purposes-only'
      );
    });

    it('GET /api/v1/nutrition/foods should return array', async () => {
      const response = await request(app).get('/api/v1/nutrition/foods');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('POST /api/v1/nutrition/foods should create food', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition/foods')
        .send({ name: 'Test Food', calories: 100, protein: 10, carbs: 10, fat: 2, servingSize: '100g' });
      expect(response.status).toBe(201);
    });
  });

  describe('Social flow', () => {
    beforeEach(() => {
      authToken = jwt.sign(
        { id: 'test-user-id', email: 'test@example.com' },
        process.env.JWT_SECRET || 'test-secret-key-for-testing-purposes-only'
      );
    });

    it('GET /api/v1/social/stories should be accessible', async () => {
      const response = await request(app).get('/api/v1/social/stories');
      expect(response.status).toBe(200);
    });

    it('GET /api/v1/social/communities should be accessible', async () => {
      const response = await request(app).get('/api/v1/social/communities');
      expect(response.status).toBe(200);
    });

    it('POST /api/v1/social/posts should create post', async () => {
      const response = await request(app)
        .post('/api/v1/social/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Integration test post', type: 'general', userName: 'Tester' });
      expect(response.status).toBe(201);
    });
  });

  describe('Battle flow', () => {
    beforeEach(() => {
      authToken = jwt.sign(
        { id: 'test-user-id', email: 'test@example.com' },
        process.env.JWT_SECRET || 'test-secret-key-for-testing-purposes-only'
      );
    });

    it('POST /api/v1/battles should validate', async () => {
      const response = await request(app)
        .post('/api/v1/battles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'strength', opponentId: '00000000-0000-0000-0000-000000000000' });
      expect(response.status).toBe(500);
    });

    it('GET /api/v1/battles/leaderboard should be protected', async () => {
      const response = await request(app).get('/api/v1/battles/leaderboard');
      expect(response.status).toBe(401);
    });
  });

  describe('Gamification flow', () => {
    beforeEach(() => {
      authToken = jwt.sign(
        { id: 'test-user-id', email: 'test@example.com' },
        process.env.JWT_SECRET || 'test-secret-key-for-testing-purposes-only'
      );
    });

    it('GET /api/v1/gamification/achievements should be protected', async () => {
      const response = await request(app).get('/api/v1/gamification/achievements');
      expect(response.status).toBe(401);
    });

    it('GET /api/v1/gamification/level should return with auth', async () => {
      const response = await request(app)
        .get('/api/v1/gamification/level')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
    });
  });

  describe('Error handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/v1/nonexistent');
      expect(response.status).toBe(404);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send('not-json');
      expect(response.status).toBe(400);
    });
  });
});
