import request from 'supertest';
import authRoutes from '../src/routes/auth.js';
import { createRouteApp } from './helpers/setup.js';

const { app, authHeader } = createRouteApp(authRoutes, '/api/auth');

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid', password: 'StrongPass1', name: 'Test' });
      expect(response.status).toBe(400);
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'short', name: 'Test' });
      expect(response.status).toBe(400);
    });

    it('should return 409 when email already exists', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'StrongPass1', name: 'Test User' });
      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-email', password: 'password123' });
      expect([400, 429]).toContain(response.status);
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpass' });
      expect([401, 429]).toContain(response.status);
    });

    it('should return 401 for nonexistent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'SomePass1' });
      expect([401, 429]).toContain(response.status);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should return 400 for missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});
      expect([400, 429]).toContain(response.status);
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });
      expect([401, 429]).toContain(response.status);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return 200 for logout', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });

    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/auth/logout');
      expect(response.status).toBe(401);
    });
  });
});
