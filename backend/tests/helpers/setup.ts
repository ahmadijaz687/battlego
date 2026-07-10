import 'express-async-errors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../src/services/database.js';
import authRoutes from '../../src/routes/auth.js';
import workoutRoutes from '../../src/routes/workout.js';
import nutritionRoutes from '../../src/routes/nutrition.js';
import socialRoutes from '../../src/routes/social.js';
import aiRoutes from '../../src/routes/ai.js';
import battleRoutes from '../../src/routes/battle.js';
import profileRoutes from '../../src/routes/profile.js';
import healthRoutes from '../../src/routes/health.js';
import habitRoutes from '../../src/routes/habits.js';
import gamificationRoutes from '../../src/routes/gamification.js';
import challengeRoutes from '../../src/routes/challenges.js';
import { globalErrorHandler } from '../../src/middlewares/errorHandler.js';
import { seedTestFixtures } from './testData.js';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing-purposes-only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'test-refresh-secret';

let server: import('http').Server | null = null;

export function createTestApp() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const API_PREFIX = '/api/v1';

  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/workouts`, workoutRoutes);
  app.use(`${API_PREFIX}/nutrition`, nutritionRoutes);
  app.use(`${API_PREFIX}/social`, socialRoutes);
  app.use(`${API_PREFIX}/ai`, aiRoutes);
  app.use(`${API_PREFIX}/battles`, battleRoutes);
  app.use(`${API_PREFIX}/profile`, profileRoutes);
  app.use(`${API_PREFIX}/health`, healthRoutes);
  app.use(`${API_PREFIX}/habits`, habitRoutes);
  app.use(`${API_PREFIX}/gamification`, gamificationRoutes);
  app.use(`${API_PREFIX}/challenges`, challengeRoutes);

  app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Success', data: { status: 'ok' } });
  });

  app.use(globalErrorHandler);

  return app;
}

export function createRouteApp(
  route: express.Router,
  pathPrefix: string,
  options: { userId?: string; email?: string } = {},
): { app: express.Application; authHeader: string; token: string } {
  const userId = options.userId || 'test-user-id';
  const email = options.email || 'test@example.com';

  const app = express();
  app.use(express.json());
  app.use(pathPrefix, route);
  app.use(globalErrorHandler);

  const token = createMockToken(userId, email);
  const authHeader = 'Bearer ' + token;

  return { app, authHeader, token };
}

export function createMockToken(userId = 'test-user-id', email = 'test@example.com'): string {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function createExpiredToken(userId = 'test-user-id', email = 'test@example.com'): string {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '0s' });
}

export function createRefreshToken(userId = 'test-user-id'): string {
  return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function createAuthHeader(userId?: string, email?: string): { Authorization: string } {
  return { Authorization: `Bearer ${createMockToken(userId, email)}` };
}

export function createTestUser(overrides: Partial<{ id: string; email: string; name: string }> = {}) {
  return {
    id: overrides.id || 'test-user-id',
    email: overrides.email || 'test@example.com',
    name: overrides.name || 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function startTestServer(app: express.Application) {
  return new Promise<import('http').Server>((resolve) => {
    server = app.listen(0, () => resolve(server!));
  });
}

export async function stopTestServer() {
  if (server) {
    return new Promise<void>((resolve) => {
      server!.close(() => {
        server = null;
        resolve();
      });
    });
  }
}

beforeAll(async () => {
  process.env.JWT_SECRET = JWT_SECRET;
  process.env.REFRESH_SECRET = REFRESH_SECRET;
  await prisma.$connect();
  await seedTestFixtures();
}, 30000);

afterAll(async () => {
  await stopTestServer();
  await prisma.$disconnect();
});
