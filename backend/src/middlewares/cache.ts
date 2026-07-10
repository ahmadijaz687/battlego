import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: unknown;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();

const DEFAULT_TTL_MS = 60 * 1000;

function sanitizeKey(req: Request): string {
  return `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;
}

export function cacheMiddleware(ttlMs: number = DEFAULT_TTL_MS) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    const key = sanitizeKey(req);
    const entry = cache.get(key);

    if (entry && entry.expiry > Date.now()) {
      res.json(entry.data);
      return;
    }

    const originalJson = res.json.bind(res);
    res.json = function (body: unknown) {
      cache.set(key, { data: body, expiry: Date.now() + ttlMs });
      return originalJson(body);
    };

    next();
  };
}

export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }

  const regex = new RegExp(pattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
