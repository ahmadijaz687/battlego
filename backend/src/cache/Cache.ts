export interface CacheOptions {
  ttl?: number;
}

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

export class Cache {
  private store: Map<string, CacheEntry> = new Map();
  private defaultTtl = 300_000; // 5 minutes

  async get<T>(key: string): Promise<T | null> {
    if (this.isExpired(key)) {
      this.store.delete(key);
      return null;
    }
    const entry = this.store.get(key);
    if (!entry) return null;
    return entry.value as T;
  }

  async set(key: string, value: unknown, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttl ?? this.defaultTtl;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async flush(): Promise<void> {
    this.store.clear();
  }

  async getOrSet<T>(key: string, fn: () => Promise<T>, options?: CacheOptions): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const value = await fn();
    await this.set(key, value, options);
    return value;
  }

  private isExpired(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return true;
    return Date.now() >= entry.expiresAt;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

export const appCache = new Cache();

// Run cleanup every 5 minutes
setInterval(() => {
  appCache.cleanup();
}, 300_000);
