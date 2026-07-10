import request from 'supertest';
import nutritionRoutes from '../src/routes/nutrition.js';
import { createRouteApp } from './helpers/setup.js';

const { app, authHeader } = createRouteApp(nutritionRoutes, '/api/nutrition');

describe('Nutrition Routes', () => {
  describe('GET /api/nutrition/foods', () => {
    it('should return foods array', async () => {
      const response = await request(app).get('/api/nutrition/foods');
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/nutrition/foods (create food)', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/nutrition/foods')
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid calories', async () => {
      const response = await request(app)
        .post('/api/nutrition/foods')
        .send({ name: 'Test Food', calories: -100, protein: 10, carbs: 20, fat: 5, servingSize: '100g' });
      expect(response.status).toBe(400);
    });

    it('should create food with valid data', async () => {
      const response = await request(app)
        .post('/api/nutrition/foods')
        .send({ name: 'E2E Test Food', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100g' });
      expect(response.status).toBe(201);
    });
  });

  describe('Protected routes without auth', () => {
    it('should return 401 for meals', async () => {
      const response = await request(app).get('/api/nutrition/meals');
      expect(response.status).toBe(401);
    });

    it('should return 401 for water logs', async () => {
      const response = await request(app).get('/api/nutrition/water/logs');
      expect(response.status).toBe(401);
    });

    it('should return 401 for weight logs', async () => {
      const response = await request(app).get('/api/nutrition/weight/logs');
      expect(response.status).toBe(401);
    });

    it('should return 401 for measurements', async () => {
      const response = await request(app).get('/api/nutrition/measurements');
      expect(response.status).toBe(401);
    });

    it('should return 401 for shopping list', async () => {
      const response = await request(app).get('/api/nutrition/shopping-list');
      expect(response.status).toBe(401);
    });

    it('should return 401 for analytics', async () => {
      const response = await request(app).get('/api/nutrition/analytics');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/nutrition/meals (create meal)', () => {
    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/nutrition/meals')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for empty foods array', async () => {
      const response = await request(app)
        .post('/api/nutrition/meals')
        .set('Authorization', authHeader)
        .send({ name: 'Test Meal', foods: [] });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/nutrition/water/logs (log water)', () => {
    it('should return 400 for negative amount', async () => {
      const response = await request(app)
        .post('/api/nutrition/water/logs')
        .set('Authorization', authHeader)
        .send({ amount: -100 });
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing amount', async () => {
      const response = await request(app)
        .post('/api/nutrition/water/logs')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/nutrition/weight/logs (log weight)', () => {
    it('should return 400 for missing date', async () => {
      const response = await request(app)
        .post('/api/nutrition/weight/logs')
        .set('Authorization', authHeader)
        .send({ weight: 75, unit: 'kg' });
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid weight', async () => {
      const response = await request(app)
        .post('/api/nutrition/weight/logs')
        .set('Authorization', authHeader)
        .send({ date: '2024-01-01', weight: -10, unit: 'kg' });
      expect(response.status).toBe(400);
    });
  });
});
