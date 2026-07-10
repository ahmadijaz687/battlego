import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/response.js';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: errorResponse('Too many login attempts, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: errorResponse('Too many requests, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: errorResponse('Rate limit exceeded'),
  standardHeaders: true,
  legacyHeaders: false,
});
