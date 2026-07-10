import { Server, Socket } from 'socket.io';
import { prisma } from '../services/database.js';
import { appCache } from '../cache/index.js';
import type { AuthenticatedSocket } from './index.js';
import { leaderboardKey } from '../cache/keys.js';
import { logger } from '../utils/logger.js';

type LeaderboardType = 'xp' | 'strength' | 'cardio' | 'hybrid' | 'streak' | 'friends';
type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'alltime';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string | null;
  value: number;
}

let leaderboardIo: Server | null = null;

export function setupLeaderboardNamespace(io: Server): void {
  leaderboardIo = io;
  const leaderboardNamespace = io.of('/leaderboard');

  leaderboardNamespace.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const userId = authSocket.userId!;

    socket.join(`user:${userId}`);

    socket.on('leaderboard:subscribe', async (data: { type: LeaderboardType; period: LeaderboardPeriod }) => {
      const room = `leaderboard:${data.type}:${data.period}`;
      socket.join(room);
      socket.emit('leaderboard:subscribed', { type: data.type, period: data.period });

      try {
        const entries = await fetchLeaderboard(data.type, data.period);
        socket.emit('leaderboard:data', { type: data.type, period: data.period, entries });
      } catch (error) {
        logger.error('[Leaderboard] Failed to fetch data:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('leaderboard:unsubscribe', (data: { type: LeaderboardType; period: LeaderboardPeriod }) => {
      socket.leave(`leaderboard:${data.type}:${data.period}`);
      socket.emit('leaderboard:unsubscribed', { type: data.type, period: data.period });
    });

    socket.on('leaderboard:getRankings', async (data: { type: LeaderboardType; period: LeaderboardPeriod }) => {
      try {
        const entries = await fetchLeaderboard(data.type, data.period);
        socket.emit('leaderboard:data', { type: data.type, period: data.period, entries });
      } catch (error) {
        logger.error('[Leaderboard] Failed to get rankings:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to fetch leaderboard' });
      }
    });

    socket.on('leaderboard:myRank', async (data: { type: LeaderboardType; period: LeaderboardPeriod }) => {
      try {
        const entries = await fetchLeaderboard(data.type, data.period);
        const myEntry = entries.find((e) => e.userId === userId);
        socket.emit('leaderboard:myRank', {
          type: data.type,
          period: data.period,
          rank: myEntry?.rank || null,
          value: myEntry?.value || 0,
          total: entries.length,
        });
      } catch (error) {
        logger.error('[Leaderboard] Failed to get my rank:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('leaderboard:friendRankings', async (data: { type: LeaderboardType; period: LeaderboardPeriod }) => {
      try {
        const friendIds = await prisma.friend.findMany({
          where: { userId },
          select: { friendId: true },
        });

        const userIds = [userId, ...friendIds.map((f) => f.friendId)];
        const allEntries = await fetchLeaderboard(data.type, data.period);
        const friendEntries = allEntries.filter((e) => userIds.includes(e.userId));

        socket.emit('leaderboard:friendRankings', {
          type: data.type,
          period: data.period,
          entries: friendEntries,
        });
      } catch (error) {
        logger.error('[Leaderboard] Failed to get friend rankings:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('leaderboard:broadcastUpdate', async (data: {
      type: LeaderboardType;
      period: LeaderboardPeriod;
      entry: LeaderboardEntry;
    }) => {
      leaderboardNamespace
        .to(`leaderboard:${data.type}:${data.period}`)
        .emit('leaderboard:entryUpdated', {
          type: data.type,
          period: data.period,
          entry: data.entry,
        });
    });

    socket.on('disconnect', () => {
    });
  });
}

export function emitLeaderboardEntryUpdated(
  type: LeaderboardType,
  period: LeaderboardPeriod,
  entry: Partial<LeaderboardEntry> & { userId: string },
): void {
  if (!leaderboardIo) return;
  void appCache.delete(leaderboardKey(type, period));
  leaderboardIo
    .of('/leaderboard')
    .to(`leaderboard:${type}:${period}`)
    .emit('leaderboard:entryUpdated', { type, period, entry });
}

async function fetchLeaderboard(type: LeaderboardType, period: LeaderboardPeriod): Promise<LeaderboardEntry[]> {
  const cacheKey = leaderboardKey(type, period);
  const cached = await appCache.get<LeaderboardEntry[]>(cacheKey);
  if (cached) return cached;

  const entries: LeaderboardEntry[] = [];

  switch (type) {
    case 'xp': {
      const levels = await prisma.userLevel.findMany({
        orderBy: { totalXp: 'desc' },
        take: 100,
        include: { user: { select: { id: true, name: true, avatar: true } } },
      });
      entries.push(...levels.map((l, i) => ({
        rank: i + 1,
        userId: l.userId,
        username: l.user.name || 'Unknown',
        avatar: l.user.avatar,
        value: l.totalXp,
      })));
      break;
    }
    case 'strength':
    case 'cardio':
    case 'hybrid': {
      const workouts = await prisma.workout.findMany({
        where: {
          type: type as 'strength' | 'cardio' | 'hybrid',
          completedAt: { not: null },
          ...(period !== 'alltime' ? {
            completedAt: { gte: getPeriodStart(period) },
          } : {}),
        },
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { duration: 'desc' },
        take: 100,
      });

      const seen = new Set<string>();
      for (const w of workouts) {
        if (seen.has(w.userId)) continue;
        seen.add(w.userId);
        entries.push({
          rank: seen.size,
          userId: w.userId,
          username: w.user.name || 'Unknown',
          avatar: w.user.avatar,
          value: w.duration,
        });
      }
      break;
    }
    case 'streak': {
      const habits = await prisma.habit.groupBy({
        by: ['userId'],
        _max: { streak: true },
        orderBy: { _max: { streak: 'desc' } },
        take: 100,
      });

      for (let i = 0; i < habits.length; i++) {
        const user = await prisma.user.findUnique({
          where: { id: habits[i].userId },
          select: { id: true, name: true, avatar: true },
        });
        if (user) {
          entries.push({
            rank: i + 1,
            userId: user.id,
            username: user.name || 'Unknown',
            avatar: user.avatar,
            value: habits[i]._max.streak || 0,
          });
        }
      }
      break;
    }
    case 'friends': {
      const levels = await prisma.userLevel.findMany({
        orderBy: { totalXp: 'desc' },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      });
      entries.push(...levels.map((l, i) => ({
        rank: i + 1,
        userId: l.userId,
        username: l.user.name || 'Unknown',
        avatar: l.user.avatar,
        value: l.totalXp,
      })));
      break;
    }
  }

  await appCache.set(cacheKey, entries, { ttl: 60000 });
  return entries;
}

function getPeriodStart(period: LeaderboardPeriod): Date {
  const now = new Date();
  switch (period) {
    case 'daily':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'weekly': {
      const day = now.getDay();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    }
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'alltime':
      return new Date(0);
  }
}
