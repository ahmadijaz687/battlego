import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  workoutAnalyticsHandler,
  nutritionAnalyticsHandler,
  healthAnalyticsHandler,
  battleStatsHandler,
  achievementStatsHandler,
  dashboardSummaryHandler,
  getSummaryHandler,
} from '../controllers/analyticsController.js';

const router = Router();

router.get('/workouts', requireAuth, workoutAnalyticsHandler);
router.get('/nutrition', requireAuth, nutritionAnalyticsHandler);
router.get('/health', requireAuth, healthAnalyticsHandler);
router.get('/battles', requireAuth, battleStatsHandler);
router.get('/achievements', requireAuth, achievementStatsHandler);
router.get('/dashboard', requireAuth, dashboardSummaryHandler);
router.get('/summary', requireAuth, getSummaryHandler);

export default router;
