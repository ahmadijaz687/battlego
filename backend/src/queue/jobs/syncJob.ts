import { appQueue } from '../Queue.js';
import { prisma } from '../../services/database.js';
import { logger } from '../../utils/logger.js';

interface SyncData {
  userId: string;
  operations: Array<{
    type: 'create' | 'update' | 'delete';
    entity: string;
    data: Record<string, unknown>;
    clientTimestamp: string;
  }>;
}

export function registerSyncJob(): void {
  appQueue.registerHandler('offline_sync', async (data: unknown) => {
    const syncPayload = data as SyncData;
    try {
      for (const op of syncPayload.operations) {
        switch (op.entity) {
          case 'workout': {
            if (op.type === 'create') {
              await prisma.workout.create({
                data: op.data as never,
              });
            }
            break;
          }
          case 'meal': {
            if (op.type === 'create') {
              await prisma.meal.create({
                data: op.data as never,
              });
            }
            break;
          }
          case 'habit': {
            if (op.type === 'create' || op.type === 'update') {
              const habitData = op.data as { id?: string };
              if (habitData.id) {
                await prisma.habit.upsert({
                  where: { id: habitData.id },
                  update: op.data as never,
                  create: op.data as never,
                });
              }
            }
            break;
          }
          default:
            logger.warn(`Sync: unknown entity ${op.entity}`);
        }
      }
      logger.info(`Sync: synced ${syncPayload.operations.length} operations for user ${syncPayload.userId}`);
    } catch (error) {
      logger.error(`Sync failed for user ${syncPayload.userId}`, error instanceof Error ? error : new Error(String(error)));
    }
  });
}
