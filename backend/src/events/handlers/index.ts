import { registerXpHandler } from './xpHandler.js';
import { registerAchievementHandler } from './achievementHandler.js';
import { registerNotificationHandler } from './notificationHandler.js';
import { registerLeaderboardHandler } from './leaderboardHandler.js';
import { registerAnalyticsHandler } from './analyticsHandler.js';
import { logger } from '../../utils/logger.js';

export function registerAllHandlers(): void {
  registerXpHandler();
  registerAchievementHandler();
  registerNotificationHandler();
  registerLeaderboardHandler();
  registerAnalyticsHandler();
  logger.info('[Events] All event handlers registered');
}

export { registerXpHandler } from './xpHandler.js';
export { registerAchievementHandler } from './achievementHandler.js';
export { registerNotificationHandler } from './notificationHandler.js';
export { registerLeaderboardHandler } from './leaderboardHandler.js';
export { registerAnalyticsHandler } from './analyticsHandler.js';
