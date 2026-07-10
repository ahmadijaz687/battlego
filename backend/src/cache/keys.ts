const PREFIX = 'fb';

export function leaderboardKey(type: string, period: 'daily' | 'weekly' | 'monthly' | 'alltime'): string {
  return `${PREFIX}:leaderboard:${type}:${period}`;
}

export function userProfileKey(userId: string): string {
  return `${PREFIX}:user:${userId}:profile`;
}

export function workoutKey(workoutId: string): string {
  return `${PREFIX}:workout:${workoutId}`;
}

export function nutritionKey(userId: string, date: string): string {
  return `${PREFIX}:nutrition:${userId}:${date}`;
}

export function battleKey(battleId: string): string {
  return `${PREFIX}:battle:${battleId}`;
}

export function userStatsKey(userId: string): string {
  return `${PREFIX}:user:${userId}:stats`;
}

export function userAchievementsKey(userId: string): string {
  return `${PREFIX}:user:${userId}:achievements`;
}

export function userLevelKey(userId: string): string {
  return `${PREFIX}:user:${userId}:level`;
}

export function battlePassKey(userId: string): string {
  return `${PREFIX}:user:${userId}:battlepass`;
}

export function seasonKey(seasonId: string): string {
  return `${PREFIX}:season:${seasonId}`;
}

export function activeSeasonKey(): string {
  return `${PREFIX}:season:active`;
}

export function conversationKey(conversationId: string): string {
  return `${PREFIX}:conversation:${conversationId}`;
}

export function feedKey(userId: string, page: number): string {
  return `${PREFIX}:feed:${userId}:${page}`;
}

export function analyticsKey(type: string, period: string): string {
  return `${PREFIX}:analytics:${type}:${period}`;
}

export function challengeKey(challengeId: string): string {
  return `${PREFIX}:challenge:${challengeId}`;
}

export function habitKey(userId: string, date: string): string {
  return `${PREFIX}:habit:${userId}:${date}`;
}

export function healthKey(userId: string, type: string, date: string): string {
  return `${PREFIX}:health:${userId}:${type}:${date}`;
}
