import { jest } from '@jest/globals';

const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const mockRedis = {
  lpush: jest.fn(),
  rpop: jest.fn(),
  llen: jest.fn(),
};

let redisAvailable = false;

jest.unstable_mockModule('../src/utils/logger.js', () => ({ logger: mockLogger }));
jest.unstable_mockModule('../src/cache/RedisClient.js', () => ({
  isRedisAvailable: () => redisAvailable,
  getRedisClient: async () => (redisAvailable ? mockRedis : null),
}));

describe('notification queue with Redis available', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    redisAvailable = true;
    mockRedis.lpush.mockResolvedValue(1);
    mockRedis.rpop.mockResolvedValue(null);
    mockRedis.llen.mockResolvedValue(3);
  });

  it('enqueueNotification pushes to Redis when available', async () => {
    const { enqueueNotification } = await import('../src/queue/notificationQueue.js');
    await enqueueNotification({ type: 'push', userId: 'u1', title: 't', body: 'b' });
    expect(mockRedis.lpush).toHaveBeenCalled();
  });

  it('dequeueNotification pops from Redis and parses JSON', async () => {
    mockRedis.rpop.mockResolvedValue(JSON.stringify({ type: 'email', userId: 'u2', title: 't', body: 'b' }));
    const { dequeueNotification } = await import('../src/queue/notificationQueue.js');
    const job = await dequeueNotification();
    expect(job).not.toBeNull();
    expect(job?.userId).toBe('u2');
  });

  it('getQueueLength returns Redis llen', async () => {
    const { getQueueLength } = await import('../src/queue/notificationQueue.js');
    const len = await getQueueLength();
    expect(len).toBe(3);
  });

  it('dequeueNotification returns null on empty Redis list', async () => {
    mockRedis.rpop.mockResolvedValue(null);
    const { dequeueNotification } = await import('../src/queue/notificationQueue.js');
    const job = await dequeueNotification();
    expect(job).toBeNull();
  });
});