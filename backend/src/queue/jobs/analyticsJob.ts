import { appQueue } from '../Queue.js';
import { logger } from '../../utils/logger.js';

interface AnalyticsEvent {
  event: string;
  userId: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

const eventBuffer: AnalyticsEvent[] = [];
const BATCH_SIZE = 25;
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

export async function flushAnalyticsBuffer(): Promise<void> {
  if (eventBuffer.length === 0) return;
  const batch = eventBuffer.splice(0, eventBuffer.length);
  try {
    // TODO: Send batch to analytics service (e.g., PostHog, Mixpanel)
    // await analyticsClient.captureMany(batch);
    logger.info(`Analytics flushed ${batch.length} events`);
    for (const event of batch) {
      logger.debug(`  -> ${event.event} (user: ${event.userId})`);
    }
  } catch (error) {
    logger.error('Analytics failed to flush events', error instanceof Error ? error : new Error(String(error)));
  }
}

function scheduleFlush(): void {
  if (flushTimeout) clearTimeout(flushTimeout);
  flushTimeout = setTimeout(() => {
    flushAnalyticsBuffer().catch((error) => {
      logger.error('Analytics scheduled flush failed', error instanceof Error ? error : new Error(String(error)));
    });
  }, 5000);
  if (typeof flushTimeout.unref === 'function') {
    flushTimeout.unref();
  }
}

export function stopAnalyticsJob(): void {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }
  // Flush any remaining buffered events on shutdown.
  void flushAnalyticsBuffer();
}

export function registerAnalyticsJob(): void {
  appQueue.registerHandler('analytics_event', async (data: unknown) => {
    eventBuffer.push(data as AnalyticsEvent);
    if (eventBuffer.length >= BATCH_SIZE) {
      await flushAnalyticsBuffer();
    } else {
      scheduleFlush();
    }
  });
}