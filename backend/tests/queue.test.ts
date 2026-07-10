import { jest } from '@jest/globals';

const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.unstable_mockModule('../src/utils/logger.js', () => ({
  logger: mockLogger,
}));

const { Queue } = await import('../src/queue/Queue.js');

describe('Queue', () => {
  let queue: Queue;

  beforeEach(() => {
    jest.clearAllMocks();
    queue = new Queue();
  });

  describe('enqueue/dequeue', () => {
    it('should enqueue items and return an id', () => {
      const id = queue.enqueue('test', { message: 'hello' });
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
    });

    it('should process items with registered handler', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      queue.registerHandler('test', handler);
      queue.enqueue('test', { data: 123 });

      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(handler).toHaveBeenCalledWith({ data: 123 });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should process multiple items in order', async () => {
      const order: number[] = [];
      const handler = jest.fn().mockImplementation(async (data: { id: number }) => {
        order.push(data.id);
      });
      queue.registerHandler('test', handler);

      queue.enqueue('test', { id: 1 });
      queue.enqueue('test', { id: 2 });
      queue.enqueue('test', { id: 3 });

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(order).toEqual([1, 2, 3]);
    });
  });

  describe('handlers', () => {
    it('should handle different types with different handlers', async () => {
      const handlerA = jest.fn().mockResolvedValue(undefined);
      const handlerB = jest.fn().mockResolvedValue(undefined);

      queue.registerHandler('typeA', handlerA);
      queue.registerHandler('typeB', handlerB);

      queue.enqueue('typeA', { a: 1 });
      queue.enqueue('typeB', { b: 2 });

      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(handlerA).toHaveBeenCalledWith({ a: 1 });
      expect(handlerB).toHaveBeenCalledWith({ b: 2 });
    });

    it('should warn for unregistered handler types', async () => {
      queue.enqueue('unknown', {});
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('queue processing', () => {
    it('should handle handler errors gracefully', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('Handler failed'));
      queue.registerHandler('failing', handler);

      queue.enqueue('failing', {});
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(handler).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should track queue length', () => {
      expect(queue.getQueueLength()).toBe(0);
      queue.enqueue('test', {});
      expect(queue.getQueueLength()).toBe(0);
      queue.enqueue('test', {});
      expect(queue.getQueueLength()).toBe(0);
    });
  });

  describe('clear', () => {
    it('should clear all queued items', () => {
      queue.enqueue('test', {});
      queue.enqueue('test', {});
      queue.clear();
      expect(queue.getQueueLength()).toBe(0);
    });
  });
});
