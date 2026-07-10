import { Request, Response } from 'express';
import { prisma } from '../services/database.js';
import { successResponse } from '../utils/response.js';

export async function trendingPostsHandler(req: Request, res: Response) {
  const limit = parseInt(req.query.limit as string) || 20;

  const posts = await prisma.post.findMany({
    orderBy: [{ likes: 'desc' }, { comments: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  res.json(successResponse(posts));
}

export async function trendingWorkoutsHandler(req: Request, res: Response) {
  const limit = parseInt(req.query.limit as string) || 20;

  const workouts = await prisma.workout.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  res.json(successResponse(workouts));
}

export async function trendingUsersHandler(req: Request, res: Response) {
  const limit = parseInt(req.query.limit as string) || 20;

  const users = await prisma.userLevel.findMany({
    orderBy: { totalXp: 'desc' },
    take: limit,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  const result = users.map((ul, i) => ({
    rank: i + 1,
    userId: ul.user.id,
    name: ul.user.name,
    avatar: ul.user.avatar,
    level: ul.level,
    xp: ul.totalXp,
  }));

  res.json(successResponse(result));
}
