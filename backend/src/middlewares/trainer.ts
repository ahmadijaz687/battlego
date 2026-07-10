import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/database.js';
import { AppError } from '../utils/AppError.js';
import { AuthenticatedRequest } from './auth.js';

export interface TrainerRequest extends Request {
  trainer?: {
    id: string;
    userId: string;
  };
}

export async function requireTrainer(req: Request, _res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const coachProfile = await prisma.coachProfile.findUnique({ where: { userId } });
    if (!coachProfile) throw new AppError('Trainer profile required', 403);

    (req as TrainerRequest).trainer = { id: coachProfile.id, userId };
    next();
  } catch (error) {
    next(error);
  }
}
