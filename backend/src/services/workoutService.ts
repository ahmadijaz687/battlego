import { prisma } from '../services/database.js';
import type { WorkoutType, Difficulty } from '@prisma/client';
import { workoutRepository } from '../repositories/index.js';

export async function getExercises() {
  return prisma.exercise.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getTemplates() {
  return prisma.workoutTemplate.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getWorkoutHistory(userId: string) {
  return workoutRepository.findByUserId(userId);
}

export async function getPersonalRecords(userId: string) {
  return prisma.personalRecord.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
}

export async function getAnalytics(userId: string) {
  return workoutRepository.getAnalytics(userId);
}

export async function createWorkout(userId: string, data: {
  name: string;
  type: string;
  difficulty: string;
  duration: number;
  sections?: unknown[];
}) {
  const createData: Record<string, unknown> = {
    userId,
    name: data.name,
      type: data.type as WorkoutType,
      difficulty: data.difficulty as Difficulty,
    duration: data.duration,
  };
  if (data.sections && data.sections.length > 0) {
    createData.sections = data.sections;
  }
  return prisma.workout.create({ data: createData as Parameters<typeof prisma.workout.create>[0]['data'] });
}

export async function startWorkout(userId: string, workoutId: string) {
  const updated = await prisma.$transaction(async (tx) => {
    const workout = await tx.workout.findFirst({
      where: { id: workoutId, userId },
    });

    if (!workout) {
      throw new Error('Workout not found');
    }

    return tx.workout.update({
      where: { id: workoutId },
      data: { startedAt: new Date() },
    });
  });

  return { ...updated, status: 'started' };
}

export async function completeSet(userId: string, workoutId: string, setId: string, data: {
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
}) {
  return prisma.$transaction(async (tx) => {
    const workout = await tx.workout.findFirst({
      where: { id: workoutId, userId },
      select: { id: true },
    });

    if (!workout) {
      throw new Error('Workout not found');
    }

    return tx.workoutSet.update({
      where: { id: setId },
      data: {
        reps: data.reps,
        weight: data.weight,
        duration: data.duration,
        distance: data.distance,
        completed: true,
      },
    });
  });
}

export async function getWorkoutSession(userId: string, workoutId: string) {
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          exercises: {
            include: {
              sets: { orderBy: { setNumber: 'asc' } },
            },
          },
        },
      },
    },
  });
  if (!workout) throw new Error('Workout not found');
  return workout;
}

export async function getCurrentSession(userId: string) {
  const session = await prisma.workout.findFirst({
    where: { userId, startedAt: { not: null }, completedAt: null },
    orderBy: { startedAt: 'desc' },
    include: {
      sections: {
        include: {
          exercises: {
            include: {
              sets: true,
            },
          },
        },
      },
    },
  });
  return session;
}

export async function syncWorkoutLogs(userId: string, logs: Array<{
  exerciseId: string;
  setNumber?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  completedAt: string;
}>) {
  const results = [];
  let setIdx = 1;
  for (const log of logs) {
    const set = await prisma.workoutSet.create({
      data: {
        exerciseId: log.exerciseId,
        setNumber: log.setNumber ?? setIdx,
        reps: log.reps,
        weight: log.weight,
        duration: log.duration,
        distance: log.distance,
        completed: true,
        completedAt: new Date(log.completedAt),
      },
    });
    results.push(set);
    setIdx++;
  }
  return { synced: results.length, logs: results };
}

export async function completeWorkout(userId: string, workoutId: string) {
  const workout = await prisma.workout.updateMany({
    where: { id: workoutId, userId },
    data: { completedAt: new Date() },
  });

  if (workout.count === 0) {
    throw new Error('Workout not found');
  }

  return { status: 'completed', completedAt: new Date().toISOString() };
}
