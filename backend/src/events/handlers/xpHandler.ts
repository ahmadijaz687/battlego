import { appEventEmitter, EventTypes } from '../index.js';
import { addXP } from '../../services/gamificationService.js';
import { logger } from '../../utils/logger.js';
import type { WorkoutCompletedEvent, NutritionLoggedEvent, HabitCompletedEvent } from '../types.js';

export function registerXpHandler(): void {
  appEventEmitter.on(EventTypes.WORKOUT_COMPLETED, async (payload) => {
    try {
      const data = payload as WorkoutCompletedEvent;
      const result = await addXP(data.userId, data.xpEarned);
      if (result.leveledUp) {
        appEventEmitter.emit(EventTypes.LEVEL_UP, {
          userId: data.userId,
          timestamp: new Date(),
          newLevel: result.level,
          previousLevel: result.level - 1,
          totalXp: result.totalXp,
        });
      }
    } catch (error) {
      logger.error('[XP Handler] Failed to award XP for workout:', error);
    }
  });

  appEventEmitter.on(EventTypes.NUTRITION_LOGGED, async (payload) => {
    try {
      const data = payload as NutritionLoggedEvent;
      const result = await addXP(data.userId, data.xpEarned);
      if (result.leveledUp) {
        appEventEmitter.emit(EventTypes.LEVEL_UP, {
          userId: data.userId,
          timestamp: new Date(),
          newLevel: result.level,
          previousLevel: result.level - 1,
          totalXp: result.totalXp,
        });
      }
    } catch (error) {
      logger.error('[XP Handler] Failed to award XP for nutrition:', error);
    }
  });

  appEventEmitter.on(EventTypes.HABIT_COMPLETED, async (payload) => {
    try {
      const data = payload as HabitCompletedEvent;
      const streakBonus = Math.min(data.streak, 30) * 5;
      const totalXp = 15 + streakBonus;
      const result = await addXP(data.userId, totalXp);
      if (result.leveledUp) {
        appEventEmitter.emit(EventTypes.LEVEL_UP, {
          userId: data.userId,
          timestamp: new Date(),
          newLevel: result.level,
          previousLevel: result.level - 1,
          totalXp: result.totalXp,
        });
      }
    } catch (error) {
      logger.error('[XP Handler] Failed to award XP for habit:', error);
    }
  });
}
