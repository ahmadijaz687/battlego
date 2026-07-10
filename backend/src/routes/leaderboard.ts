import { Router } from 'express';
import { getLeaderboardHandler, getLeaderboardMeHandler } from '../controllers/leaderboardController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', getLeaderboardHandler);
router.get('/me', requireAuth, getLeaderboardMeHandler);

export default router;
