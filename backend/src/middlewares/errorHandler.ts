import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { errorResponse } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => unknown) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export function globalErrorHandler(
  err: Error & { status?: number; statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message));
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  if (statusCode === 500) {
    logger.error('Unhandled error', err);
  }
  res.status(statusCode).json(errorResponse(err.message || 'Internal server error'));
}
