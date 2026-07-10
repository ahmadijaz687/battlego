import { z } from 'zod';
import { validate } from '../middlewares/validation.js';

export const createChallengeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  description: z.string().min(1).trim(),
  type: z.string().max(100).trim(),
  goal: z.record(z.unknown()),
  reward: z.record(z.unknown()).default({}),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

export const validateCreateChallenge = validate(createChallengeSchema);
