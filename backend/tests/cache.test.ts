import { Cache } from '../src/cache/Cache.js';
import { jest } from '@jest/globals';

describe('Cache', () => {
  let cache: Cache;

  beforeEach(() => {
    cache = new Cache();
  });

  describe('get/set', () => {
    it('should store and retrieve values', async () => {
      await cache.set('key1', 'value1');
      const result = await cache.get<string>('key1');
      expect(result).toBe('value1');
    });

    it('should return null for missing keys', async () => {
      const result = await cache.get('nonexistent');
      expect(result).toBeNull();
    });

    it('should store complex objects', async () => {
      const obj = { id: 1, name: 'test', nested: { a: 1 } };
      await cache.set('obj', obj);
      const result = await cache.get<typeof obj>('obj');
      expect(result).toEqual(obj);
    });

    it('should store arrays', async () => {
      const arr = [1, 2, 3, 'four'];
      await cache.set('arr', arr);
      const result = await cache.get<typeof arr>('arr');
      expect(result).toEqual(arr);
    });
  });

  describe('delete', () => {
    it('should remove a key', async () => {
      await cache.set('key1', 'value1');
      await cache.delete('key1');
      const result = await cache.get('key1');
      expect(result).toBeNull();
    });

    it('should not throw when deleting nonexistent key', async () => {
      await expect(cache.delete('nonexistent')).resolves.not.toThrow();
    });
  });

  describe('TTL expiration', () => {
    it('should expire entries after TTL', async () => {
      await cache.set('key1', 'value1', { ttl: 10 });
      const result = await cache.get<string>('key1');
      expect(result).toBe('value1');

      await new Promise((resolve) => setTimeout(resolve, 20));
      const expired = await cache.get<string>('key1');
      expect(expired).toBeNull();
    });

    it('should use default TTL when none provided', async () => {
      await cache.set('key1', 'value1');
      const result = await cache.get<string>('key1');
      expect(result).toBe('value1');
    });

    it('should allow long TTL values', async () => {
      await cache.set('key1', 'value1', { ttl: 60000 });
      const result = await cache.get<string>('key1');
      expect(result).toBe('value1');
    });
  });

  describe('getOrSet', () => {
    it('should return cached value when available', async () => {
      await cache.set('key1', 'cached');
      const fn = jest.fn().mockResolvedValue('fresh');
      const result = await cache.getOrSet<string>('key1', fn);
      expect(result).toBe('cached');
      expect(fn).not.toHaveBeenCalled();
    });

    it('should compute and cache when missing', async () => {
      const fn = jest.fn().mockResolvedValue('computed');
      const result = await cache.getOrSet<string>('key1', fn);
      expect(result).toBe('computed');
      expect(fn).toHaveBeenCalledTimes(1);

      const cached = await cache.get<string>('key1');
      expect(cached).toBe('computed');
    });

    it('should handle async factory functions', async () => {
      const fn = jest.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        return 'async-value';
      });
      const result = await cache.getOrSet<string>('key1', fn);
      expect(result).toBe('async-value');
    });

    it('should pass options to set', async () => {
      const fn = jest.fn().mockResolvedValue('value');
      await cache.getOrSet('key1', fn, { ttl: 10 });
      await new Promise((resolve) => setTimeout(resolve, 20));
      const expired = await cache.get<string>('key1');
      expect(expired).toBeNull();
    });
  });

  describe('flush', () => {
    it('should clear all entries', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');
      await cache.flush();
      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toBeNull();
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', async () => {
      await cache.set('key1', 'value1', { ttl: 5 });
      await cache.set('key2', 'value2', { ttl: 50000 });
      await new Promise((resolve) => setTimeout(resolve, 10));
      cache.cleanup();
      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toBe('value2');
    });
  });
});
