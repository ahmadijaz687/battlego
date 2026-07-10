import { Request, Response } from 'express';
import { prisma } from '../services/database.js';
import * as workoutService from '../services/workoutService.js';
import * as nutritionService from '../services/nutritionService.js';
import * as healthService from '../services/healthService.js';
import * as battleService from '../services/battleService.js';
import * as gamificationService from '../services/gamificationService.js';
import { successResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export async function workoutAnalyticsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const analytics = await workoutService.getAnalytics(userId);
  res.json(successResponse(analytics));
}

export async function nutritionAnalyticsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const analytics = await nutritionService.getAnalytics(userId);
  res.json(successResponse(analytics));
}

export async function healthAnalyticsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
  const analytics = await healthService.getHealthSummary(userId, days);
  res.json(successResponse(analytics));
}

export async function battleStatsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const stats = await battleService.getBattleStats(userId);
  res.json(successResponse(stats));
}

export async function achievementStatsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const achievements = await gamificationService.getUserAchievements(userId);
  res.json(successResponse(achievements));
}

export async function dashboardSummaryHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const [workouts, nutrition, health, battles, achievements, level] = await Promise.all([
    workoutService.getAnalytics(userId),
    nutritionService.getAnalytics(userId).catch(() => null),
    healthService.getHealthSummary(userId, 7).catch(() => null),
    battleService.getBattleStats(userId).catch(() => null),
    gamificationService.getUserAchievements(userId).catch(() => null),
    gamificationService.getUserLevel(userId).catch(() => null),
  ]);

  res.json(successResponse({
    workouts,
    nutrition,
    health,
    battles,
    achievements,
    level,
  }));
}

export const getSummaryHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    workoutsThisWeek,
    totalWorkouts,
    personalRecordsCount,
    battlesActive,
  ] = await Promise.all([
    prisma.workout.count({ where: { userId, createdAt: { gte: weekStart } } }),
    prisma.workout.count({ where: { userId } }),
    prisma.personalRecord.count({ where: { userId } }),
    prisma.battle.count({
      where: {
        status: 'active',
        OR: [{ creatorId: userId }, { opponentId: userId }],
      },
    }),
  ]);

  const habits = await prisma.habit.findMany({
    where: { userId },
    select: { streak: true, longestStreak: true },
  });
  const currentStreakDays = habits.reduce((max, h) => Math.max(max, h.streak, h.longestStreak), 0);

  const caloriesRows = await prisma.$queryRawUnsafe<{ value: number }[]>(
    `SELECT COALESCE(SUM(mf.quantity * f.calories), 0) AS value
     FROM meal_foods mf
     JOIN foods f ON f.id = mf.foodId
     JOIN meals m ON m.id = mf.mealId
     WHERE m.userId = ? AND m.date >= ?`,
    userId,
    weekStart
  );
  const caloriesThisWeek = Number(caloriesRows?.[0]?.value ?? 0) || 0;

  res.json(
    successResponse({
      workoutsThisWeek,
      totalWorkouts,
      caloriesThisWeek,
      currentStreakDays,
      personalRecordsCount,
      battlesActive,
    }, 'Analytics summary')
  );
}
