import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import {
  getExercises,
  getTemplates,
  getWorkoutHistory,
  getPersonalRecords,
  getAnalytics,
  createWorkout,
  startWorkout,
  completeSet,
  completeWorkout,
  getWorkoutSession,
  getCurrentSession,
  syncWorkoutLogs,
} from '../services/workoutService.js';
import { successResponse } from '../utils/response.js';
import { prisma } from '../services/database.js';
import { emitLeaderboardEntryUpdated, emitBattleScoreUpdated } from '../socket/index.js';
import { logger } from '../utils/logger.js';

type LeaderboardMetric = 'xp' | 'strength' | 'cardio' | 'hybrid';

async function emitWorkoutRealtime(userId: string, workoutId: string): Promise<void> {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      select: { type: true, duration: true },
    });
    if (!workout) return;

    const metric: LeaderboardMetric = ['strength', 'cardio', 'hybrid'].includes(workout.type)
      ? (workout.type as LeaderboardMetric)
      : 'xp';

    for (const period of ['daily', 'weekly', 'monthly', 'alltime'] as const) {
      emitLeaderboardEntryUpdated(metric, period, { userId, value: workout.duration });
    }

    const battles = await prisma.battle.findMany({
      where: { status: 'active', OR: [{ creatorId: userId }, { opponentId: userId }] },
      select: { id: true, creatorScore: true, opponentScore: true },
    });
    for (const b of battles) {
      emitBattleScoreUpdated(b.id, {
        userId,
        creatorScore: b.creatorScore,
        opponentScore: b.opponentScore,
      });
    }
  } catch (err) {
    logger.warn('[Workout] Failed to emit realtime events', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export const getExercisesHandler = async (_req: Request, res: Response) => {
  const exercises = await getExercises();
  res.json(successResponse(exercises));
};

export const getTemplatesHandler = async (_req: Request, res: Response) => {
  const templates = await getTemplates();
  res.json(successResponse(templates));
};

export const getWorkoutHistoryHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const workouts = await getWorkoutHistory(userId);
  res.json(successResponse(workouts));
};

export const getPersonalRecordsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const records = await getPersonalRecords(userId);
  res.json(successResponse(records));
};

export const getAnalyticsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const analytics = await getAnalytics(userId);
  res.json(successResponse(analytics));
};

export const createWorkoutHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const workout = await createWorkout(userId, req.body);
  res.status(201).json(successResponse(workout, 'Workout created'));
};

export const startWorkoutHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const workoutId = req.params.workoutId as string;
  const workout = await startWorkout(userId, workoutId);
  res.json(successResponse(workout, 'Workout started'));
};

export const completeSetHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const workoutId = req.params.workoutId as string;
  const setId = req.params.setId as string;
  const set = await completeSet(userId, workoutId, setId, req.body);
  res.json(successResponse(set, 'Set completed'));
};

export const completeWorkoutHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const workoutId = req.params.workoutId as string;
  const result = await completeWorkout(userId, workoutId);
  await emitWorkoutRealtime(userId, workoutId);
  res.json(successResponse(result, 'Workout completed'));
};

export const getWorkoutSessionHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const workoutId = req.params.workoutId as string;
  const session = await getWorkoutSession(userId, workoutId);
  res.json(successResponse(session));
};

export const getCurrentSessionHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const session = await getCurrentSession(userId);
  res.json(successResponse(session));
};

export const syncWorkoutLogsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const result = await syncWorkoutLogs(userId, req.body.logs || []);
  res.json(successResponse(result, 'Workout logs synced'));
};

export const getWorkoutTemplateByIdHandler = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const template = await prisma.workoutTemplate.findUnique({ where: { id } });
  if (!template) {
    return res.status(404).json(successResponse(null, 'Template not found'));
  }
  res.json(successResponse(template));
};

export const createCustomWorkoutHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const { name, type, difficulty, exercises } = req.body as {
    name: string;
    type: 'strength' | 'cardio' | 'hybrid';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    exercises?: Array<{
      exerciseId: string;
      name?: string;
      sets?: number;
      reps?: number;
      restSec?: number;
      order?: number;
    }>;
  };

  const created = await prisma.$transaction(async (tx) => {
    const workout = await tx.workout.create({
      data: { userId, name, type, difficulty, duration: 0 },
    });

    const section = await tx.workoutSection.create({
      data: { workoutId: workout.id, type: 'main', name: 'Custom', order: 0 },
    });

    if (exercises && exercises.length > 0) {
      await tx.workoutExercise.createMany({
        data: exercises.map((ex, idx) => ({
          sectionId: section.id,
          exerciseId: ex.exerciseId,
          name: ex.name ?? '',
          order: ex.order ?? idx,
        })),
      });
    }

    return workout;
  });

  const full = await prisma.workout.findUnique({
    where: { id: created.id },
    include: { sections: { include: { exercises: true } } },
  });

  res.status(201).json(successResponse(full, 'Custom workout created'));
};
