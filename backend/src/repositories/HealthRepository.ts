import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class HealthRepository extends BaseRepository<any, any, any> {
  constructor() {
    super(prisma.sleepLog, 'sleepLog');
  }

  async logSleep(data: {
    userId: string;
    date: Date;
    duration: number;
    quality?: number;
    deepSleep?: number;
    remSleep?: number;
    lightSleep?: number;
    awakeTime?: number;
    source?: string;
  }) {
    return prisma.sleepLog.create({ data });
  }

  async getSleepLogs(userId: string, params?: { from?: Date; to?: Date; skip?: number; take?: number }) {
    const where: Record<string, unknown> = { userId };
    if (params?.from || params?.to) {
      where.date = {};
      if (params?.from) (where.date as Record<string, unknown>).gte = params.from;
      if (params?.to) (where.date as Record<string, unknown>).lte = params.to;
    }

    return prisma.sleepLog.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: params?.skip || 0,
      take: params?.take || 30,
    });
  }

  async logHRV(data: {
    userId: string;
    date: Date;
    hrv: number;
    rmssd?: number;
    sdnn?: number;
    source?: string;
  }) {
    return prisma.hRVLog.create({ data });
  }

  async getHRVLogs(userId: string, params?: { from?: Date; to?: Date; skip?: number; take?: number }) {
    const where: Record<string, unknown> = { userId };
    if (params?.from || params?.to) {
      where.date = {};
      if (params?.from) (where.date as Record<string, unknown>).gte = params.from;
      if (params?.to) (where.date as Record<string, unknown>).lte = params.to;
    }

    return prisma.hRVLog.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: params?.skip || 0,
      take: params?.take || 30,
    });
  }

  async logMood(data: {
    userId: string;
    date: Date;
    mood: number;
    energy?: number;
    stress?: number;
    note?: string;
  }) {
    return prisma.moodLog.create({ data });
  }

  async getMoodLogs(userId: string, params?: { from?: Date; to?: Date; skip?: number; take?: number }) {
    const where: Record<string, unknown> = { userId };
    if (params?.from || params?.to) {
      where.date = {};
      if (params?.from) (where.date as Record<string, unknown>).gte = params.from;
      if (params?.to) (where.date as Record<string, unknown>).lte = params.to;
    }

    return prisma.moodLog.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: params?.skip || 0,
      take: params?.take || 30,
    });
  }

  async getLatestRecoveryScore(userId: string) {
    return prisma.recoveryScore.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async createRecoverySession(data: {
    userId: string;
    date: Date;
    type: string;
    duration: number;
    notes?: string;
    perceivedRecovery?: number;
  }) {
    return prisma.recoverySession.create({ data: data as never });
  }

  async getRecoverySessions(userId: string, params?: { from?: Date; to?: Date; skip?: number; take?: number }) {
    const where: Record<string, unknown> = { userId };
    if (params?.from || params?.to) {
      where.date = {};
      if (params?.from) (where.date as Record<string, unknown>).gte = params.from;
      if (params?.to) (where.date as Record<string, unknown>).lte = params.to;
    }

    return prisma.recoverySession.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: params?.skip || 0,
      take: params?.take || 20,
    });
  }

  async updateRecoveryScore(userId: string, score: number) {
    const existing = await prisma.recoveryScore.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    if (existing) {
      return prisma.recoveryScore.update({
        where: { id: existing.id },
        data: { overall: score },
      });
    }

    return prisma.recoveryScore.create({
      data: {
        userId,
        date: new Date(),
        readiness: score,
        fatigue: 50,
        recovery: score,
        overall: score,
      },
    });
  }
}

export const healthRepository = new HealthRepository();
