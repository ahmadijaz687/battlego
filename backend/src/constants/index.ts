export const API_PREFIX = '/api/v1';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const EXERCISE_TYPES = ['strength', 'cardio', 'hybrid'] as const;
export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export const FITNESS_LEVELS = ['beginner', 'intermediate', 'advanced', 'elite'] as const;
export const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'active', 'very_active'] as const;
export const UNITS = ['metric', 'imperial'] as const;
export const THEMES = ['light', 'dark', 'system', 'amoled'] as const;

export const WORKOUT_SECTION_TYPES = ['warmup', 'main', 'cooldown'] as const;
export const MEAL_TIMES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
export const MESSAGE_TYPES = ['text', 'image', 'voice'] as const;
export const POST_TYPES = ['workout', 'nutrition', 'transformation', 'achievement', 'battle', 'general'] as const;
export const HABIT_FREQUENCIES = ['daily', 'weekly', 'monthly'] as const;
export const AI_ROLES = ['user', 'assistant'] as const;

export const XP = {
  WORKOUT_COMPLETE: 100,
  STREAK_BONUS: 50,
  CHALLENGE_WIN: 500,
  ACHIEVEMENT_UNLOCK: 250,
  POST_LIKE: 10,
  COMMENT: 15,
  DAILY_LOGIN: 25,
  HABIT_COMPLETE: 30,
  BATTLE_WIN: 300,
  REFERRAL: 200,
} as const;

export const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500,
  5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000,
] as const;

export const JWT = {
  ACCESS_EXPIRY: '15m',
  REFRESH_EXPIRY: '7d',
  MIN_SECRET_LENGTH: 32,
} as const;
