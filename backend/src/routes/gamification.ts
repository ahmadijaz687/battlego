import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  getAchievementsHandler,
  getUserAchievementsHandler,
  unlockAchievementHandler,
  getGamificationProfileHandler,
  getUserLevelHandler,
  getLeaderboardHandler,
  getActiveSeasonHandler,
  getSeasonsHandler,
  getBattlePassHandler,
  claimBattlePassRewardHandler,
  upgradeBattlePassHandler,
} from '../controllers/gamificationController.js';
import {
  validate,
  claimBattlePassRewardSchema,
} from '../middlewares/validation.js';

const router = Router();

// Achievements
router.get('/achievements', requireAuth, getAchievementsHandler);
router.get('/achievements/mine', requireAuth, getUserAchievementsHandler);
router.post('/achievements/:achievementName/unlock', requireAuth, unlockAchievementHandler);

// Profile
router.get('/me', requireAuth, getGamificationProfileHandler);

// Levels
router.get('/level', requireAuth, getUserLevelHandler);
router.get('/leaderboard', requireAuth, getLeaderboardHandler);

// Seasons
router.get('/seasons/active', requireAuth, getActiveSeasonHandler);
router.get('/seasons', requireAuth, getSeasonsHandler);

// Battle Pass
router.get('/battle-pass', requireAuth, getBattlePassHandler);
router.post('/battle-pass/claim', requireAuth, validate(claimBattlePassRewardSchema), claimBattlePassRewardHandler);
router.post('/battle-pass/upgrade', requireAuth, upgradeBattlePassHandler);

export default router;
