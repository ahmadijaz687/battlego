import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  searchPostsHandler,
  searchUsersHandler,
  searchWorkoutsHandler,
  searchExercisesHandler,
  searchFoodsHandler,
  searchBattlesHandler,
  searchMessagesHandler,
  searchCommunitiesHandler,
} from '../controllers/searchController.js';

const router = Router();

router.get('/posts', requireAuth, searchPostsHandler);
router.get('/users', requireAuth, searchUsersHandler);
router.get('/workouts', requireAuth, searchWorkoutsHandler);
router.get('/exercises', requireAuth, searchExercisesHandler);
router.get('/foods', requireAuth, searchFoodsHandler);
router.get('/battles', requireAuth, searchBattlesHandler);
router.get('/messages', requireAuth, searchMessagesHandler);
router.get('/communities', requireAuth, searchCommunitiesHandler);

export default router;
