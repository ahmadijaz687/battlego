import { Request, Response } from 'express';
import { prisma } from '../services/database.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export async function getCoinBalanceHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;

  let coins = await prisma.coins.findUnique({ where: { userId } });
  if (!coins) {
    coins = await prisma.coins.create({
      data: { userId, balance: 0, earned: 0, spent: 0 },
    });
  }

  res.json(successResponse(coins));
}

export async function getCoinHistoryHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const [transactions, total] = await Promise.all([
    prisma.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.coinTransaction.count({ where: { userId } }),
  ]);

  res.json(paginatedResponse(transactions, total, page, limit));
}

export async function getTitlesHandler(_req: Request, res: Response) {
  const titles = await prisma.title.findMany({
    orderBy: { rarity: 'asc' },
  });
  res.json(successResponse(titles));
}

export async function equipTitleHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const titleId = req.params.id as string;

  const unlocked = await prisma.unlockedTitle.findUnique({
    where: { userId_titleId: { userId, titleId } },
  });
  if (!unlocked) {
    res.status(400).json({ success: false, message: 'Title not unlocked', data: null });
    return;
  }

  await prisma.unlockedTitle.updateMany({
    where: { userId, isEquipped: true },
    data: { isEquipped: false },
  });

  const updated = await prisma.unlockedTitle.update({
    where: { id: unlocked.id },
    data: { isEquipped: true },
  });

  res.json(successResponse(updated, 'Title equipped'));
}
