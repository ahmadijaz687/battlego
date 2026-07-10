export const EventTypes = {
  WORKOUT_COMPLETED: 'workout:completed',
  NUTRITION_LOGGED: 'nutrition:logged',
  BATTLE_STARTED: 'battle:started',
  BATTLE_COMPLETED: 'battle:completed',
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',
  LEVEL_UP: 'level:up',
  XP_EARNED: 'xp:earned',
  FRIEND_REQUEST: 'friend:request',
  MESSAGE_SENT: 'message:sent',
  CHALLENGE_CREATED: 'challenge:created',
  CHALLENGE_COMPLETED: 'challenge:completed',
  HABIT_COMPLETED: 'habit:completed',
  GOAL_REACHED: 'goal:reached',
  PREMIUM_UPGRADED: 'premium:upgraded',
  SUBSCRIPTION_CANCELLED: 'subscription:cancelled',
  SLEEP_LOGGED: 'sleep:logged',
  MOOD_LOGGED: 'mood:logged',
} as const;

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];

export interface BaseEvent {
  userId: string;
  timestamp: Date;
}

export interface WorkoutCompletedEvent extends BaseEvent {
  workoutId: string;
  type: 'strength' | 'cardio' | 'hybrid';
  duration: number;
  xpEarned: number;
}

export interface NutritionLoggedEvent extends BaseEvent {
  mealId: string;
  mealType: string;
  calories: number;
  xpEarned: number;
}

export interface BattleEvent extends BaseEvent {
  battleId: string;
  opponentId: string;
  result?: 'win' | 'loss' | 'draw';
}

export interface AchievementEvent extends BaseEvent {
  achievementId: string;
  achievementName: string;
  xpReward: number;
}

export interface LevelUpEvent extends BaseEvent {
  newLevel: number;
  previousLevel: number;
  totalXp: number;
}

export interface XpEarnedEvent extends BaseEvent {
  amount: number;
  source: string;
  totalXp: number;
}

export interface HabitCompletedEvent extends BaseEvent {
  habitId: string;
  habitName: string;
  streak: number;
}

export interface ChallengeEvent extends BaseEvent {
  challengeId: string;
  challengeName: string;
}

export interface PremiumEvent extends BaseEvent {
  plan: string;
  validUntil: string;
}

export interface SleepLoggedEvent extends BaseEvent {
  sleepId: string;
  duration: number;
  quality: string;
}

export interface MoodLoggedEvent extends BaseEvent {
  entryId: string;
  mood: number;
  energy: number;
}

export type AppEventPayload =
  | WorkoutCompletedEvent
  | NutritionLoggedEvent
  | BattleEvent
  | AchievementEvent
  | LevelUpEvent
  | XpEarnedEvent
  | HabitCompletedEvent
  | ChallengeEvent
  | PremiumEvent
  | SleepLoggedEvent
  | MoodLoggedEvent;
