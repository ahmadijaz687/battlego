import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { validate, claimBattlePassRewardSchema } from '../middlewares/validation.js';
import {
  listSeasonsHandler,
  getCurrentSeasonHandler,
  getSeasonByIdHandler,
  getCurrentSeasonProgressHandler,
  getCurrentSeasonRewardsHandler,
  claimRewardHandler,
} from '../controllers/seasonsController.js';

const router = Router();

router.get('/', requireAuth, listSeasonsHandler);
router.get('/current', requireAuth, getCurrentSeasonHandler);
router.get('/current/progress', requireAuth, getCurrentSeasonProgressHandler);
router.get('/current/rewards', requireAuth, getCurrentSeasonRewardsHandler);
router.post('/current/rewards/claim', requireAuth, validate(claimBattlePassRewardSchema), claimRewardHandler);
router.get('/:id', requireAuth, getSeasonByIdHandler);

export default router;
