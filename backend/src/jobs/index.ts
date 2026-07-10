import cron, { ScheduledTask } from 'node-cron';
import { prisma } from '../services/database.js';
import { logger } from '../utils/logger.js';
import { registerAllJobs } from '../queue/jobs/index.js';
import { stopAnalyticsJob } from '../queue/jobs/analyticsJob.js';
import { stopQueueWorker } from '../queue/notificationQueue.js';

const scheduledTasks: ScheduledTask[] = [];

function scheduleStoryCleanup(): ScheduledTask {
  return cron.schedule('*/15 * * * *', async () => {
    try {
      const result = await prisma.story.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      if (result.count > 0) {
        logger.info(`[Cleanup] Removed ${result.count} expired stories`);
      }
    } catch (error) {
      logger.error('[Cleanup] Story cleanup failed', error instanceof Error ? error : new Error(String(error)));
    }
  });
}

function scheduleNotificationCleanup(): ScheduledTask {
  return cron.schedule('0 3 * * *', async () => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const result = await prisma.notification.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
      });
      if (result.count > 0) {
        logger.info(`[Cleanup] Removed ${result.count} old notifications`);
      }
    } catch (error) {
      logger.error('[Cleanup] Notification cleanup failed', error instanceof Error ? error : new Error(String(error)));
    }
  });
}

function scheduleTokenCleanup(): ScheduledTask {
  return cron.schedule('0 * * * *', async () => {
    try {
      const result = await prisma.refreshToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      if (result.count > 0) {
        logger.info(`[Cleanup] Removed ${result.count} expired refresh tokens`);
      }
    } catch (error) {
      logger.error('[Cleanup] Token cleanup failed', error instanceof Error ? error : new Error(String(error)));
    }
  });
}

function scheduleAnalyticsSnapshot(): ScheduledTask {
  return cron.schedule('0 2 * * *', async () => {
    try {
      const userCount = await prisma.user.count();
      const totalWorkouts = await prisma.workout.count({ where: { completedAt: { not: null } } });
      const totalMeals = await prisma.meal.count();
      const totalMessages = await prisma.message.count();
      const totalBattles = await prisma.battle.count();
      const totalPosts = await prisma.post.count();
      logger.info('[Analytics] Daily snapshot', {
        users: userCount, workouts: totalWorkouts, meals: totalMeals,
        messages: totalMessages, battles: totalBattles, posts: totalPosts,
      });
    } catch (error) {
      logger.error('[Analytics] Snapshot failed', error instanceof Error ? error : new Error(String(error)));
    }
  });
}

export function startAllJobs(): void {
  registerAllJobs();
  scheduledTasks.push(scheduleStoryCleanup());
  scheduledTasks.push(scheduleNotificationCleanup());
  scheduledTasks.push(scheduleTokenCleanup());
  scheduledTasks.push(scheduleAnalyticsSnapshot());
  logger.info('[Jobs] All scheduled jobs started');
}

/**
 * Stops all scheduled cron tasks and queue workers, and flushes pending
 * analytics events. Call this from the graceful shutdown path to avoid
 * open handles keeping the process alive.
 */
export function stopAllJobs(): void {
  for (const task of scheduledTasks) {
    task.stop();
  }
  scheduledTasks.length = 0;
  stopAnalyticsJob();
  stopQueueWorker();
  logger.info('[Jobs] All scheduled jobs stopped');
}