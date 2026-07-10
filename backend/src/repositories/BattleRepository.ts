import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';
import { AppError } from '../utils/AppError.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class BattleRepository extends BaseRepository<any, any, any> {
  constructor() {
    super(prisma.battle, 'battle');
  }

  async findActiveByUserId(userId: string) {
    return prisma.battle.findMany({
      where: {
        status: 'active',
        OR: [{ creatorId: userId }, { opponentId: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCompletedByUserId(userId: string) {
    return prisma.battle.findMany({
      where: {
        status: 'completed',
        OR: [{ creatorId: userId }, { opponentId: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: string, params?: { skip?: number; take?: number }) {
    return prisma.battle.findMany({
      where: { status: status as never },
      orderBy: { createdAt: 'desc' },
      skip: params?.skip || 0,
      take: params?.take || 20,
    });
  }

  async createBattle(data: {
    creatorId: string;
    opponentId?: string;
    type: string;
    status?: string;
    startTime?: Date;
    endTime?: Date;
  }) {
    return prisma.battle.create({ data: { ...data, status: data.status || 'pending' } as never });
  }

  async updateScore(battleId: string, userId: string, score: number) {
    const battle = await prisma.battle.findUnique({ where: { id: battleId } });
    if (!battle) throw new AppError('Battle not found', 404);

    const isCreator = battle.creatorId === userId;
    const data = isCreator
      ? { creatorScore: score }
      : { opponentScore: score };

    return prisma.battle.update({ where: { id: battleId }, data });
  }

  async getLeaderboard(battleId: string) {
    const battle = await prisma.battle.findUnique({ where: { id: battleId } });
    if (!battle) throw new AppError('Battle not found', 404);

    const entries = [];
    if (battle.creatorScore != null) {
      entries.push({ userId: battle.creatorId, score: battle.creatorScore });
    }
    if (battle.opponentScore != null) {
      entries.push({ userId: battle.opponentId, score: battle.opponentScore });
    }

    return entries.sort((a, b) => b.score - a.score);
  }

  async getLeaderboardGlobal(period: 'week' | 'month' | 'all') {
    const now = new Date();
    let dateFilter: Date | undefined;

    if (period === 'week') {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const where = {
      status: 'completed' as const,
      ...(dateFilter ? { createdAt: { gte: dateFilter } } : {}),
    };

    const battles = await prisma.battle.findMany({ where: where as never });

    const scoreMap = new Map<string, number>();
    for (const b of battles) {
      const cId = b.creatorId;
      const oId = b.opponentId;
      scoreMap.set(cId, (scoreMap.get(cId) || 0) + (b.creatorScore || 0));
      if (oId) {
        scoreMap.set(oId, (scoreMap.get(oId) || 0) + (b.opponentScore || 0));
      }
    }

    return Array.from(scoreMap.entries())
      .map(([userId, score]) => ({ userId, score }))
      .sort((a, b) => b.score - a.score);
  }
}

export const battleRepository = new BattleRepository();
