import { prisma } from '../services/database.js';

// ============================================
// ACHIEVEMENTS
// ============================================

export async function getAchievements() {
  return prisma.achievement.findMany({ orderBy: { category: 'asc' } });
}

export async function getUserAchievements(userId: string) {
  return prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { unlockedAt: 'desc' },
  });
}

export async function unlockAchievement(userId: string, achievementName: string) {
  const achievement = await prisma.achievement.findUnique({ where: { name: achievementName } });
  if (!achievement) throw new Error(`Achievement '${achievementName}' not found`);

  const existing = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId: achievement.id } },
  });
  if (existing) return existing;

  const [userAchievement, userLevel] = await prisma.$transaction(async (tx) => {
    const ua = await tx.userAchievement.create({
      data: { userId, achievementId: achievement.id },
      include: { achievement: true },
    });
    const ul = await addXPWithTx(tx, userId, achievement.xpReward);
    return [ua, ul] as const;
  });

  return { ...userAchievement, newXpTotal: userLevel.xp, newLevel: userLevel.level };
}

// ============================================
// LEVELS & XP
// ============================================

const XP_PER_LEVEL = 1000;

function calculateLevel(totalXp: number) {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

export async function getUserLevel(userId: string) {
  let level = await prisma.userLevel.findUnique({ where: { userId } });
  if (!level) {
    level = await prisma.userLevel.create({ data: { userId } });
  }
  return {
    level: level.level,
    xp: level.xp,
    totalXp: level.totalXp,
    xpToNextLevel: XP_PER_LEVEL - level.xp,
    progress: Math.round((level.xp / XP_PER_LEVEL) * 100),
  };
}

async function addXPWithTx(tx: Parameters<typeof prisma.$transaction>[0] extends (arg: infer T) => unknown ? T : never, userId: string, amount: number) {
  let level = await tx.userLevel.findUnique({ where: { userId } });
  if (!level) {
    level = await tx.userLevel.create({ data: { userId } });
  }

  const newXp = level.xp + amount;
  const newTotalXp = level.totalXp + amount;
  const newLevel = calculateLevel(newTotalXp);
  const leveledUp = newLevel > level.level;

  const updated = await tx.userLevel.update({
    where: { userId },
    data: { xp: newXp, totalXp: newTotalXp, level: newLevel },
  });

  return {
    ...updated,
    xp: newXp,
    totalXp: newTotalXp,
    level: newLevel,
    leveledUp,
    xpAwarded: amount,
  };
}

export async function addXP(userId: string, amount: number) {
  return addXPWithTx(prisma, userId, amount);
}

function computeStreakDays(dates: Date[]): number {
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  if (dayKeys[0] !== todayMs && dayKeys[0] !== todayMs - oneDay) return 0;

  let streak = 1;
  for (let i = 1; i < dayKeys.length; i += 1) {
    if (dayKeys[i - 1] - dayKeys[i] === oneDay) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

export async function getGamificationProfile(userId: string) {
  let level = await prisma.userLevel.findUnique({ where: { userId } });
  if (!level) {
    level = await prisma.userLevel.create({ data: { userId } });
  }

  const [badges, workouts, habitLogs] = await Promise.all([
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { awardedAt: 'desc' },
    }),
    prisma.workout.findMany({
      where: { userId, completedAt: { not: null } },
      select: { completedAt: true },
      orderBy: { completedAt: 'desc' },
      take: 200,
    }),
    prisma.habitLog.findMany({
      where: { habit: { userId } },
      select: { date: true },
      orderBy: { date: 'desc' },
      take: 200,
    }),
  ]);

  const activityDates = [
    ...workouts.map((w) => w.completedAt).filter((d): d is Date => d != null),
    ...habitLogs.map((h) => h.date),
  ];
  const streakDays = computeStreakDays(activityDates);

  return {
    level: level.level,
    xp: level.xp,
    totalXp: level.totalXp,
    streakDays,
    badges,
    nextLevelXp: level.level > 0 ? XP_PER_LEVEL - level.xp : null,
  };
}

export async function getBadges() {
  return prisma.badge.findMany({ orderBy: { tier: 'asc' } });
}

export async function getLeaderboard(limit = 50) {
  return prisma.userLevel.findMany({
    orderBy: { totalXp: 'desc' },
    take: limit,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });
}

// ============================================
// SEASONS
// ============================================

export async function getActiveSeason() {
  const now = new Date();
  return prisma.season.findFirst({
    where: { active: true, startDate: { lte: now }, endDate: { gte: now } },
  });
}

export async function getSeasons() {
  return prisma.season.findMany({ orderBy: { startDate: 'desc' } });
}

export async function createSeason(data: {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}) {
  return prisma.season.create({
    data: {
      name: data.name,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
}

export async function activateSeason(seasonId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.season.updateMany({ where: { active: true }, data: { active: false } });
    return tx.season.update({
      where: { id: seasonId },
      data: { active: true },
    });
  });
}

// ============================================
// BATTLE PASS
// ============================================

export async function getBattlePass(userId: string) {
  const season = await getActiveSeason();
  if (!season) return null;

  let battlePass = await prisma.battlePass.findUnique({
    where: { userId_seasonId: { userId, seasonId: season.id } },
  });
  if (!battlePass) {
    battlePass = await prisma.battlePass.create({
      data: { userId, seasonId: season.id },
    });
  }

  const totalTiers = 50;
  const xpPerTier = 500;
  const currentTierXp = battlePass.xp % xpPerTier;

  return {
    id: battlePass.id,
    seasonId: battlePass.seasonId,
    seasonName: season.name,
    tier: battlePass.tier,
    xp: battlePass.xp,
    premium: battlePass.premium,
    claimed: battlePass.claimed as string[],
    totalTiers,
    xpPerTier,
    currentTierProgress: Math.round((currentTierXp / xpPerTier) * 100),
    xpToNextTier: xpPerTier - currentTierXp,
  };
}

export async function addBattlePassXP(userId: string, amount: number) {
  const season = await getActiveSeason();
  if (!season) return null;

  let battlePass = await prisma.battlePass.findUnique({
    where: { userId_seasonId: { userId, seasonId: season.id } },
  });
  if (!battlePass) {
    battlePass = await prisma.battlePass.create({
      data: { userId, seasonId: season.id },
    });
  }

  const xpPerTier = 500;
  const totalTiers = 50;
  const newXp = battlePass.xp + amount;
  const newTier = Math.min(Math.floor(newXp / xpPerTier) + 1, totalTiers);

  return prisma.battlePass.update({
    where: { id: battlePass.id },
    data: { xp: newXp, tier: newTier },
  });
}

export async function claimBattlePassReward(userId: string, tier: number) {
  const battlePass = await prisma.battlePass.findFirst({
    where: { userId, season: { active: true } },
  });
  if (!battlePass) throw new Error('No active battle pass');
  if (battlePass.tier < tier) throw new Error('Tier not reached yet');

  const claimed = (battlePass.claimed as string[]) || [];
  if (claimed.includes(tier.toString())) throw new Error('Reward already claimed');

  const updatedClaimed = [...claimed, tier.toString()];
  return prisma.battlePass.update({
    where: { id: battlePass.id },
    data: { claimed: updatedClaimed },
  });
}

export async function upgradeBattlePass(userId: string) {
  const season = await getActiveSeason();
  if (!season) throw new Error('No active season');

  return prisma.battlePass.upsert({
    where: { userId_seasonId: { userId, seasonId: season.id } },
    update: { premium: true },
    create: { userId, seasonId: season.id, premium: true },
  });
}

// ============================================
// XP EVENTS (called by other services)
// ============================================

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
