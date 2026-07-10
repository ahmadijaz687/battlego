import { Request, Response } from 'express';
import * as challengeService from '../services/challengeService.js';
import { successResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export async function getChallengesHandler(_req: Request, res: Response) {
  const challenges = await challengeService.getChallenges();
  res.json(successResponse(challenges));
}

export async function getActiveChallengesHandler(_req: Request, res: Response) {
  const challenges = await challengeService.getActiveChallenges();
  res.json(successResponse(challenges));
}

export async function getChallengeHandler(req: Request, res: Response) {
  const challenge = await challengeService.getChallenge(req.params.challengeId as string);
  res.json(successResponse(challenge));
}

export async function createChallengeHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const challenge = await challengeService.createChallenge(userId, req.body);
  res.status(201).json(successResponse(challenge, 'Challenge created'));
}

export async function joinChallengeHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const participant = await challengeService.joinChallenge(req.params.challengeId as string, userId);
  res.json(successResponse(participant, 'Joined challenge'));
}

export async function getMyChallengesHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const challenges = await challengeService.getUserChallenges(userId);
  res.json(successResponse(challenges));
}

export async function getChallengeLeaderboardHandler(req: Request, res: Response) {
  const leaderboard = await challengeService.getChallengeLeaderboard(req.params.challengeId as string);
  res.json(successResponse(leaderboard));
}
