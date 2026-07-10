import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  getDailyMissionsHandler,
  claimDailyMissionHandler,
  getWeeklyMissionsHandler,
  claimWeeklyMissionHandler,
  getMonthlyMissionsHandler,
  claimMonthlyMissionHandler,
} from '../controllers/missionsController.js';

const router = Router();

router.get('/daily', requireAuth, getDailyMissionsHandler);
router.post('/daily/:id/claim', requireAuth, claimDailyMissionHandler);
router.get('/weekly', requireAuth, getWeeklyMissionsHandler);
router.post('/weekly/:id/claim', requireAuth, claimWeeklyMissionHandler);
router.get('/monthly', requireAuth, getMonthlyMissionsHandler);
router.post('/monthly/:id/claim', requireAuth, claimMonthlyMissionHandler);

export default router;
