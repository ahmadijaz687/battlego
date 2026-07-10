import { jest } from '@jest/globals';

const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.unstable_mockModule('../src/utils/logger.js', () => ({ logger: mockLogger }));

describe('scheduled jobs lifecycle', () => {
  beforeEach(() => jest.clearAllMocks());

  it('startAllJobs registers handlers and schedules tasks without throwing', async () => {
    const { startAllJobs, stopAllJobs } = await import('../src/jobs/index.js');
    expect(() => startAllJobs()).not.toThrow();
    expect(mockLogger.info).toHaveBeenCalledWith('[Jobs] All scheduled jobs started');
    expect(() => stopAllJobs()).not.toThrow();
  });

  it('stopAllJobs is idempotent', async () => {
    const { stopAllJobs } = await import('../src/jobs/index.js');
    expect(() => stopAllJobs()).not.toThrow();
  });
});

describe('analytics job', () => {
  beforeEach(() => jest.clearAllMocks());

  it('flushAnalyticsBuffer is a no-op on empty buffer', async () => {
    const { flushAnalyticsBuffer, stopAnalyticsJob } = await import(
      '../src/queue/jobs/analyticsJob.js'
    );
    await expect(flushAnalyticsBuffer()).resolves.toBeUndefined();
    expect(() => stopAnalyticsJob()).not.toThrow();
  });

  it('registerAnalyticsJob buffers and flushes events', async () => {
    const { appQueue } = await import('../src/queue/Queue.js');
    const { registerAnalyticsJob, flushAnalyticsBuffer } = await import(
      '../src/queue/jobs/analyticsJob.js'
    );
    registerAnalyticsJob();
    appQueue.enqueue('analytics_event', {
      event: 'test_event',
      userId: 'u1',
      data: {},
      timestamp: new Date(),
    });
    await new Promise((r) => setTimeout(r, 50));
    await flushAnalyticsBuffer();
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('Analytics flushed'),
    );
  });
});