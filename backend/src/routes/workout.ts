import { Router } from 'express';
import {
  getExercisesHandler,
  getTemplatesHandler,
  getWorkoutTemplateByIdHandler,
  getWorkoutHistoryHandler,
  getPersonalRecordsHandler,
  getAnalyticsHandler,
  createWorkoutHandler,
  createCustomWorkoutHandler,
  startWorkoutHandler,
  completeSetHandler,
  completeWorkoutHandler,
  getWorkoutSessionHandler,
  getCurrentSessionHandler,
  syncWorkoutLogsHandler,
} from '../controllers/workoutController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate, createWorkoutSchema, createCustomWorkoutSchema, completeSetSchema } from '../middlewares/validation.js';

const router = Router();

router.get('/exercises', getExercisesHandler);
router.get('/templates', getTemplatesHandler);
router.get('/templates/:id', getWorkoutTemplateByIdHandler);
router.get('/session', requireAuth, getCurrentSessionHandler);
router.get('/history', requireAuth, getWorkoutHistoryHandler);
router.get('/records', requireAuth, getPersonalRecordsHandler);
router.get('/analytics', requireAuth, getAnalyticsHandler);
router.get('/:workoutId', requireAuth, getWorkoutSessionHandler);
router.post('/', requireAuth, validate(createWorkoutSchema), createWorkoutHandler);
router.post('/custom', requireAuth, validate(createCustomWorkoutSchema), createCustomWorkoutHandler);
router.post('/logs', requireAuth, syncWorkoutLogsHandler);
router.post('/:workoutId/start', requireAuth, startWorkoutHandler);
router.post('/:workoutId/sets/:setId/complete', requireAuth, validate(completeSetSchema), completeSetHandler);
router.post('/:workoutId/complete', requireAuth, completeWorkoutHandler);

export default router;