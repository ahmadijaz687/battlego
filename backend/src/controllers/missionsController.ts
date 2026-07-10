import { Request, Response } from 'express';
import { prisma } from '../services/database.js';
import { successResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export async function getDailyMissionsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const { start, end } = getTodayRange();

  let missions = await prisma.dailyMission.findFirst({
    where: { userId, missionDate: { gte: start, lte: end } },
  });

  if (!missions) {
    missions = await prisma.dailyMission.create({
      data: { userId, missionDate: start, missions: [] },
    });
  }

  res.json(successResponse(missions));
}

export async function claimDailyMissionHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const missionId = req.params.id as string;

  const mission = await prisma.dailyMission.findUnique({ where: { id: missionId } });
  if (!mission || mission.userId !== userId) {
    res.status(404).json({ success: false, message: 'Mission not found', data: null });
    return;
  }
  if (mission.rewardClaimed) {
    res.status(400).json({ success: false, message: 'Reward already claimed', data: null });
    return;
  }
  if (!mission.completed) {
    res.status(400).json({ success: false, message: 'Mission not yet completed', data: null });
    return;
  }

  const updated = await prisma.dailyMission.update({
    where: { id: missionId },
    data: { rewardClaimed: true },
  });

  res.json(successResponse(updated, 'Reward claimed'));
}

export async function getWeeklyMissionsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const now = new Date();
  const week = Math.ceil((now.getDate() - now.getDay() + 1) / 7);
  const year = now.getFullYear();

  let missions = await prisma.weeklyMission.findUnique({
    where: { userId_week_year: { userId, week, year } },
  });

  if (!missions) {
    missions = await prisma.weeklyMission.create({
      data: { userId, week, year, missions: [] },
    });
  }

  res.json(successResponse(missions));
}

export async function claimWeeklyMissionHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const missionId = req.params.id as string;

  const mission = await prisma.weeklyMission.findUnique({ where: { id: missionId } });
  if (!mission || mission.userId !== userId) {
    res.status(404).json({ success: false, message: 'Mission not found', data: null });
    return;
  }
  if (mission.rewardClaimed) {
    res.status(400).json({ success: false, message: 'Reward already claimed', data: null });
    return;
  }
  if (!mission.completed) {
    res.status(400).json({ success: false, message: 'Mission not yet completed', data: null });
    return;
  }

  const updated = await prisma.weeklyMission.update({
    where: { id: missionId },
    data: { rewardClaimed: true },
  });

  res.json(successResponse(updated, 'Reward claimed'));
}

export async function getMonthlyMissionsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let missions = await prisma.monthlyMission.findUnique({
    where: { userId_month_year: { userId, month, year } },
  });

  if (!missions) {
    missions = await prisma.monthlyMission.create({
      data: { userId, month, year, missions: [] },
    });
  }

  res.json(successResponse(missions));
}

export async function claimMonthlyMissionHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const missionId = req.params.id as string;

  const mission = await prisma.monthlyMission.findUnique({ where: { id: missionId } });
  if (!mission || mission.userId !== userId) {
    res.status(404).json({ success: false, message: 'Mission not found', data: null });
    return;
  }
  if (mission.rewardClaimed) {
    res.status(400).json({ success: false, message: 'Reward already claimed', data: null });
    return;
  }
  if (!mission.completed) {
    res.status(400).json({ success: false, message: 'Mission not yet completed', data: null });
    return;
  }

  const updated = await prisma.monthlyMission.update({
    where: { id: missionId },
    data: { rewardClaimed: true },
  });

  res.json(successResponse(updated, 'Reward claimed'));
}
