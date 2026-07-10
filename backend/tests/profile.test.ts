import request from 'supertest';
import profileRoutes from '../src/routes/profile.js';
import { createRouteApp } from './helpers/setup.js';

const { app, authHeader } = createRouteApp(profileRoutes, '/api/profile');

describe('Profile Routes', () => {
  describe('GET /api/profile', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/profile');
      expect(response.status).toBe(401);
    });

    it('should return profile with auth', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/profile (update profile)', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .put('/api/profile')
        .send({ name: 'New Name' });
      expect(response.status).toBe(401);
    });

    it('should return 400 for short name', async () => {
      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', authHeader)
        .send({ name: 'A' });
      expect(response.status).toBe(400);
    });

    it('should return 200 for valid update', async () => {
      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', authHeader)
        .send({ name: 'Updated Name' });
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/profile/settings', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/profile/settings');
      expect(response.status).toBe(401);
    });

    it('should return settings with auth', async () => {
      const response = await request(app)
        .get('/api/profile/settings')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/profile/settings (update settings)', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .put('/api/profile/settings')
        .send({ theme: 'dark' });
      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid theme', async () => {
      const response = await request(app)
        .put('/api/profile/settings')
        .set('Authorization', authHeader)
        .send({ theme: 'neon' });
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid units', async () => {
      const response = await request(app)
        .put('/api/profile/settings')
        .set('Authorization', authHeader)
        .send({ units: 'parsec' });
      expect(response.status).toBe(400);
    });

    it('should return 200 for valid settings update', async () => {
      const response = await request(app)
        .put('/api/profile/settings')
        .set('Authorization', authHeader)
        .send({ theme: 'dark', units: 'metric' });
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/profile/details', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/profile/details');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/profile/onboarding/status', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/profile/onboarding/status');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/profile/onboarding', () => {
    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/profile/onboarding')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid experience level', async () => {
      const response = await request(app)
        .post('/api/profile/onboarding')
        .set('Authorization', authHeader)
        .send({
          goal: 'Get fit',
          experience: 'expert',
          fitnessLevel: 'beginner',
          activityLevel: 'moderate',
        });
      expect(response.status).toBe(400);
    });
  });
});
