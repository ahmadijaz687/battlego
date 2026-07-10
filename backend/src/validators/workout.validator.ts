import { z } from 'zod';
import { validate } from '../middlewares/validation.js';

export const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  type: z.enum(['strength', 'cardio', 'hybrid']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number().int().positive('Duration must be positive'),
  sections: z.array(z.object({
    type: z.enum(['warmup', 'main', 'cooldown']),
    name: z.string().min(1).max(255).trim(),
    order: z.number().int().min(0).default(0),
    exercises: z.array(z.object({
      exerciseId: z.string().uuid(),
      name: z.string().min(1).max(255).trim(),
      order: z.number().int().min(0).default(0),
    })).optional(),
  })).optional(),
});

export const updateWorkoutSchema = createWorkoutSchema.partial();

export const completeSetSchema = z.object({
  reps: z.number().int().positive().optional(),
  weight: z.number().positive().optional(),
  duration: z.number().positive().optional(),
  distance: z.number().positive().optional(),
});

export const workoutFiltersSchema = z.object({
  type: z.enum(['strength', 'cardio', 'hybrid']).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const validateCreateWorkout = validate(createWorkoutSchema);
export const validateUpdateWorkout = validate(updateWorkoutSchema);
export const validateCompleteSet = validate(completeSetSchema);
export const validateWorkoutFilters = validate(workoutFiltersSchema, 'query');
