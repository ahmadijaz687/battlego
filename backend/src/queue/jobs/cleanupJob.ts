import { appQueue } from '../Queue.js';
import { prisma } from '../../services/database.js';
import { logger } from '../../utils/logger.js';

export function registerCleanupJob(): void {
  appQueue.registerHandler('cleanup_task', async (data: unknown) => {
    const task = data as { type: string; olderThanDays?: number };
    const days = task.olderThanDays ?? 30;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    try {
      switch (task.type) {
        case 'notifications': {
          const result = await prisma.notification.deleteMany({
            where: { createdAt: { lt: cutoff } },
          });
          logger.info(`Cleanup: removed ${result.count} old notifications`);
          break;
        }
        case 'refresh_tokens': {
          const result = await prisma.refreshToken.deleteMany({
            where: { expiresAt: { lt: new Date() } },
          });
          logger.info(`Cleanup: removed ${result.count} expired refresh tokens`);
          break;
        }
        case 'stories': {
          const result = await prisma.story.deleteMany({
            where: { expiresAt: { lt: new Date() } },
          });
          logger.info(`Cleanup: removed ${result.count} expired stories`);
          break;
        }
        default:
          logger.warn(`Cleanup: unknown task type ${task.type}`);
      }
    } catch (error) {
      logger.error(`Cleanup failed for task ${task.type}`, error instanceof Error ? error : new Error(String(error)));
    }
  });
}
