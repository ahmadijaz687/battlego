import { appEventEmitter, EventTypes } from '../index.js';
import { unlockAchievement } from '../../services/gamificationService.js';
import { prisma } from '../../services/database.js';
import { logger } from '../../utils/logger.js';
import type { WorkoutCompletedEvent, HabitCompletedEvent, BattleEvent, NutritionLoggedEvent } from '../types.js';

export function registerAchievementHandler(): void {
  appEventEmitter.on(EventTypes.WORKOUT_COMPLETED, async (payload) => {
    try {
      const data = payload as WorkoutCompletedEvent;
      const workoutCount = await prisma.workout.count({
        where: { userId: data.userId, completedAt: { not: null } },
      });

      const achievementsToCheck: string[] = [];
      if (workoutCount === 1) achievementsToCheck.push('FIRST_WORKOUT');
      if (workoutCount === 7) achievementsToCheck.push('WEEK_WARRIOR');
      if (workoutCount === 30) achievementsToCheck.push('MONTH_MADNESS');
      if (workoutCount === 100) achievementsToCheck.push('CENTURY_CLUB');

      for (const achievement of achievementsToCheck) {
        await unlockAchievement(data.userId, achievement).catch(() => {});
      }
    } catch (error) {
      logger.error('[Achievement Handler] Workout check failed:', error);
    }
  });

  appEventEmitter.on(EventTypes.HABIT_COMPLETED, async (payload) => {
    try {
      const data = payload as HabitCompletedEvent;
      if (data.streak === 7) {
        await unlockAchievement(data.userId, 'STREAK_7').catch(() => {});
      }
      if (data.streak === 30) {
        await unlockAchievement(data.userId, 'STREAK_30').catch(() => {});
      }
      if (data.streak === 100) {
        await unlockAchievement(data.userId, 'STREAK_100').catch(() => {});
      }
    } catch (error) {
      logger.error('[Achievement Handler] Streak check failed:', error);
    }
  });

  appEventEmitter.on(EventTypes.BATTLE_COMPLETED, async (payload) => {
    try {
      const data = payload as BattleEvent;
      if (data.result === 'win') {
        await unlockAchievement(data.userId, 'FIRST_WIN').catch(() => {});

        const winCount = await prisma.battle.count({
          where: { winnerId: data.userId },
        });

        if (winCount === 10) {
          await unlockAchievement(data.userId, 'WARRIOR_10').catch(() => {});
        }
        if (winCount === 50) {
          await unlockAchievement(data.userId, 'CHAMPION_50').catch(() => {});
        }
      }
    } catch (error) {
      logger.error('[Achievement Handler] Battle check failed:', error);
    }
  });

  appEventEmitter.on(EventTypes.NUTRITION_LOGGED, async (payload) => {
    try {
      const data = payload as NutritionLoggedEvent;
      const mealCount = await prisma.meal.count({
        where: { userId: data.userId },
      });

      if (mealCount === 1) {
        await unlockAchievement(data.userId, 'FIRST_MEAL').catch(() => {});
      }
      if (mealCount === 30) {
        await unlockAchievement(data.userId, 'MEAL_MASTER').catch(() => {});
      }
    } catch (error) {
      logger.error('[Achievement Handler] Nutrition check failed:', error);
    }
  });
}
