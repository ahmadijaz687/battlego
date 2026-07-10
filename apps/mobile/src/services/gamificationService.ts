import { randomUUID } from 'expo-crypto';
import { getDatabase, type DB } from '../database';
import type {
  UserLevelRow,
  AchievementRow,
  UserAchievementRow,
  BadgeRow,
  UserBadgeRow,
  CoinRow,
  CoinTransactionRow,
  SeasonRow,
  BattlePassRow,
  DailyMissionRow,
} from '../database/types';
import { now, today } from '../database/helpers';

function getDb(): DB {
  return getDatabase();
}

const XP_PER_LEVEL = 1000;

function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

// ── XP & Levels ────────────────────────────────────────────────

export function getLevel(userId: string): {
  level: number; xp: number; totalXp: number; xpToNextLevel: number; progress: number;
} {
  const d = getDb();
  let level = d.getFirstSync<UserLevelRow>(
    'SELECT * FROM user_levels WHERE user_id = ?', [userId]
  );
  if (!level) {
    const id = randomUUID();
    d.runSync(
      'INSERT INTO user_levels (id, user_id, level, xp, total_xp) VALUES (?, ?, 1, 0, 0)',
      [id, userId]
    );
    level = d.getFirstSync<UserLevelRow>('SELECT * FROM user_levels WHERE user_id = ?', [userId])!;
  }
  return {
    level: level.level,
    xp: level.xp,
    totalXp: level.total_xp,
    xpToNextLevel: XP_PER_LEVEL - level.xp,
    progress: Math.round((level.xp / XP_PER_LEVEL) * 100),
  };
}

export function awardXP(userId: string, amount: number): {
  level: number; xp: number; totalXp: number; leveledUp: boolean;
} {
  if (amount <= 0) throw new Error('XP amount must be positive');
  const d = getDb();
  let level = d.getFirstSync<UserLevelRow>(
    'SELECT * FROM user_levels WHERE user_id = ?', [userId]
  );
  if (!level) {
    const id = randomUUID();
    d.runSync(
      'INSERT INTO user_levels (id, user_id, level, xp, total_xp) VALUES (?, ?, 1, 0, 0)',
      [id, userId]
    );
    level = d.getFirstSync<UserLevelRow>('SELECT * FROM user_levels WHERE user_id = ?', [userId])!;
  }

  const newXp = level.xp + amount;
  const newTotalXp = level.total_xp + amount;
  const newLevel = calculateLevel(newTotalXp);
  const leveledUp = newLevel > level.level;

  d.runSync(
    'UPDATE user_levels SET xp = ?, total_xp = ?, level = ?, updated_at = ? WHERE id = ?',
    [newXp, newTotalXp, newLevel, now(), level.id]
  );

  return { level: newLevel, xp: newXp, totalXp: newTotalXp, leveledUp };
}

// ── Coins ──────────────────────────────────────────────────────

export function getCoins(userId: string): CoinRow {
  const d = getDb();
  let coins = d.getFirstSync<CoinRow>('SELECT * FROM coins WHERE user_id = ?', [userId]);
  if (!coins) {
    const id = randomUUID();
    d.runSync(
      'INSERT INTO coins (id, user_id, balance, earned, spent) VALUES (?, ?, 0, 0, 0)',
      [id, userId]
    );
    coins = d.getFirstSync<CoinRow>('SELECT * FROM coins WHERE user_id = ?', [userId])!;
  }
  return coins;
}

export function awardCoins(userId: string, amount: number, type: string, description?: string): CoinRow {
  if (amount <= 0) throw new Error('Coin amount must be positive');
  const d = getDb();
  const coins = getCoins(userId);

  d.runSync(
    'UPDATE coins SET balance = balance + ?, earned = earned + ?, updated_at = ? WHERE id = ?',
    [amount, amount, now(), coins.id]
  );

  d.runSync(
    'INSERT INTO coin_transactions (id, user_id, amount, type, description) VALUES (?, ?, ?, ?, ?)',
    [randomUUID(), userId, amount, type, description ?? null]
  );

  return d.getFirstSync<CoinRow>('SELECT * FROM coins WHERE user_id = ?', [coins.id])!;
}

