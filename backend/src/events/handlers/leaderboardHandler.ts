import { appEventEmitter, EventTypes } from '../index.js';
import { appCache } from '../../cache/Cache.js';
import { leaderboardKey } from '../../cache/keys.js';

export function registerLeaderboardHandler(): void {
  const invalidateLeaderboard = (_userId: string) => {
    const periods = ['daily', 'weekly', 'monthly', 'alltime'] as const;
    for (const period of periods) {
      appCache.delete(leaderboardKey('global', period)).catch(() => {});
    }
  };

  appEventEmitter.on(EventTypes.XP_EARNED, async (payload) => {
    invalidateLeaderboard(payload.userId);
  });

  appEventEmitter.on(EventTypes.LEVEL_UP, async (payload) => {
    invalidateLeaderboard(payload.userId);
  });

  appEventEmitter.on(EventTypes.WORKOUT_COMPLETED, async (_payload) => {
    appCache.delete(leaderboardKey('workouts', 'daily')).catch(() => {});
    appCache.delete(leaderboardKey('workouts', 'weekly')).catch(() => {});
  });
}
