import 'express-async-errors';
import 'dotenv/config';
import * as Sentry from '@sentry/node';
import { validateEnvironment } from './config/validation.js';
import { connectDatabase, disconnectDatabase } from './services/database.js';
import { initSentry } from './config/sentry.js';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.js';
import workoutRoutes from './routes/workout.js';
import nutritionRoutes from './routes/nutrition.js';
import socialRoutes from './routes/social.js';
import aiRoutes from './routes/ai.js';
import battleRoutes from './routes/battle.js';
import profileRoutes from './routes/profile.js';
import gamificationRoutes from './routes/gamification.js';
import habitRoutes from './routes/habits.js';
import healthRoutes from './routes/health.js';
import challengeRoutes from './routes/challenges.js';
import syncRoutes from './sync/syncRoutes.js';
import trainerRoutes from './trainer/trainerRoutes.js';
import usersRoutes from './routes/users.js';
import seasonsRoutes from './routes/seasons.js';
import missionsRoutes from './routes/missions.js';
import economyRoutes from './routes/economy.js';
import searchRoutes from './routes/search.js';
import trendingRoutes from './routes/trending.js';
import systemRoutes from './routes/system.js';
import leaderboardRoutes from './routes/leaderboard.js';
import notificationRoutes from './routes/notifications.js';
import badgesRoutes from './routes/badges.js';
import exerciseRoutes from './routes/exercise.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import analyticsRoutes from './routes/analytics.js';
import uploadRoutes from './routes/upload.js';
import { adminRoutes } from './admin/adminRoutes.js';
import { initializeSocket } from './socket/index.js';
import { successResponse } from './utils/response.js';
import { startAllJobs, stopAllJobs } from './jobs/index.js';
import { connectRedis, disconnectRedis, preloadCommonQueries } from './cache/index.js';
import { startQueueWorker, stopQueueWorker } from './queue/notificationQueue.js';

const app = express();
const server = createServer(app);

initSentry();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  },
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:8081', 'http://localhost:3000'];
if (corsOrigins.includes('*')) {
  throw new Error('CORS_ORIGIN must not be "*" in production. Set explicit origins.');
}
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(morgan('combined'));
app.use(generalLimiter);

const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/workouts`, workoutRoutes);
app.use(`${API_PREFIX}/nutrition`, nutritionRoutes);
app.use(`${API_PREFIX}/social`, socialRoutes);
app.use(`${API_PREFIX}/ai`, aiRoutes);
app.use(`${API_PREFIX}/battles`, battleRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);
app.use(`${API_PREFIX}/gamification`, gamificationRoutes);
app.use(`${API_PREFIX}/habits`, habitRoutes);
app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/challenges`, challengeRoutes);
app.use(`${API_PREFIX}/sync`, syncRoutes);
app.use(`${API_PREFIX}/trainer`, trainerRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/upload`, uploadRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/seasons`, seasonsRoutes);
app.use(`${API_PREFIX}/missions`, missionsRoutes);
app.use(`${API_PREFIX}/economy`, economyRoutes);
app.use(`${API_PREFIX}/search`, searchRoutes);
app.use(`${API_PREFIX}/trending`, trendingRoutes);
app.use(`${API_PREFIX}/system`, systemRoutes);
app.use(`${API_PREFIX}/leaderboards`, leaderboardRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/badges`, badgesRoutes);
app.use(`${API_PREFIX}/exercises`, exerciseRoutes);

Sentry.setupExpressErrorHandler(app);
app.use(globalErrorHandler);

app.get('/health', (_req, res) => {
  res.json(successResponse({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }));
});

app.get('/readiness', async (_req, res) => {
  try {
    const { prisma } = await import('./services/database.js');
    await prisma.$queryRaw`SELECT 1`;
    res.json(successResponse({ status: 'ready' }));
  } catch {
    res.status(503).json({ status: 'error', message: 'Database not ready' });
  }
});

const io = initializeSocket(server);

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    validateEnvironment();
    await connectDatabase();
    await connectRedis();
    await preloadCommonQueries();
    startAllJobs();
    startQueueWorker();
    server.listen(PORT, HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
  }
}

let shuttingDown = false;

const gracefulShutdown = async () => {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info('Shutting down gracefully...');
  stopAllJobs();
  stopQueueWorker();
  io.close();
  server.close(async () => {
    await disconnectDatabase();
    await disconnectRedis();
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

start();
