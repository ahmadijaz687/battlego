import { Redis } from 'ioredis';
import { appCache } from './Cache.js';
import { logger } from '../utils/logger.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redis: InstanceType<typeof Redis> | null = null;
let redisAvailable = false;

export async function connectRedis(): Promise<void> {
  if (redis) return;
  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });
    // Prevent unhandled "error" events from crashing the process when Redis
    // is unavailable; connection failures are already handled by the catch below.
    redis.on('error', (err) => {
      logger.warn('Redis client error', { error: err.message });
    });
    await redis.connect();
    redisAvailable = true;
    logger.info('Redis connected');
  } catch (error) {
    redisAvailable = false;
    logger.warn('Redis unavailable, using in-memory cache', { error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    redisAvailable = false;
  }
}

export function isRedisAvailable(): boolean {
  return redisAvailable;
}

export async function getRedisClient(): Promise<Redis | null> {
  if (!redisAvailable) return null;
  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (redisAvailable && redis) {
    const raw = await redis.get(key);
    if (raw) return JSON.parse(raw) as T;
  }
  return appCache.get<T>(key);
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  if (redisAvailable && redis) {
    const serialized = JSON.stringify(value);
    if (ttlSeconds > 0) {
      await redis.setex(key, ttlSeconds, serialized);
    } else {
      await redis.set(key, serialized);
    }
  }
  await appCache.set(key, value, { ttl: ttlSeconds * 1000 });
}

export async function cacheDelete(key: string): Promise<void> {
  if (redisAvailable && redis) {
    await redis.del(key);
  }
  await appCache.delete(key);
}

export async function cacheFlush(): Promise<void> {
  if (redisAvailable && redis) {
    await redis.flushdb();
  }
  await appCache.flush();
}

export async function cacheGetOrSet<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds = 300
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;
  const value = await fn();
  await cacheSet(key, value, ttlSeconds);
  return value;
}
