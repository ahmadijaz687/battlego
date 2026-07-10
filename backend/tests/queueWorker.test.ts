import { jest } from '@jest/globals';

const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.unstable_mockModule('../src/utils/logger.js', () => ({ logger: mockLogger }));

describe('notification queue worker (activation)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('startQueueWorker / stopQueueWorker manage the timer without throwing', async () => {
    const { startQueueWorker, stopQueueWorker } = await import(
      '../src/queue/notificationQueue.js'
    );
    expect(() => startQueueWorker(50)).not.toThrow();
    expect(() => stopQueueWorker()).not.toThrow();
    // Idempotent stop
    expect(() => stopQueueWorker()).not.toThrow();
  });

  it('enqueueNotification falls back to in-memory queue when Redis is unavailable', async () => {
    const { Queue } = await import('../src/queue/Queue.js');
    const { appQueue } = await import('../src/queue/Queue.js');
    const { enqueueNotification } = await import('../src/queue/notificationQueue.js');

    const handler = jest.fn().mockResolvedValue(undefined);
    appQueue.registerHandler('push_notification', handler);

    await enqueueNotification({
      type: 'push',
      userId: 'u1',
      title: 'Hi',
      body: 'Welcome',
    });

    await new Promise((r) => setTimeout(r, 50));
    expect(handler).toHaveBeenCalled();
    const arg = handler.mock.calls[0][0] as { userId: string };
    expect(arg.userId).toBe('u1');
  });

  it('getQueueLength returns in-memory length when Redis unavailable', async () => {
    const { getQueueLength } = await import('../src/queue/notificationQueue.js');
    const len = await getQueueLength();
    expect(typeof len).toBe('number');
  });
});