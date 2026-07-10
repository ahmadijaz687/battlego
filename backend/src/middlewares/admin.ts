import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/database.js';
import { AppError } from '../utils/AppError.js';

export interface AdminRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string; iat?: number; exp?: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (user.role !== 'admin') {
      throw new AppError('Admin access required', 403);
    }

    (req as AdminRequest).user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Invalid token', 401);
  }
}
