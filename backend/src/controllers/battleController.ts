import { Request, Response } from 'express';
import * as battleService from '../services/battleService.js';
import { successResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { notifyUser } from '../services/notify.js';

export async function getBattleByIdHandler(req: Request, res: Response) {
  const battleId = req.params.id as string;
  const battle = await battleService.getBattleById(battleId);
  res.json(successResponse(battle));
}

export async function getBattlesHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battles = await battleService.getBattles(userId);
  res.json(successResponse(battles));
}

export async function createBattleHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battle = await battleService.createBattle(userId, req.body);
  res.status(201).json(successResponse(battle, 'Battle created'));

  if (battle.opponentId) {
    void notifyUser(
      battle.opponentId,
      'battle_invite',
      { battleId: battle.id, by: userId },
      'You were invited to a battle'
    );
  }
}

export async function acceptBattleHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battleId = req.params.battleId as string;
  const battle = await battleService.acceptBattle(userId, battleId);
  res.json(successResponse(battle, 'Battle accepted'));
}

export async function startBattleHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battleId = req.params.battleId as string;
  const battle = await battleService.startBattle(userId, battleId);
  res.json(successResponse(battle, 'Battle started'));
}

export async function updateScoreHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battleId = req.params.battleId as string;
  const { score } = req.body;
  const battle = await battleService.updateBattleScore(userId, battleId, score);
  res.json(successResponse(battle, 'Score updated'));
}

export async function completeBattleHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battleId = req.params.battleId as string;
  const battle = await battleService.completeBattle(userId, battleId);
  res.json(successResponse(battle, 'Battle completed'));
}

export async function getLeaderboardHandler(_req: Request, res: Response) {
  const leaderboard = await battleService.getLeaderboard();
  res.json(successResponse(leaderboard));
}

export async function leaveBattleHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battleId = req.params.battleId as string;
  const result = await battleService.leaveBattle(userId, battleId);
  res.json(successResponse(result, 'Left battle'));
}

export async function inviteUserHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battleId = req.params.battleId as string;
  const { receiverId } = req.body;
  const result = await battleService.inviteUser(userId, battleId, receiverId);
  res.json(successResponse(result, 'User invited'));
}

export async function getBattleParticipantsHandler(req: Request, res: Response) {
  const battleId = req.params.battleId as string;
  const participants = await battleService.getBattleParticipants(battleId);
  res.json(successResponse(participants));
}

export async function getBattleProgressHandler(req: Request, res: Response) {
  const battleId = req.params.battleId as string;
  const progress = await battleService.getBattleProgress(battleId);
  res.json(successResponse(progress));
}

export async function updateBattleProgressHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battleId = req.params.battleId as string;
  const { currentValue } = req.body;
  const progress = await battleService.updateBattleProgress(userId, battleId, currentValue);
  res.json(successResponse(progress, 'Progress updated'));
}

export async function getBattleHistoryHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const history = await battleService.getBattleHistory(userId);
  res.json(successResponse(history));
}

export async function getBattleHistoryByIdHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battleId = req.params.id as string;
  const history = await battleService.getBattleHistoryById(userId, battleId);
  res.json(successResponse(history));
}

export async function getBattleResultsHandler(req: Request, res: Response) {
  const battleId = req.params.battleId as string;
  const results = await battleService.getBattleResults(battleId);
  res.json(successResponse(results));
}

export async function getBattleCommentsHandler(req: Request, res: Response) {
  const battleId = req.params.battleId as string;
  const comments = await battleService.getBattleComments(battleId);
  res.json(successResponse(comments));
}

export async function createBattleCommentHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battleId = req.params.battleId as string;
  const { message } = req.body;
  const comment = await battleService.createBattleComment(userId, battleId, message);
  res.status(201).json(successResponse(comment, 'Comment added'));
}

export async function updateBattleCommentHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const commentId = req.params.commentId as string;
  const { message } = req.body;
  const comment = await battleService.updateBattleComment(userId, commentId, message);
  res.json(successResponse(comment, 'Comment updated'));
}

export async function deleteBattleCommentHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const commentId = req.params.commentId as string;
  await battleService.deleteBattleComment(userId, commentId);
  res.json(successResponse(null, 'Comment deleted'));
}

export async function addBattleReactionHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battleId = req.params.battleId as string;
  const { reaction } = req.body;
  const result = await battleService.addBattleReaction(userId, battleId, reaction);
  res.json(successResponse(result, 'Reaction added'));
}

export async function removeBattleReactionHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const battleId = req.params.battleId as string;
  await battleService.removeBattleReaction(userId, battleId);
  res.json(successResponse(null, 'Reaction removed'));
}
