import { appEventEmitter, EventTypes } from '../index.js';
import { appQueue } from '../../queue/Queue.js';
import type {
  WorkoutCompletedEvent,
  NutritionLoggedEvent,
  BattleEvent,
  AchievementEvent,
  LevelUpEvent,
  HabitCompletedEvent,
  SleepLoggedEvent,
  MoodLoggedEvent,
} from '../types.js';

export function registerAnalyticsHandler(): void {
  appEventEmitter.on(EventTypes.WORKOUT_COMPLETED, async (payload) => {
    const data = payload as WorkoutCompletedEvent;
    appQueue.enqueue('analytics_event', {
      event: 'workout_completed',
      userId: data.userId,
      data: { workoutId: data.workoutId, duration: data.duration },
      timestamp: data.timestamp,
    });
  });

  appEventEmitter.on(EventTypes.NUTRITION_LOGGED, async (payload) => {
    const data = payload as NutritionLoggedEvent;
    appQueue.enqueue('analytics_event', {
      event: 'nutrition_logged',
      userId: data.userId,
      data: { mealId: data.mealId, mealType: data.mealType, calories: data.calories },
      timestamp: data.timestamp,
    });
  });

  appEventEmitter.on(EventTypes.BATTLE_COMPLETED, async (payload) => {
    const data = payload as BattleEvent;
    appQueue.enqueue('analytics_event', {
      event: 'battle_completed',
      userId: data.userId,
      data: { battleId: data.battleId, result: data.result },
      timestamp: data.timestamp,
    });
  });

  appEventEmitter.on(EventTypes.ACHIEVEMENT_UNLOCKED, async (payload) => {
    const data = payload as AchievementEvent;
    appQueue.enqueue('analytics_event', {
      event: 'achievement_unlocked',
      userId: data.userId,
      data: { achievementId: data.achievementId, achievementName: data.achievementName },
      timestamp: data.timestamp,
    });
  });

  appEventEmitter.on(EventTypes.LEVEL_UP, async (payload) => {
    const data = payload as LevelUpEvent;
    appQueue.enqueue('analytics_event', {
      event: 'level_up',
      userId: data.userId,
      data: { newLevel: data.newLevel, totalXp: data.totalXp },
      timestamp: data.timestamp,
    });
  });

  appEventEmitter.on(EventTypes.HABIT_COMPLETED, async (payload) => {
    const data = payload as HabitCompletedEvent;
    appQueue.enqueue('analytics_event', {
      event: 'habit_completed',
      userId: data.userId,
      data: { habitId: data.habitId, habitName: data.habitName, streak: data.streak },
      timestamp: data.timestamp,
    });
  });

  appEventEmitter.on(EventTypes.SLEEP_LOGGED, async (payload) => {
    const data = payload as SleepLoggedEvent;
    appQueue.enqueue('analytics_event', {
      event: 'sleep_logged',
      userId: data.userId,
      data: { sleepId: data.sleepId, duration: data.duration, quality: data.quality },
      timestamp: data.timestamp,
    });
  });

  appEventEmitter.on(EventTypes.MOOD_LOGGED, async (payload) => {
    const data = payload as MoodLoggedEvent;
    appQueue.enqueue('analytics_event', {
      event: 'mood_logged',
      userId: data.userId,
      data: { entryId: data.entryId, mood: data.mood, energy: data.energy },
      timestamp: data.timestamp,
    });
  });
}
