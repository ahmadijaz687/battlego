import { isRedisAvailable, getRedisClient } from './RedisClient.js';
import { appCache } from './Cache.js';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  if (isRedisAvailable()) {
    const redis = await getRedisClient();
    if (redis) {
      const multi = redis.multi();
      multi.zremrangebyscore(key, 0, windowStart);
      multi.zadd(key, now, `${now}-${Math.random()}`);
      multi.zcard(key);
      multi.expire(key, windowSeconds);
      const results = await multi.exec();
      const count = (results?.[2]?.[1] as number) || 0;
      return {
        allowed: count <= maxRequests,
        remaining: Math.max(0, maxRequests - count),
        resetAt: now + windowSeconds * 1000,
      };
    }
  }

  const cacheKey = `ratelimit:${key}`;
  const current = await appCache.get<{ count: number; resetAt: number }>(cacheKey);
  if (!current || now > current.resetAt) {
    const resetAt = now + windowSeconds * 1000;
    await appCache.set(cacheKey, { count: 1, resetAt }, { ttl: windowSeconds * 1000 });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }
  const newCount = current.count + 1;
  await appCache.set(cacheKey, { count: newCount, resetAt: current.resetAt }, { ttl: windowSeconds * 1000 });
  return {
    allowed: newCount <= maxRequests,
    remaining: Math.max(0, maxRequests - newCount),
    resetAt: current.resetAt,
  };
}
