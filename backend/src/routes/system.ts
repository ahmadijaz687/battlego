import { Router } from 'express';
import {
  getSystemStatusHandler,
  healthCheckHandler,
  getAppVersionHandler,
  getSystemConfigHandler,
  getFeatureFlagsHandler,
} from '../controllers/systemController.js';

const router = Router();

router.get('/status', getSystemStatusHandler);
router.get('/health', healthCheckHandler);
router.get('/version', getAppVersionHandler);
router.get('/config', getSystemConfigHandler);
router.get('/features', getFeatureFlagsHandler);

export default router;