// ── Achievements ───────────────────────────────────────────────

export function checkAchievements(userId: string): UserAchievementRow[] {
  const d = getDb();
  const unlocked: UserAchievementRow[] = [];
  const achievements = d.getAllSync<AchievementRow>('SELECT * FROM achievements');

  for (const achievement of achievements) {
    const alreadyUnlocked = d.getFirstSync<UserAchievementRow>(
      'SELECT * FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
      [userId, achievement.id]
    );
    if (alreadyUnlocked) continue;

    const criteria = JSON.parse(achievement.criteria) as Record<string, number>;
    let qualifies = false;

    if (criteria.workouts) {
      const count = d.getFirstSync<{ cnt: number }>(
        'SELECT COUNT(*) as cnt FROM workouts WHERE user_id = ? AND completed_at IS NOT NULL', [userId]
      )?.cnt ?? 0;
      qualifies = count >= criteria.workouts;
    } else if (criteria.prs) {
      const count = d.getFirstSync<{ cnt: number }>(
        'SELECT COUNT(*) as cnt FROM personal_records WHERE user_id = ?', [userId]
      )?.cnt ?? 0;
      qualifies = count >= criteria.prs;
    } else if (criteria.meals) {
      const count = d.getFirstSync<{ cnt: number }>(
        'SELECT COUNT(*) as cnt FROM meals WHERE user_id = ?', [userId]
      )?.cnt ?? 0;
      qualifies = count >= criteria.meals;
    } else if (criteria.habit_logs) {
      const count = d.getFirstSync<{ cnt: number }>(
        `SELECT COUNT(*) as cnt FROM habit_logs hl JOIN habits h ON hl.habit_id = h.id WHERE h.user_id = ?`, [userId]
      )?.cnt ?? 0;
      qualifies = count >= criteria.habit_logs;
    } else if (criteria.battle_wins) {
      const count = d.getFirstSync<{ cnt: number }>(
        'SELECT COUNT(*) as cnt FROM battles WHERE winner_id = ?', [userId]
      )?.cnt ?? 0;
      qualifies = count >= criteria.battle_wins;
    }

    if (qualifies) {
      const id = randomUUID();
      d.runSync(
        'INSERT INTO user_achievements (id, user_id, achievement_id) VALUES (?, ?, ?)',
        [id, userId, achievement.id]
      );
      awardXP(userId, achievement.xp_reward);
      const ua = d.getFirstSync<UserAchievementRow>('SELECT * FROM user_achievements WHERE id = ?', [id])!;
      unlocked.push(ua);
    }
  }

  return unlocked;
}

export function getUserAchievements(userId: string): (UserAchievementRow & { achievement: AchievementRow })[] {
  const d = getDb();
  return d.getAllSync<UserAchievementRow & { achievement: AchievementRow }>(
    `SELECT ua.*, a.*
     FROM user_achievements ua
     JOIN achievements a ON a.id = ua.achievement_id
     WHERE ua.user_id = ?
     ORDER BY ua.unlocked_at DESC`,
    [userId]
  );
}

// ── Badges ─────────────────────────────────────────────────────

export function awardBadge(userId: string, badgeKey: string): UserBadgeRow | null {
  const d = getDb();
  const badge = d.getFirstSync<BadgeRow>('SELECT * FROM badges WHERE key = ?', [badgeKey]);
  if (!badge) return null;

  const existing = d.getFirstSync<UserBadgeRow>(
    'SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?', [userId, badge.id]
  );
  if (existing) return existing;

  const id = randomUUID();
  d.runSync(
    'INSERT INTO user_badges (id, user_id, badge_id) VALUES (?, ?, ?)',
    [id, userId, badge.id]
  );
  awardXP(userId, badge.xp_reward);
  return d.getFirstSync<UserBadgeRow>('SELECT * FROM user_badges WHERE id = ?', [id])!;
}

