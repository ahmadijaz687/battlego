import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middlewares/auth.js';
import { validate, pushTokenSchema } from '../middlewares/validation.js';
import {
  searchUsersHandler,
  getUserByIdHandler,
  getUserProfileHandler,
  getUserStatisticsHandler,
  getUserAchievementsHandler,
  getUserBadgesHandler,
  getUserWorkoutsHandler,
  getUserBattlesHandler,
  getFollowersHandler,
  getFollowingHandler,
  followUserHandler,
  unfollowUserHandler,
  blockUserHandler,
  unblockUserHandler,
  reportUserHandler,
  registerPushTokenHandler,
  exportUserDataHandler,
} from '../controllers/usersController.js';

const router = Router();
const reportUserSchema = z.object({ reason: z.string().min(1) }).passthrough();

router.get('/search', requireAuth, searchUsersHandler);
router.get('/:id', requireAuth, getUserByIdHandler);
router.get('/:id/profile', requireAuth, getUserProfileHandler);
router.get('/:id/statistics', requireAuth, getUserStatisticsHandler);
router.get('/:id/achievements', requireAuth, getUserAchievementsHandler);
router.get('/:id/badges', requireAuth, getUserBadgesHandler);
router.get('/:id/workouts', requireAuth, getUserWorkoutsHandler);
router.get('/:id/battles', requireAuth, getUserBattlesHandler);
router.get('/:id/followers', requireAuth, getFollowersHandler);
router.get('/:id/following', requireAuth, getFollowingHandler);
router.post('/:id/follow', requireAuth, followUserHandler);
router.delete('/:id/follow', requireAuth, unfollowUserHandler);
router.post('/:id/block', requireAuth, blockUserHandler);
router.delete('/:id/block', requireAuth, unblockUserHandler);
router.post('/:id/report', requireAuth, validate(reportUserSchema), reportUserHandler);
router.post('/push-token', requireAuth, validate(pushTokenSchema), registerPushTokenHandler);
router.get('/export', requireAuth, exportUserDataHandler);

export default router;
