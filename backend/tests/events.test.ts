import { appEventEmitter } from '../src/events/EventEmitter.js';
import { EventTypes } from '../src/events/types.js';
import { jest } from '@jest/globals';

describe('EventEmitter', () => {
  beforeEach(() => {
    appEventEmitter.removeAllListeners();
  });

  describe('event emission', () => {
    it('should emit events and trigger listeners', () => {
      const listener = jest.fn();
      appEventEmitter.on(EventTypes.WORKOUT_COMPLETED, listener);

      appEventEmitter.emit(EventTypes.WORKOUT_COMPLETED, {
        userId: 'user-1',
        timestamp: new Date(),
        workoutId: 'workout-1',
        type: 'strength',
        duration: 45,
        xpEarned: 100,
      });

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should pass payload to listeners', () => {
      const listener = jest.fn();
      appEventEmitter.on(EventTypes.XP_EARNED, listener);

      const payload = {
        userId: 'user-1',
        timestamp: new Date(),
        amount: 50,
        source: 'workout',
        totalXp: 500,
      };

      appEventEmitter.emit(EventTypes.XP_EARNED, payload);
      expect(listener).toHaveBeenCalledWith(payload);
    });
  });

  describe('handler registration', () => {
    it('should support multiple listeners for same event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      appEventEmitter.on(EventTypes.BATTLE_COMPLETED, listener1);
      appEventEmitter.on(EventTypes.BATTLE_COMPLETED, listener2);

      appEventEmitter.emit(EventTypes.BATTLE_COMPLETED, {
        userId: 'user-1',
        timestamp: new Date(),
        battleId: 'battle-1',
        opponentId: 'opp-1',
        result: 'win',
      });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should remove listeners with off()', () => {
      const listener = jest.fn();
      appEventEmitter.on(EventTypes.ACHIEVEMENT_UNLOCKED, listener);
      appEventEmitter.off(EventTypes.ACHIEVEMENT_UNLOCKED, listener);

      appEventEmitter.emit(EventTypes.ACHIEVEMENT_UNLOCKED, {
        userId: 'user-1',
        timestamp: new Date(),
        achievementId: 'ach-1',
        achievementName: 'First Workout',
        xpReward: 50,
      });

      expect(listener).not.toHaveBeenCalled();
    });

    it('should support once() listeners', () => {
      const listener = jest.fn();
      appEventEmitter.once(EventTypes.LEVEL_UP, listener);

      appEventEmitter.emit(EventTypes.LEVEL_UP, {
        userId: 'user-1',
        timestamp: new Date(),
        newLevel: 2,
        previousLevel: 1,
        totalXp: 200,
      });

      appEventEmitter.emit(EventTypes.LEVEL_UP, {
        userId: 'user-1',
        timestamp: new Date(),
        newLevel: 3,
        previousLevel: 2,
        totalXp: 500,
      });

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('payload passing', () => {
    it('should handle nutrition logged event', () => {
      const listener = jest.fn();
      appEventEmitter.on(EventTypes.NUTRITION_LOGGED, listener);

      const payload = {
        userId: 'user-1',
        timestamp: new Date(),
        mealId: 'meal-1',
        mealType: 'lunch',
        calories: 650,
        xpEarned: 25,
      };

      appEventEmitter.emit(EventTypes.NUTRITION_LOGGED, payload);
      expect(listener).toHaveBeenCalledWith(payload);
    });

    it('should handle sleep logged event', () => {
      const listener = jest.fn();
      appEventEmitter.on(EventTypes.SLEEP_LOGGED, listener);

      const payload = {
        userId: 'user-1',
        timestamp: new Date(),
        sleepId: 'sleep-1',
        duration: 480,
        quality: 'good',
      };

      appEventEmitter.emit(EventTypes.SLEEP_LOGGED, payload);
      expect(listener).toHaveBeenCalledWith(payload);
    });

    it('should handle habit completed event', () => {
      const listener = jest.fn();
      appEventEmitter.on(EventTypes.HABIT_COMPLETED, listener);

      const payload = {
        userId: 'user-1',
        timestamp: new Date(),
        habitId: 'habit-1',
        habitName: 'Drink Water',
        streak: 5,
      };

      appEventEmitter.emit(EventTypes.HABIT_COMPLETED, payload);
      expect(listener).toHaveBeenCalledWith(payload);
    });
  });

  describe('event types', () => {
    it('should have all required event types defined', () => {
      expect(EventTypes.WORKOUT_COMPLETED).toBe('workout:completed');
      expect(EventTypes.NUTRITION_LOGGED).toBe('nutrition:logged');
      expect(EventTypes.BATTLE_STARTED).toBe('battle:started');
      expect(EventTypes.BATTLE_COMPLETED).toBe('battle:completed');
      expect(EventTypes.ACHIEVEMENT_UNLOCKED).toBe('achievement:unlocked');
      expect(EventTypes.LEVEL_UP).toBe('level:up');
      expect(EventTypes.XP_EARNED).toBe('xp:earned');
      expect(EventTypes.FRIEND_REQUEST).toBe('friend:request');
      expect(EventTypes.MESSAGE_SENT).toBe('message:sent');
      expect(EventTypes.CHALLENGE_CREATED).toBe('challenge:created');
      expect(EventTypes.CHALLENGE_COMPLETED).toBe('challenge:completed');
      expect(EventTypes.HABIT_COMPLETED).toBe('habit:completed');
      expect(EventTypes.GOAL_REACHED).toBe('goal:reached');
      expect(EventTypes.SLEEP_LOGGED).toBe('sleep:logged');
      expect(EventTypes.MOOD_LOGGED).toBe('mood:logged');
    });
  });
});
