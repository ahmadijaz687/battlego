import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

interface QueueItem {
  id: string;
  type: string;
  data: unknown;
  timestamp: Date;
}

export class Queue {
  private queue: QueueItem[] = [];
  private processing = false;
  private handlers: Map<string, (data: unknown) => Promise<void>> = new Map();

  enqueue(type: string, data: unknown): string {
    const id = uuidv4();
    this.queue.push({ id, type, data, timestamp: new Date() });
    if (!this.processing) {
      this.process().catch((error) => {
        logger.error('Queue processing error', error instanceof Error ? error : new Error(String(error)));
      });
    }
    return id;
  }

  registerHandler(type: string, handler: (data: unknown) => Promise<void>): void {
    this.handlers.set(type, handler);
  }

  private async process(): Promise<void> {
    this.processing = true;
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) continue;
      const handler = this.handlers.get(item.type);
      if (handler) {
        try {
          await handler(item.data);
        } catch (error) {
          logger.error(`Queue failed to process ${item.type} (${item.id})`, error instanceof Error ? error : new Error(String(error)));
        }
      } else {
        logger.warn(`Queue: No handler registered for type: ${item.type}`);
      }
    }
    this.processing = false;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}

export const appQueue = new Queue();
