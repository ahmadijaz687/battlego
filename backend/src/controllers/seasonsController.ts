import { Request, Response } from 'express';
import { prisma } from '../services/database.js';
import { successResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export async function listSeasonsHandler(_req: Request, res: Response) {
  const seasons = await prisma.season.findMany({
    orderBy: { startDate: 'desc' },
  });
  res.json(successResponse(seasons));
}

export async function getCurrentSeasonHandler(_req: Request, res: Response) {
  const season = await prisma.season.findFirst({
    where: { active: true },
    orderBy: { startDate: 'desc' },
  });
  if (!season) {
    res.json(successResponse(null, 'No active season'));
    return;
  }
  res.json(successResponse(season));
}

export async function getSeasonByIdHandler(req: Request, res: Response) {
  const seasonId = req.params.id as string;
  const season = await prisma.season.findUnique({
    where: { id: seasonId },
  });
  if (!season) {
    res.status(404).json({ success: false, message: 'Season not found', data: null });
    return;
  }
  res.json(successResponse(season));
}

export async function getCurrentSeasonProgressHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;

  const activeSeason = await prisma.season.findFirst({
    where: { active: true },
    orderBy: { startDate: 'desc' },
  });
  if (!activeSeason) {
    res.json(successResponse(null, 'No active season'));
    return;
  }

  const battlePass = await prisma.battlePass.findUnique({
    where: { userId_seasonId: { userId, seasonId: activeSeason.id } },
  });

  res.json(successResponse(battlePass ?? { tier: 1, xp: 0, premium: false, claimed: [] }));
}

export async function getCurrentSeasonRewardsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;

  const activeSeason = await prisma.season.findFirst({
    where: { active: true },
    orderBy: { startDate: 'desc' },
  });
  if (!activeSeason) {
    res.json(successResponse(null, 'No active season'));
    return;
  }

  const battlePass = await prisma.battlePass.findUnique({
    where: { userId_seasonId: { userId, seasonId: activeSeason.id } },
  });

  res.json(successResponse({
    season: activeSeason,
    battlePass: battlePass ?? { tier: 1, xp: 0, premium: false, claimed: [] },
  }));
}

export async function claimRewardHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const { tier } = req.body;

  const activeSeason = await prisma.season.findFirst({
    where: { active: true },
    orderBy: { startDate: 'desc' },
  });
  if (!activeSeason) {
    res.status(400).json({ success: false, message: 'No active season', data: null });
    return;
  }

  const battlePass = await prisma.battlePass.findUnique({
    where: { userId_seasonId: { userId, seasonId: activeSeason.id } },
  });
  if (!battlePass) {
    res.status(400).json({ success: false, message: 'No battle pass found', data: null });
    return;
  }

  if (battlePass.tier < tier) {
    res.status(400).json({ success: false, message: 'Tier not yet reached', data: null });
    return;
  }

  const claimed = (battlePass.claimed as number[]) || [];
  if (claimed.includes(tier)) {
    res.status(400).json({ success: false, message: 'Reward already claimed', data: null });
    return;
  }

  const updated = await prisma.battlePass.update({
    where: { userId_seasonId: { userId, seasonId: activeSeason.id } },
    data: { claimed: [...claimed, tier] },
  });

  res.json(successResponse(updated, 'Reward claimed'));
}
