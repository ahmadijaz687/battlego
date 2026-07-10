import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';

export interface CreateWorkoutData {
  userId: string;
  name: string;
  type: 'strength' | 'cardio' | 'hybrid';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  sections?: Array<{
    type: 'warmup' | 'main' | 'cooldown';
    name: string;
    order: number;
    exercises?: Array<{
      exerciseId: string;
      name: string;
      order: number;
      sets?: Array<{
        setNumber: number;
        reps?: number;
        weight?: number;
      }>;
    }>;
  }>;
}

export interface UpdateWorkoutData {
  name?: string;
  duration?: number;
  completedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class WorkoutRepository extends BaseRepository<any, CreateWorkoutData, UpdateWorkoutData> {
  constructor() {
    super(prisma.workout, 'workout');
  }

  async findByUserId(userId: string, options?: { limit?: number; offset?: number }) {
    return prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 20,
      skip: options?.offset || 0,
      include: {
        sections: {
          include: {
            exercises: {
              include: { sets: true },
            },
          },
        },
      },
    });
  }

  async getCompletedByUserId(userId: string) {
    return prisma.workout.findMany({
      where: { userId, completedAt: { not: null } },
      orderBy: { completedAt: 'desc' },
      include: {
        sections: {
          include: {
            exercises: {
              include: { sets: true },
            },
          },
        },
      },
    });
  }

  async getAnalytics(userId: string) {
    const workouts = await prisma.workout.findMany({
      where: { userId, completedAt: { not: null } },
    });

    const totalVolume = workouts.reduce((sum, w) => sum + w.duration, 0);
    const thisWeek = workouts.filter((w) => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return w.completedAt && w.completedAt > weekAgo;
    });

    return {
      totalWorkouts: workouts.length,
      totalMinutes: totalVolume,
      averageDuration: workouts.length > 0 ? Math.round(totalVolume / workouts.length) : 0,
      weeklyFrequency: thisWeek.length,
      consistencyScore: Math.min(100, Math.round((thisWeek.length / 5) * 100)),
    };
  }
}

export const workoutRepository = new WorkoutRepository();
