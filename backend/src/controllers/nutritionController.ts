import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import {
  getFoods,
  createFood,
  getMeals,
  createMeal,
  updateMeal,
  deleteMeal,
  getWaterLogs,
  createWaterLog,
  updateWaterLog,
  deleteWaterLog,
  getWeightLogs,
  createWeightLog,
  updateWeightLog,
  deleteWeightLog,
  getMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
  getShoppingList,
  createShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  getAnalytics,
} from '../services/nutritionService.js';
import { successResponse } from '../utils/response.js';
import { prisma } from '../services/database.js';
import { emitLeaderboardEntryUpdated, emitBattleScoreUpdated } from '../socket/index.js';
import { logger } from '../utils/logger.js';

async function emitNutritionRealtime(userId: string): Promise<void> {
  try {
    for (const period of ['daily', 'weekly', 'monthly', 'alltime'] as const) {
      emitLeaderboardEntryUpdated('xp', period, { userId });
    }

    const battles = await prisma.battle.findMany({
      where: { status: 'active', OR: [{ creatorId: userId }, { opponentId: userId }] },
      select: { id: true, creatorScore: true, opponentScore: true },
    });
    for (const b of battles) {
      emitBattleScoreUpdated(b.id, {
        userId,
        creatorScore: b.creatorScore,
        opponentScore: b.opponentScore,
      });
    }
  } catch (err) {
    logger.warn('[Nutrition] Failed to emit realtime events', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export const getFoodsHandler = async (_req: Request, res: Response) => {
  const foods = await getFoods();
  res.json(successResponse(foods));
};

export const createFoodHandler = async (req: Request, res: Response) => {
  const food = await createFood(req.body);
  res.status(201).json(successResponse(food, 'Food created'));
};

export const getMealsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const meals = await getMeals(userId);
  res.json(successResponse(meals));
};

export const createMealHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const meal = await createMeal(userId, req.body);
  await emitNutritionRealtime(userId);
  res.status(201).json(successResponse(meal, 'Meal created'));
};

export const updateMealHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const mealId = req.params.mealId as string;
  const meal = await updateMeal(mealId, userId, req.body);
  res.json(successResponse(meal, 'Meal updated'));
};

export const deleteMealHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const mealId = req.params.mealId as string;
  await deleteMeal(mealId, userId);
  res.json(successResponse(null, 'Meal deleted'));
};

export const getWaterLogsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const logs = await getWaterLogs(userId);
  res.json(successResponse(logs));
};

export const createWaterLogHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const log = await createWaterLog(userId, req.body);
  await emitNutritionRealtime(userId);
  res.status(201).json(successResponse(log, 'Water logged'));
};

export const updateWaterLogHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const logId = req.params.logId as string;
  const log = await updateWaterLog(logId, userId, req.body);
  res.json(successResponse(log, 'Water log updated'));
};

export const deleteWaterLogHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const logId = req.params.logId as string;
  await deleteWaterLog(logId, userId);
  res.json(successResponse(null, 'Water log deleted'));
};

export const getWeightLogsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const logs = await getWeightLogs(userId);
  res.json(successResponse(logs));
};

export const createWeightLogHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const log = await createWeightLog(userId, req.body);
  res.status(201).json(successResponse(log, 'Weight logged'));
};

export const updateWeightLogHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const logId = req.params.logId as string;
  const log = await updateWeightLog(logId, userId, req.body);
  res.json(successResponse(log, 'Weight log updated'));
};

export const deleteWeightLogHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const logId = req.params.logId as string;
  await deleteWeightLog(logId, userId);
  res.json(successResponse(null, 'Weight log deleted'));
};

export const getMeasurementsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const measurements = await getMeasurements(userId);
  res.json(successResponse(measurements));
};

export const createMeasurementHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const measurement = await createMeasurement(userId, req.body);
  res.status(201).json(successResponse(measurement, 'Measurement logged'));
};

export const updateMeasurementHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const measurementId = req.params.measurementId as string;
  const measurement = await updateMeasurement(measurementId, userId, req.body);
  res.json(successResponse(measurement, 'Measurement updated'));
};

export const deleteMeasurementHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const measurementId = req.params.measurementId as string;
  await deleteMeasurement(measurementId, userId);
  res.json(successResponse(null, 'Measurement deleted'));
};

export const getShoppingListHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const items = await getShoppingList(userId);
  res.json(successResponse(items));
};

export const createShoppingItemHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const item = await createShoppingItem(userId, req.body);
  res.status(201).json(successResponse(item, 'Shopping item added'));
};

export const updateShoppingItemHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const itemId = req.params.itemId as string;
  const item = await updateShoppingItem(itemId, userId, req.body);
  res.json(successResponse(item, 'Shopping item updated'));
};

export const deleteShoppingItemHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const itemId = req.params.itemId as string;
  await deleteShoppingItem(itemId, userId);
  res.json(successResponse(null, 'Shopping item deleted'));
};

export const getAnalyticsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const analytics = await getAnalytics(userId);
  res.json(successResponse(analytics));
};
