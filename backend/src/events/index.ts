export { appEventEmitter } from './EventEmitter.js';
export { EventTypes } from './types.js';
export type {
  EventType,
  AppEventPayload,
  WorkoutCompletedEvent,
  NutritionLoggedEvent,
  BattleEvent,
  AchievementEvent,
  LevelUpEvent,
  XpEarnedEvent,
  HabitCompletedEvent,
  ChallengeEvent,
  PremiumEvent,
  SleepLoggedEvent,
  MoodLoggedEvent,
  BaseEvent,
} from './types.js';
export { registerAllHandlers } from './handlers/index.js';
