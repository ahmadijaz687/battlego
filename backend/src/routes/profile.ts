import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  getProfileHandler,
  updateProfileHandler,
  getSettingsHandler,
  updateSettingsHandler,
  getProfileDetailsHandler,
  updateProfileDetailsHandler,
  completeOnboardingHandler,
  getOnboardingStatusHandler,
  getProfileStatsHandler,
  updateAvatarHandler,
} from '../controllers/profileController.js';
import {
  validate,
  updateProfileSchema,
  updateSettingsSchema,
  updateProfileDetailsSchema,
  onboardingSchema,
} from '../middlewares/validation.js';

const router = Router();

router.get('/', requireAuth, getProfileHandler);
router.put('/', requireAuth, validate(updateProfileSchema), updateProfileHandler);
router.get('/settings', requireAuth, getSettingsHandler);
router.put('/settings', requireAuth, validate(updateSettingsSchema), updateSettingsHandler);
router.get('/details', requireAuth, getProfileDetailsHandler);
router.put('/details', requireAuth, validate(updateProfileDetailsSchema), updateProfileDetailsHandler);
router.get('/stats', requireAuth, getProfileStatsHandler);
router.put('/avatar', requireAuth, updateAvatarHandler);
router.post('/onboarding', requireAuth, validate(onboardingSchema), completeOnboardingHandler);
router.get('/onboarding/status', requireAuth, getOnboardingStatusHandler);

export default router;
