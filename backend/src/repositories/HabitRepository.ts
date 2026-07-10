import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class HabitRepository extends BaseRepository<any, any, any> {
  constructor() {
    super(prisma.habit, 'habit');
  }

  async findByUserId(userId: string) {
    return prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive(userId: string) {
    return prisma.habit.findMany({
      where: { userId, active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    userId: string;
    name: string;
    category: string;
    description?: string;
    frequency?: string;
    target?: number;
    unit?: string;
  }) {
    return prisma.habit.create({ data });
  }

  async update(habitId: string, data: {
    name?: string;
    description?: string;
    category?: string;
    frequency?: string;
    target?: number;
    unit?: string;
    active?: boolean;
  }) {
    return prisma.habit.update({ where: { id: habitId }, data });
  }

  async delete(habitId: string) {
    await prisma.habit.delete({ where: { id: habitId } });
  }

  async logHabit(habitLogData: { habitId: string; date: Date; value?: number; note?: string }) {
    return prisma.habitLog.create({ data: habitLogData });
  }

  async getLogs(habitId: string, params?: { from?: Date; to?: Date; skip?: number; take?: number }) {
    const where: Record<string, unknown> = { habitId };
    if (params?.from || params?.to) {
      where.date = {};
      if (params?.from) (where.date as Record<string, unknown>).gte = params.from;
      if (params?.to) (where.date as Record<string, unknown>).lte = params.to;
    }

    return prisma.habitLog.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: params?.skip || 0,
      take: params?.take || 30,
    });
  }

  async getStats(userId: string, period: 'week' | 'month' | 'year') {
    const daysMap: Record<string, number> = { week: 7, month: 30, year: 365 };
    const since = new Date(Date.now() - daysMap[period] * 24 * 60 * 60 * 1000);

    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        logs: {
          where: { date: { gte: since } },
          orderBy: { date: 'desc' },
        },
      },
    });

    return habits.map((h) => ({
      id: h.id,
      name: h.name,
      category: h.category,
      streak: h.streak,
      longestStreak: h.longestStreak,
      totalLogs: h.logs.length,
      completionRate: h.logs.length > 0
        ? Math.round((h.logs.length / daysMap[period]) * 100)
        : 0,
    }));
  }
}

export const habitRepository = new HabitRepository();
