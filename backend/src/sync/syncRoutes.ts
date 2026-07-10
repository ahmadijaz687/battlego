import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { z } from 'zod';
import { pullHandler, pushHandler, resolveHandler, genericSyncHandler } from './syncController.js';

const router = Router();

const pullSchema = z.object({
  lastSync: z.string().optional(),
  domains: z.array(z.string()).optional(),
});

const changeSchema = z.object({
  domain: z.string().min(1),
  action: z.enum(['create', 'update', 'delete']),
  entityId: z.string().min(1),
  data: z.record(z.unknown()),
  clientTimestamp: z.string(),
});

const pushSchema = z.object({
  changes: z.array(changeSchema).min(1, 'At least one change is required'),
});

const resolutionSchema = z.object({
  entityId: z.string().min(1),
  strategy: z.enum(['client_wins', 'server_wins', 'merge']),
  mergedData: z.record(z.unknown()).optional(),
});

const resolveSchema = z.object({
  resolutions: z.array(resolutionSchema).min(1, 'At least one resolution is required'),
});

router.post('/pull', requireAuth, validate(pullSchema), pullHandler);
router.post('/push', requireAuth, validate(pushSchema), pushHandler);
router.post('/resolve', requireAuth, validate(resolveSchema), resolveHandler);
router.post('/', requireAuth, genericSyncHandler);

export default router;