export function getBadges(): BadgeRow[] {
  return getDb().getAllSync<BadgeRow>('SELECT * FROM badges ORDER BY tier ASC');
}

export function getUserBadges(userId: string): (UserBadgeRow & { badge: BadgeRow })[] {
  const d = getDb();
  return d.getAllSync<UserBadgeRow & { badge: BadgeRow }>(
    `SELECT ub.*, b.*
     FROM user_badges ub
     JOIN badges b ON b.id = ub.badge_id
     WHERE ub.user_id = ?
     ORDER BY ub.awarded_at DESC`,
    [userId]
  );
}

// ── Gamification Profile ───────────────────────────────────────

function computeStreakDays(dates: string[]): number {
  if (dates.length === 0) return 0;
  const dayKeys = Array.from(
    new Set(
      dates.map((d) => {
        const day = new Date(d);
        day.setHours(0, 0, 0, 0);
        return day.getTime();
      })
    )
  ).sort((a, b) => b - a);

  const oneDay = 24 * 60 * 60 * 1000;
  const today_ = new Date();
  today_.setHours(0, 0, 0, 0);
  const todayMs = today_.getTime();

  if (dayKeys[0] !== todayMs && dayKeys[0] !== todayMs - oneDay) return 0;

  let streak = 1;
  for (let i = 1; i < dayKeys.length; i++) {
    if (dayKeys[i - 1] - dayKeys[i] === oneDay) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

export function getGamificationProfile(userId: string): {
  level: number; xp: number; totalXp: number;
  streakDays: number; badges: (UserBadgeRow & { badge: BadgeRow })[];
  nextLevelXp: number;
} {
  const d = getDb();
  const levelData = getLevel(userId);

  const workouts = d.getAllSync<{ completed_at: string | null }>(
    'SELECT completed_at FROM workouts WHERE user_id = ? AND completed_at IS NOT NULL ORDER BY completed_at DESC LIMIT 200',
    [userId]
  );
  const habitLogs = d.getAllSync<{ date: string }>(
    `SELECT hl.date FROM habit_logs hl JOIN habits h ON hl.habit_id = h.id
     WHERE h.user_id = ? ORDER BY hl.date DESC LIMIT 200`,
    [userId]
  );

  const activityDates = [
    ...workouts.map((w) => w.completed_at!).filter(Boolean),
    ...habitLogs.map((h) => h.date),
  ];
  const streakDays = computeStreakDays(activityDates);

  const badges = getUserBadges(userId);

  return {
    level: levelData.level,
    xp: levelData.xp,
    totalXp: levelData.totalXp,
    streakDays,
    badges,
    nextLevelXp: XP_PER_LEVEL - levelData.xp,
  };
}

// ── Seasons & Battle Pass ──────────────────────────────────────

export function getActiveSeason(): SeasonRow | null {
  return getDb().getFirstSync<SeasonRow>(
    `SELECT * FROM seasons WHERE active = 1 AND start_date <= datetime('now') AND end_date >= datetime('now')`
  );
}

export function getBattlePass(userId: string): (BattlePassRow & { seasonName: string; totalTiers: number; xpPerTier: number }) | null {
  const d = getDb();
  const season = getActiveSeason();
  if (!season) return null;

  let bp = d.getFirstSync<BattlePassRow>(
    'SELECT * FROM battle_passes WHERE user_id = ? AND season_id = ?', [userId, season.id]
  );
  if (!bp) {
    const id = randomUUID();
    d.runSync(
      'INSERT INTO battle_passes (id, user_id, season_id) VALUES (?, ?, ?)',
      [id, userId, season.id]
    );
    bp = d.getFirstSync<BattlePassRow>('SELECT * FROM battle_passes WHERE id = ?', [id])!;
  }

  const totalTiers = 50;
  const xpPerTier = 500;

  return { ...bp, seasonName: season.name, totalTiers, xpPerTier };
}

export function claimBattlePassReward(userId: string, tier: number): BattlePassRow {
  const d = getDb();
  const bp = d.getFirstSync<BattlePassRow>(
    `SELECT bp.* FROM battle_passes bp JOIN seasons s ON bp.season_id = s.id
     WHERE bp.user_id = ? AND s.active = 1`, [userId]
  );
  if (!bp) throw new Error('No active battle pass');
  if (bp.tier < tier) throw new Error('Tier not reached yet');

  const claimed = JSON.parse(bp.claimed) as string[];
  if (claimed.includes(tier.toString())) throw new Error('Reward already claimed');

  const updatedClaimed = [...claimed, tier.toString()];
  d.runSync(
    'UPDATE battle_passes SET claimed = ?, updated_at = ? WHERE id = ?',
    [JSON.stringify(updatedClaimed), now(), bp.id]
  );

  return d.getFirstSync<BattlePassRow>('SELECT * FROM battle_passes WHERE id = ?', [bp.id])!;
}

// ── Daily Missions ─────────────────────────────────────────────

export function getDailyMissions(userId: string): DailyMissionRow {
  const d = getDb();
  const dateStr = today();
  let missions = d.getFirstSync<DailyMissionRow>(
    'SELECT * FROM daily_missions WHERE user_id = ? AND mission_date = ?', [userId, dateStr]
  );

  if (!missions) {
    const defaultMissions = JSON.stringify([
      { id: 'complete_workout', name: 'Complete a workout', target: 1, current: 0, xpReward: 50 },
      { id: 'log_meal', name: 'Log a meal', target: 1, current: 0, xpReward: 20 },
      { id: 'drink_water', name: 'Drink 8 glasses of water', target: 8, current: 0, xpReward: 30 },
    ]);
    const id = randomUUID();
    d.runSync(
      'INSERT INTO daily_missions (id, user_id, mission_date, missions) VALUES (?, ?, ?, ?)',
      [id, userId, dateStr, defaultMissions]
    );
    missions = d.getFirstSync<DailyMissionRow>('SELECT * FROM daily_missions WHERE id = ?', [id])!;
  }

  return missions;
}

export function completeMission(userId: string, missionId: string): DailyMissionRow {
  const d = getDb();
  const dateStr = today();
  const missions = d.getFirstSync<DailyMissionRow>(
    'SELECT * FROM daily_missions WHERE user_id = ? AND mission_date = ?', [userId, dateStr]
  );
  if (!missions) throw new Error('No daily missions found');

  const items = JSON.parse(missions.missions) as Array<{
    id: string; name: string; target: number; current: number; xpReward: number;
  }>;

  const updatedItems = items.map((m) => {
    if (m.id === missionId && m.current < m.target) {
      return { ...m, current: m.current + 1 };
    }
    return m;
  });

  const allCompleted = updatedItems.every((m) => m.current >= m.target);

  d.runSync(
    'UPDATE daily_missions SET missions = ?, completed = ? WHERE id = ?',
    [JSON.stringify(updatedItems), allCompleted ? 1 : 0, missions.id]
  );

  const mission = updatedItems.find((m) => m.id === missionId);
  if (mission && mission.current >= mission.target) {
    awardXP(userId, mission.xpReward);
  }

  return d.getFirstSync<DailyMissionRow>('SELECT * FROM daily_missions WHERE id = ?', [missions.id])!;
}

// ── XP Event Constants ─────────────────────────────────────────

export const XPEvent = {
  WORKOUT_COMPLETE: 100,
  WORKOUT_STREAK: 50,
  MEAL_LOGGED: 20,
  WATER_LOGGED: 10,
  WEIGHT_LOGGED: 25,
  ACHIEVEMENT_UNLOCKED: 75,
  FRIEND_ADDED: 30,
  POST_CREATED: 40,
  BATTLE_WON: 200,
  BATTLE_PARTICIPATED: 50,
  HABIT_COMPLETED: 15,
  CHALLENGE_COMPLETED: 150,
  CHALLENGE_PARTICIPATED: 50,
} as const;
