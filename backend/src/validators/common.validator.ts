import { z } from 'zod';
import { validate } from '../middlewares/validation.js';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const dateRangeSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

export const validatePagination = validate(paginationSchema, 'query');
export const validateIdParam = validate(idParamSchema, 'params');
export const validateDateRange = validate(dateRangeSchema, 'query');
