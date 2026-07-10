import { Request, Response } from 'express';
import { prisma } from '../services/database.js';
import { successResponse } from '../utils/response.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

type Metric = 'workouts' | 'calories' | 'strength' | 'cardio';

interface ValueRow {
  userId: string;
  value: number;
}

async function getValuesForMetric(metric: Metric): Promise<ValueRow[]> {
  switch (metric) {
    case 'workouts': {
      const grouped = await prisma.workout.groupBy({ by: ['userId'], _count: { _all: true } });
      return grouped.map((r) => ({ userId: r.userId, value: r._count._all }));
    }
    case 'calories': {
      const rows = await prisma.$queryRawUnsafe<ValueRow[]>(
        `SELECT mf.userId AS userId, COALESCE(SUM(mf.quantity * f.calories), 0) AS value
         FROM meal_foods mf
         JOIN foods f ON f.id = mf.foodId
         GROUP BY mf.userId`
      );
      return rows.map((r) => ({ userId: String(r.userId), value: Number(r.value) || 0 }));
    }
    case 'strength': {
      const grouped = await prisma.personalRecord.groupBy({ by: ['userId'], _sum: { value: true } });
      return grouped.map((r) => ({ userId: r.userId, value: r._sum.value ?? 0 }));
    }
    case 'cardio': {
      const grouped = await prisma.workout.groupBy({ by: ['userId'], where: { type: 'cardio' }, _count: { _all: true } });
      return grouped.map((r) => ({ userId: r.userId, value: r._count._all }));
    }
    default:
      return [];
  }
}

function rankRows(rows: ValueRow[]): Array<ValueRow & { rank: number }> {
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  return sorted.map((r, i) => ({ ...r, rank: i + 1 }));
}

export const getLeaderboardHandler = async (req: Request, res: Response) => {
  const metric = ((req.query.metric as Metric) || 'workouts') as Metric;
  const valid: Metric[] = ['workouts', 'calories', 'strength', 'cardio'];
  if (!valid.includes(metric)) {
    return res.status(400).json(successResponse(null, 'Invalid metric', { valid }));
  }

  const ranked = rankRows(await getValuesForMetric(metric));
  const top = ranked.slice(0, 20);
  const ids = top.map((r) => r.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, avatar: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  const entries = top.map((r) => ({
    rank: r.rank,
    userId: r.userId,
    name: userMap.get(r.userId)?.name ?? null,
    avatar: userMap.get(r.userId)?.avatar ?? null,
    value: r.value,
  }));

  res.json(successResponse({ metric, entries, total: ranked.length }));
};

export const getLeaderboardMeHandler = async (req: Request, res: Response) => {
  const metric = ((req.query.metric as Metric) || 'workouts') as Metric;
  const userId = (req as AuthenticatedRequest).user!.id;
  const valid: Metric[] = ['workouts', 'calories', 'strength', 'cardio'];
  if (!valid.includes(metric)) {
    return res.status(400).json(successResponse(null, 'Invalid metric', { valid }));
  }

  const rows = await getValuesForMetric(metric);
  const mine = rows.find((r) => r.userId === userId);
  const myValue = mine?.value ?? 0;
  const betterCount = rows.filter((r) => r.value > myValue).length;
  const rank = rows.length === 0 ? 0 : betterCount + 1;

  res.json(successResponse({ metric, rank, value: myValue, total: rows.length }));
};
