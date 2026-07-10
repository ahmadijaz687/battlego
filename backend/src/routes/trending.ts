import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  trendingPostsHandler,
  trendingWorkoutsHandler,
  trendingUsersHandler,
} from '../controllers/trendingController.js';

const router = Router();

router.get('/posts', requireAuth, trendingPostsHandler);
router.get('/workouts', requireAuth, trendingWorkoutsHandler);
router.get('/users', requireAuth, trendingUsersHandler);

export default router;
