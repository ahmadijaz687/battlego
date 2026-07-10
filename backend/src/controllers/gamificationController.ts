import { Request, Response } from 'express';
import * as gamificationService from '../services/gamificationService.js';
import { successResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

// ACHIEVEMENTS
export async function getAchievementsHandler(_req: Request, res: Response) {
  const achievements = await gamificationService.getAchievements();
  res.json(successResponse(achievements));
}

export async function getUserAchievementsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const achievements = await gamificationService.getUserAchievements(userId);
  res.json(successResponse(achievements));
}

export async function unlockAchievementHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const result = await gamificationService.unlockAchievement(userId, req.params.achievementName as string);
  res.json(successResponse(result, 'Achievement unlocked'));
}

// LEVELS
export async function getUserLevelHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const level = await gamificationService.getUserLevel(userId);
  res.json(successResponse(level));
}

// GAMIFICATION PROFILE
export async function getGamificationProfileHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const profile = await gamificationService.getGamificationProfile(userId);
  res.json(successResponse(profile));
}

// BADGES CATALOG (public)
export async function getBadgesHandler(_req: Request, res: Response) {
  const badges = await gamificationService.getBadges();
  res.json(successResponse(badges));
}

export async function getLeaderboardHandler(_req: Request, res: Response) {
  const leaderboard = await gamificationService.getLeaderboard();
  res.json(successResponse(leaderboard));
}

// SEASONS
export async function getActiveSeasonHandler(_req: Request, res: Response) {
  const season = await gamificationService.getActiveSeason();
  res.json(successResponse(season));
}

export async function getSeasonsHandler(_req: Request, res: Response) {
  const seasons = await gamificationService.getSeasons();
  res.json(successResponse(seasons));
}

// BATTLE PASS
export async function getBattlePassHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battlePass = await gamificationService.getBattlePass(userId);
  if (!battlePass) {
    res.json(successResponse(null, 'No active season'));
    return;
  }
  res.json(successResponse(battlePass));
}

export async function claimBattlePassRewardHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const result = await gamificationService.claimBattlePassReward(userId, req.body.tier);
  res.json(successResponse(result, 'Reward claimed'));
}

export async function upgradeBattlePassHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battlePass = await gamificationService.upgradeBattlePass(userId);
  res.json(successResponse(battlePass, 'Battle pass upgraded'));
}
