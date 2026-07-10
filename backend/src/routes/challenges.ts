import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  getChallengesHandler,
  getActiveChallengesHandler,
  getChallengeHandler,
  createChallengeHandler,
  joinChallengeHandler,
  getMyChallengesHandler,
  getChallengeLeaderboardHandler,
} from '../controllers/challengeController.js';
import { validate, createChallengeSchema } from '../middlewares/validation.js';

const router = Router();

router.get('/', requireAuth, getChallengesHandler);
router.get('/active', requireAuth, getActiveChallengesHandler);
router.get('/mine', requireAuth, getMyChallengesHandler);
router.get('/:challengeId', requireAuth, getChallengeHandler);
router.get('/:challengeId/leaderboard', requireAuth, getChallengeLeaderboardHandler);
router.post('/', requireAuth, validate(createChallengeSchema), createChallengeHandler);
router.post('/:challengeId/join', requireAuth, joinChallengeHandler);

export default router;
