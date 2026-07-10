import { Request, Response } from 'express';
import { prisma } from '../services/database.js';
import { paginatedResponse } from '../utils/response.js';

export const getExerciseLibraryHandler = async (req: Request, res: Response) => {
  const { q, category, limit, offset } = req.query as unknown as {
    q?: string;
    category?: string;
    limit: number;
    offset: number;
  };

  const where: Record<string, unknown> = {};
  if (q) {
    where.name = { contains: q, mode: 'insensitive' };
  }
  if (category) {
    where.category = category;
  }

  const [exercises, total] = await Promise.all([
    prisma.exercise.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        category: true,
        primaryMuscle: true,
        equipment: true,
        difficulty: true,
        met: true,
        isBodyweight: true,
        caloriesPerMin: true,
      },
    }),
    prisma.exercise.count({ where }),
  ]);

  const page = limit > 0 ? Math.floor(offset / limit) + 1 : 1;
  res.json(paginatedResponse(exercises, total, page, limit, 'Exercises'));
};
