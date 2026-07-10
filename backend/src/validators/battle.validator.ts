import { z } from 'zod';
import { validate } from '../middlewares/validation.js';

export const createBattleSchema = z.object({
  type: z.string().min(1, 'Battle type is required').max(100).trim(),
  opponentId: z.string().uuid('Valid opponent ID is required'),
});

export const updateScoreSchema = z.object({
  score: z.number().min(0, 'Score must be non-negative'),
});

export const validateCreateBattle = validate(createBattleSchema);
export const validateUpdateScore = validate(updateScoreSchema);
