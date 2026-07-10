import { Request, Response } from 'express';
import { prisma } from '../services/database.js';
import { paginatedResponse } from '../utils/response.js';

export async function searchPostsHandler(req: Request, res: Response) {
  const q = (req.query.q as string) || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const where = q ? { content: { contains: q } } : {};

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  res.json(paginatedResponse(posts, total, page, limit));
}

export async function searchUsersHandler(req: Request, res: Response) {
  const q = (req.query.q as string) || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const where = q
    ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, avatar: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  res.json(paginatedResponse(users, total, page, limit));
}

export async function searchWorkoutsHandler(req: Request, res: Response) {
  const q = (req.query.q as string) || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const where = q ? { name: { contains: q } } : {};

  const [workouts, total] = await Promise.all([
    prisma.workout.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.workout.count({ where }),
  ]);

  res.json(paginatedResponse(workouts, total, page, limit));
}

export async function searchExercisesHandler(req: Request, res: Response) {
  const q = (req.query.q as string) || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const where = q
    ? { OR: [{ name: { contains: q } }, { primaryMuscle: { contains: q } }] }
    : {};

  const [exercises, total] = await Promise.all([
    prisma.exercise.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.exercise.count({ where }),
  ]);

  res.json(paginatedResponse(exercises, total, page, limit));
}

export async function searchFoodsHandler(req: Request, res: Response) {
  const q = (req.query.q as string) || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const where = q
    ? { OR: [{ name: { contains: q } }, { brand: { contains: q } }] }
    : {};

  const [foods, total] = await Promise.all([
    prisma.food.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.food.count({ where }),
  ]);

  res.json(paginatedResponse(foods, total, page, limit));
}

export async function searchBattlesHandler(req: Request, res: Response) {
  const q = (req.query.q as string) || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const where = q ? { type: { contains: q } } : {};

  const [battles, total] = await Promise.all([
    prisma.battle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.battle.count({ where }),
  ]);

  res.json(paginatedResponse(battles, total, page, limit));
}

export async function searchMessagesHandler(req: Request, res: Response) {
  const q = (req.query.q as string) || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const where = q ? { content: { contains: q } } : {};

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { sentAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.message.count({ where }),
  ]);

  res.json(paginatedResponse(messages, total, page, limit));
}

export async function searchCommunitiesHandler(req: Request, res: Response) {
  const q = (req.query.q as string) || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const where = q
    ? { OR: [{ name: { contains: q } }, { description: { contains: q } }] }
    : {};

  const [communities, total] = await Promise.all([
    prisma.community.findMany({
      where,
      orderBy: { memberCount: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.community.count({ where }),
  ]);

  res.json(paginatedResponse(communities, total, page, limit));
}
