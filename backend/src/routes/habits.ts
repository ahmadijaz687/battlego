import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  getHabitsHandler,
  getActiveHabitsHandler,
  createHabitHandler,
  updateHabitHandler,
  deleteHabitHandler,
  logHabitHandler,
  getHabitLogsHandler,
  getHabitStatsHandler,
} from '../controllers/habitController.js';
import { validate, createHabitSchema, updateHabitSchema, logHabitSchema } from '../middlewares/validation.js';

const router = Router();

router.get('/', requireAuth, getHabitsHandler);
router.get('/active', requireAuth, getActiveHabitsHandler);
router.get('/stats', requireAuth, getHabitStatsHandler);
router.post('/', requireAuth, validate(createHabitSchema), createHabitHandler);
router.put('/:habitId', requireAuth, validate(updateHabitSchema), updateHabitHandler);
router.delete('/:habitId', requireAuth, deleteHabitHandler);
router.post('/:habitId/log', requireAuth, validate(logHabitSchema), logHabitHandler);
router.get('/:habitId/logs', requireAuth, getHabitLogsHandler);

export default router;
