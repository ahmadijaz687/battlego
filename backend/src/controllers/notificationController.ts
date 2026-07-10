import { Request, Response } from 'express';
import { prisma } from '../services/database.js';
import { successResponse } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

export const listNotificationsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const limit = Math.min(parseInt((req.query.limit as string) || '50', 10), 100);

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  res.json(successResponse(notifications));
};

export const markNotificationReadHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const { id } = req.body;

  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }
  if (notification.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { read: true },
  });

  res.json(successResponse(updated, 'Notification marked as read'));
};
