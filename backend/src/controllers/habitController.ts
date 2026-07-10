import { Request, Response } from 'express';
import * as habitService from '../services/habitService.js';
import { successResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export async function getHabitsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const habits = await habitService.getHabits(userId);
  res.json(successResponse(habits));
}

export async function getActiveHabitsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const habits = await habitService.getActiveHabits(userId);
  res.json(successResponse(habits));
}

export async function createHabitHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const habit = await habitService.createHabit(userId, req.body);
  res.status(201).json(successResponse(habit, 'Habit created'));
}

export async function updateHabitHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const habit = await habitService.updateHabit(req.params.habitId as string, userId, req.body);
  res.json(successResponse(habit, 'Habit updated'));
}

export async function deleteHabitHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  await habitService.deleteHabit(req.params.habitId as string, userId);
  res.json(successResponse(null, 'Habit deleted'));
}

export async function logHabitHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const log = await habitService.logHabit(req.params.habitId as string, userId, req.body);
  res.json(successResponse(log, 'Habit logged'));
}

export async function getHabitLogsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
  const logs = await habitService.getHabitLogs(req.params.habitId as string, userId, days);
  res.json(successResponse(logs));
}

export async function getHabitStatsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const stats = await habitService.getHabitStats(userId);
  res.json(successResponse(stats));
}
