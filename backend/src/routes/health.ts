import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  getSleepLogsHandler,
  logSleepHandler,
  getHRVLogsHandler,
  logHRVHandler,
  getMoodLogsHandler,
  logMoodHandler,
  getHealthSummaryHandler,
  getReadinessHandler,
  syncHealthDataHandler,
  getHealthDataSummaryHandler,
} from '../controllers/healthController.js';
import { validate, logSleepSchema, logHRVSchema, logMoodSchema, healthSyncSchema } from '../middlewares/validation.js';

const router = Router();

router.get('/readiness', requireAuth, getReadinessHandler);
router.get('/summary', requireAuth, getHealthSummaryHandler);

router.post('/sync', requireAuth, validate(healthSyncSchema), syncHealthDataHandler);
router.get('/metrics/summary', requireAuth, getHealthDataSummaryHandler);

router.get('/sleep', requireAuth, getSleepLogsHandler);
router.post('/sleep', requireAuth, validate(logSleepSchema), logSleepHandler);

router.get('/hrv', requireAuth, getHRVLogsHandler);
router.post('/hrv', requireAuth, validate(logHRVSchema), logHRVHandler);

router.get('/mood', requireAuth, getMoodLogsHandler);
router.post('/mood', requireAuth, validate(logMoodSchema), logMoodHandler);

export default router;
