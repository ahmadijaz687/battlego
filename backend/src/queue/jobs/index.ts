import { logger } from '../../utils/logger.js';
import { registerNotificationJob } from './notificationJob.js';
import { registerAnalyticsJob } from './analyticsJob.js';
import { registerSyncJob } from './syncJob.js';
import { registerCleanupJob } from './cleanupJob.js';

export function registerAllJobs(): void {
  registerNotificationJob();
  registerAnalyticsJob();
  registerSyncJob();
  registerCleanupJob();
  logger.info('[Jobs] All queue job handlers registered');
}

export { registerNotificationJob } from './notificationJob.js';
export { registerAnalyticsJob } from './analyticsJob.js';
export { registerSyncJob } from './syncJob.js';
export { registerCleanupJob } from './cleanupJob.js';
