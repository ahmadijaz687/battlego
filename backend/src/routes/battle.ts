import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  getBattlesHandler,
  getBattleByIdHandler,
  createBattleHandler,
  acceptBattleHandler,
  startBattleHandler,
  updateScoreHandler,
  completeBattleHandler,
  getLeaderboardHandler,
  leaveBattleHandler,
  inviteUserHandler,
  getBattleCommentsHandler,
  createBattleCommentHandler,
  updateBattleCommentHandler,
  deleteBattleCommentHandler,
  addBattleReactionHandler,
  removeBattleReactionHandler,
  getBattleParticipantsHandler,
  getBattleProgressHandler,
  updateBattleProgressHandler,
  getBattleHistoryHandler,
  getBattleHistoryByIdHandler,
  getBattleResultsHandler,
} from '../controllers/battleController.js';
import { validate, createBattleSchema, updateScoreSchema } from '../middlewares/validation.js';

const router = Router();

router.get('/', requireAuth, getBattlesHandler);
router.get('/leaderboard', requireAuth, getLeaderboardHandler);
router.get('/history', requireAuth, getBattleHistoryHandler);
router.get('/history/:id', requireAuth, getBattleHistoryByIdHandler);
router.get('/:id', requireAuth, getBattleByIdHandler);
router.post('/', requireAuth, validate(createBattleSchema), createBattleHandler);
router.post('/:battleId/accept', requireAuth, acceptBattleHandler);
router.post('/:battleId/start', requireAuth, startBattleHandler);
router.post('/:battleId/leave', requireAuth, leaveBattleHandler);
router.post('/:battleId/score', requireAuth, validate(updateScoreSchema), updateScoreHandler);
router.post('/:battleId/complete', requireAuth, completeBattleHandler);
router.post('/:battleId/invite', requireAuth, inviteUserHandler);

// Participants & Progress
router.get('/:battleId/participants', requireAuth, getBattleParticipantsHandler);
router.get('/:battleId/progress', requireAuth, getBattleProgressHandler);
router.post('/:battleId/progress', requireAuth, updateBattleProgressHandler);
router.get('/:battleId/results', requireAuth, getBattleResultsHandler);

// Comments
router.get('/:battleId/comments', requireAuth, getBattleCommentsHandler);
router.post('/:battleId/comments', requireAuth, createBattleCommentHandler);
router.put('/:battleId/comments/:commentId', requireAuth, updateBattleCommentHandler);
router.delete('/:battleId/comments/:commentId', requireAuth, deleteBattleCommentHandler);

// Reactions
router.post('/:battleId/react', requireAuth, addBattleReactionHandler);
router.delete('/:battleId/react', requireAuth, removeBattleReactionHandler);

export default router;
