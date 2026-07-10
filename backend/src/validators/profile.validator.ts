import { z } from 'zod';
import { validate } from '../middlewares/validation.js';

export const profileSchema = z.object({
  name: z.string().min(2).max(50).trim().optional(),
  avatar: z.string().max(500).optional(),
});

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system', 'amoled']).optional(),
  units: z.enum(['metric', 'imperial']).optional(),
  notifications: z.record(z.boolean()).optional(),
});

export const profileDetailsSchema = z.object({
  bio: z.string().max(2000).trim().optional(),
  dateOfBirth: z.string().optional(),
  height: z.number().positive().optional(),
  heightUnit: z.enum(['cm', 'ft']).optional(),
  goal: z.string().max(255).trim().optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced', 'elite']).optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).optional(),
  equipment: z.array(z.string()).optional(),
  injuries: z.array(z.string()).optional(),
  preferences: z.record(z.unknown()).optional(),
});

export const onboardingSchema = z.object({
  goal: z.string().min(1, 'Goal is required').max(255).trim(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced', 'elite']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  equipment: z.array(z.string()).default([]),
  injuries: z.array(z.string()).default([]),
});

export const validateProfile = validate(profileSchema);
export const validateSettings = validate(settingsSchema);
export const validateProfileDetails = validate(profileDetailsSchema);
export const validateOnboarding = validate(onboardingSchema);
