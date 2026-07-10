import { appCache } from './Cache.js';
import { leaderboardKey, userProfileKey, activeSeasonKey, userLevelKey } from './keys.js';
import { getLeaderboard } from '../services/gamificationService.js';
import { prisma } from '../services/database.js';
import { logger } from '../utils/logger.js';

export async function warmLeaderboard(type: string = 'global'): Promise<void> {
  const periods = ['daily', 'weekly', 'monthly', 'alltime'] as const;
  for (const period of periods) {
    const key = leaderboardKey(type, period);
    await appCache.getOrSet(key, () => getLeaderboard(100), { ttl: 60_000 });
  }
  logger.info(`[Cache Warmer] Leaderboard cache warmed for type: ${type}`);
}

export async function warmUserProfile(userId: string): Promise<void> {
  const key = userProfileKey(userId);
  await appCache.getOrSet(
    key,
    async () => {
      return prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
          userProfile: {
            select: { goal: true },
          },
        },
      });
    },
    { ttl: 120_000 },
  );
  logger.info(`[Cache Warmer] Profile cache warmed for user: ${userId}`);
}

export async function preloadCommonQueries(): Promise<void> {
  try {
    const key = activeSeasonKey();
    await appCache.getOrSet(
      key,
      async () => {
        const now = new Date();
        return prisma.season.findFirst({
          where: { active: true, startDate: { lte: now }, endDate: { gte: now } },
        });
      },
      { ttl: 300_000 },
    );

    await warmLeaderboard('global');

    logger.info('[Cache Warmer] Common queries preloaded');
  } catch (error) {
    logger.error('[Cache Warmer] Preload failed:', error instanceof Error ? error : new Error(String(error)));
  }
}

export async function warmUserRelatedData(userId: string): Promise<void> {
  await Promise.all([
    warmUserProfile(userId),
    appCache.getOrSet(
      userLevelKey(userId),
      async () => {
        return prisma.userLevel.findUnique({ where: { userId } });
      },
      { ttl: 60_000 },
    ),
  ]);
  logger.info(`[Cache Warmer] User data warmed for: ${userId}`);
}
