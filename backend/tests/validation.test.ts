import { validate, loginSchema, registerSchema, createWorkoutSchema } from '../src/middlewares/validation.js';
import express from 'express';
import request from 'supertest';

function makeApp(schema: Parameters<typeof validate>[0], source: Parameters<typeof validate>[1] = 'body') {
  const app = express();
  app.use(express.json());
  app.post('/test', validate(schema, source), (_req, res) => {
    res.json({ success: true, data: _req.body });
  });
  return app;
}

describe('Validation Middleware', () => {
  describe('loginSchema', () => {
    const app = makeApp(loginSchema);

    it('should pass valid login data', async () => {
      const response = await request(app)
        .post('/test')
        .send({ email: 'test@example.com', password: '123456' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/test')
        .send({ email: 'not-an-email', password: '123456' });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors!.length).toBeGreaterThan(0);
    });

    it('should return 400 for short password', async () => {
      const response = await request(app)
        .post('/test')
        .send({ email: 'test@example.com', password: '123' });
      expect(response.status).toBe(400);
    });

    it('should return 400 for empty body', async () => {
      const response = await request(app)
        .post('/test')
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('registerSchema', () => {
    const app = makeApp(registerSchema);

    it('should pass valid registration data', async () => {
      const response = await request(app)
        .post('/test')
        .send({ email: 'new@example.com', password: 'StrongPass1', name: 'Test User' });
      expect(response.status).toBe(200);
    });

    it('should return 400 for weak password (no uppercase)', async () => {
      const response = await request(app)
        .post('/test')
        .send({ email: 'new@example.com', password: 'weakpass1', name: 'Test' });
      expect(response.status).toBe(400);
      expect(response.body.errors!.some((e: string) => e.includes('uppercase'))).toBe(true);
    });

    it('should return 400 for weak password (no number)', async () => {
      const response = await request(app)
        .post('/test')
        .send({ email: 'new@example.com', password: 'WeakPass', name: 'Test' });
      expect(response.status).toBe(400);
      expect(response.body.errors!.some((e: string) => e.includes('number'))).toBe(true);
    });

    it('should return 400 for short name', async () => {
      const response = await request(app)
        .post('/test')
        .send({ email: 'new@example.com', password: 'StrongPass1', name: 'A' });
      expect(response.status).toBe(400);
    });
  });

  describe('createWorkoutSchema', () => {
    const app = makeApp(createWorkoutSchema);

    it('should pass valid workout data', async () => {
      const response = await request(app)
        .post('/test')
        .send({ name: 'Test Workout', type: 'strength', difficulty: 'beginner', duration: 30 });
      expect(response.status).toBe(200);
    });

    it('should return 400 for invalid type', async () => {
      const response = await request(app)
        .post('/test')
        .send({ name: 'Test', type: 'extreme', difficulty: 'beginner', duration: 30 });
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/test')
        .send({ name: 'Test' });
      expect(response.status).toBe(400);
    });

    it('should return 400 for negative duration', async () => {
      const response = await request(app)
        .post('/test')
        .send({ name: 'Test', type: 'strength', difficulty: 'beginner', duration: -10 });
      expect(response.status).toBe(400);
    });
  });

  describe('Query parameter validation', () => {
    const querySchema = loginSchema.pick({ email: true });
    const app = makeApp(querySchema, 'query');

    it('should validate query parameters', async () => {
      const response = await request(app)
        .post('/test?email=test@example.com');
      expect(response.status).toBe(200);
    });

    it('should fail for invalid query parameters', async () => {
      const response = await request(app)
        .post('/test?email=invalid');
      expect(response.status).toBe(400);
    });
  });
});
