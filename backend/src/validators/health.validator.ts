import { z } from 'zod';
import { validate } from '../middlewares/validation.js';

export const sleepLogSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  duration: z.number().int().positive('Duration must be positive'),
  quality: z.number().int().min(1).max(10).optional(),
  deepSleep: z.number().int().optional(),
  remSleep: z.number().int().optional(),
  lightSleep: z.number().int().optional(),
  awakeTime: z.number().int().optional(),
  source: z.string().max(100).trim().optional(),
});

export const hrvLogSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  hrv: z.number().positive('HRV must be positive'),
  rmssd: z.number().optional(),
  sdnn: z.number().optional(),
  source: z.string().max(100).trim().optional(),
});

export const moodLogSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  mood: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(10).optional(),
  stress: z.number().int().min(1).max(10).optional(),
  note: z.string().trim().optional(),
});

export const validateSleepLog = validate(sleepLogSchema);
export const validateHrvLog = validate(hrvLogSchema);
export const validateMoodLog = validate(moodLogSchema);
