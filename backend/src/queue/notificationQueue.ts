import { isRedisAvailable, getRedisClient } from '../cache/RedisClient.js';
import { appQueue } from './Queue.js';
import { logger } from '../utils/logger.js';

export interface NotificationJob {
  type: 'push' | 'email' | 'in_app';
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  priority?: 'high' | 'normal' | 'low';
}

const QUEUE_KEY = 'queue:notifications';

export async function enqueueNotification(job: NotificationJob): Promise<void> {
  if (isRedisAvailable()) {
    const redis = await getRedisClient();
    if (redis) {
      await redis.lpush(QUEUE_KEY, JSON.stringify(job));
      return;
    }
  }
  // Fallback to in-memory queue. The handler is registered as 'push_notification'
  // so the worker can process it once activated.
  appQueue.enqueue('push_notification', job);
}

export async function dequeueNotification(): Promise<NotificationJob | null> {
  if (isRedisAvailable()) {
    const redis = await getRedisClient();
    if (redis) {
      const raw = await redis.rpop(QUEUE_KEY);
      return raw ? (JSON.parse(raw) as NotificationJob) : null;
    }
  }
  return null;
}

export async function getQueueLength(): Promise<number> {
  if (isRedisAvailable()) {
    const redis = await getRedisClient();
    if (redis) {
      return redis.llen(QUEUE_KEY);
    }
  }
  return appQueue.getQueueLength();
}

let redisWorkerTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Starts the background worker that drains the Redis-backed notification queue
 * and dispatches each job to the in-memory queue handler ('push_notification').
 * This is the activation step that makes the queue actually process work.
 */
export function startQueueWorker(pollMs = 1000): void {
  if (redisWorkerTimer) return;
  redisWorkerTimer = setInterval(async () => {
    try {
      if (!isRedisAvailable()) return;
      const job = await dequeueNotification();
      if (job) {
        appQueue.enqueue('push_notification', job);
      }
    } catch (error) {
      logger.error('Queue worker poll failed', error instanceof Error ? error : new Error(String(error)));
    }
  }, pollMs);
  // Do not keep the event loop alive solely for the worker.
  if (typeof redisWorkerTimer.unref === 'function') {
    redisWorkerTimer.unref();
  }
  logger.info('[Queue] Notification worker started');
}

export function stopQueueWorker(): void {
  if (redisWorkerTimer) {
    clearInterval(redisWorkerTimer);
    redisWorkerTimer = null;
    logger.info('[Queue] Notification worker stopped');
  }
}