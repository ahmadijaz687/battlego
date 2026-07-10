import { z } from 'zod';
import { validate } from '../middlewares/validation.js';

export const createHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  description: z.string().trim().optional(),
  category: z.string().max(100).trim(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  target: z.number().int().positive().default(1),
  unit: z.string().max(50).trim().optional(),
});

export const updateHabitSchema = createHabitSchema.partial().extend({
  active: z.boolean().optional(),
});

export const habitLogSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  value: z.number().min(0).default(1),
  note: z.string().trim().optional(),
});

export const validateCreateHabit = validate(createHabitSchema);
export const validateUpdateHabit = validate(updateHabitSchema);
export const validateHabitLog = validate(habitLogSchema);
