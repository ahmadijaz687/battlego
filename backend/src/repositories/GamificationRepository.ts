import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';
import { AppError } from '../utils/AppError.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class GamificationRepository extends BaseRepository<any, any, any> {
  constructor() {
    super(prisma.achievement, 'achievement');
  }

  async getAllAchievements() {
    return prisma.achievement.findMany({ orderBy: { category: 'asc' } });
  }

  async getUserAchievements(userId: string) {
    return prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
    });
  }

  async unlockAchievement(userId: string, name: string) {
    const achievement = await prisma.achievement.findUnique({ where: { name } });
    if (!achievement) throw new AppError('Achievement not found', 404);

    const existing = await prisma.userAchievement.findUnique({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
    });
    if (existing) return existing;

    const userAchievement = await prisma.userAchievement.create({
      data: { userId, achievementId: achievement.id },
    });

    await this.addXp(userId, achievement.xpReward);

    return userAchievement;
  }

  async getUserLevel(userId: string) {
    let level = await prisma.userLevel.findUnique({ where: { userId } });
    if (!level) {
      level = await prisma.userLevel.create({ data: { userId } });
    }
    return level;
  }

  async addXp(userId: string, amount: number) {
    const level = await this.getUserLevel(userId);
    const newXp = level.xp + amount;
    const newTotalXp = level.totalXp + amount;
    const newLevel = Math.floor(newTotalXp / 1000) + 1;

    return prisma.userLevel.update({
      where: { userId },
      data: {
        xp: newXp,
        totalXp: newTotalXp,
        level: newLevel,
      },
    });
  }

  async getLeaderboard(params?: { skip?: number; take?: number }) {
    return prisma.userLevel.findMany({
      orderBy: { level: 'desc' },
      skip: params?.skip || 0,
      take: params?.take || 20,
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async getActiveSeason() {
    return prisma.season.findFirst({
      where: { active: true },
    });
  }

  async getUserBattlePass(userId: string) {
    const season = await this.getActiveSeason();
    if (!season) return null;

    let battlePass = await prisma.battlePass.findUnique({
      where: { userId_seasonId: { userId, seasonId: season.id } },
    });

    if (!battlePass) {
      battlePass = await prisma.battlePass.create({
        data: { userId, seasonId: season.id },
      });
    }

    return { ...battlePass, season };
  }

  async claimReward(userPassId: string, rewardIndex: number) {
    const battlePass = await prisma.battlePass.findUnique({ where: { id: userPassId } });
    if (!battlePass) throw new AppError('Battle pass not found', 404);

    const claimed = (battlePass.claimed as number[]) || [];
    if (claimed.includes(rewardIndex)) throw new AppError('Reward already claimed', 409);

    claimed.push(rewardIndex);
    return prisma.battlePass.update({
      where: { id: userPassId },
      data: { claimed },
    });
  }

  async upgradeBattlePass(userId: string, tier: number) {
    const season = await this.getActiveSeason();
    if (!season) throw new AppError('No active season', 404);

    return prisma.battlePass.update({
      where: { userId_seasonId: { userId, seasonId: season.id } },
      data: { premium: true, tier },
    });
  }
}

export const gamificationRepository = new GamificationRepository();
