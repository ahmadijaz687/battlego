export const API_PREFIX = '/api/v1';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const TIMEOUTS = {
  API: 30000,
  SOCKET: 25000,
  CACHE: 300000,
  STALE: 60000,
  RETRY: 5000,
} as const;

export const ANIMATION = {
  ultraFast: 120,
  fast: 180,
  medium: 250,
  slow: 350,
  pageTransition: 400,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  SETTINGS: 'user_settings',
  ONBOARDING: 'onboarding_complete',
  THEME: 'theme_preference',
  CACHED_WORKOUTS: 'cached_workouts',
  CACHED_FOODS: 'cached_foods',
  CACHED_EXERCISES: 'cached_exercises',
  OFFLINE_QUEUE: 'offline_queue',
  LAST_SYNC: 'last_sync_timestamp',
} as const;

export const XP_REWARDS = {
  WORKOUT_COMPLETE: 100,
  STREAK_BONUS: 50,
  CHALLENGE_WIN: 500,
  ACHIEVEMENT_UNLOCK: 250,
  POST_LIKE: 10,
  COMMENT: 15,
  DAILY_LOGIN: 25,
  HABIT_COMPLETE: 30,
  BATTLE_WIN: 300,
  BATTLE_PARTICIPATION: 50,
  MEAL_LOGGED: 20,
  WATER_LOGGED: 5,
  FRIEND_ADDED: 50,
  SHARE_POST: 15,
} as const;

export const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500,
  5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000,
] as const;

export const MACRO_DEFAULTS = {
  PROTEIN_PER_KG: 2.0,
  FAT_PERCENTAGE: 25,
  FIBER_GOAL: 25,
  WATER_GOAL: 2000,
  SODIUM_LIMIT: 2300,
  SUGAR_LIMIT: 50,
} as const;

export const CALORIE_ESTIMATES = {
  WALKING: 4,
  RUNNING: 10,
  CYCLING: 8,
  SWIMMING: 10,
  STRENGTH: 6,
  YOGA: 3,
  HIIT: 12,
} as const;

export const BATTLE = {
  MIN_PARTICIPANTS: 2,
  MAX_PARTICIPANTS: 100,
  MIN_DURATION_HOURS: 1,
  MAX_DURATION_DAYS: 30,
  DEFAULT_DURATION_DAYS: 7,
  REWARD_XP_MIN: 50,
  REWARD_XP_MAX: 1000,
  REWARD_COINS_MIN: 10,
  REWARD_COINS_MAX: 500,
} as const;

export const WORKOUT = {
  MIN_EXERCISES: 1,
  MAX_EXERCISES: 50,
  MIN_DURATION: 5,
  MAX_DURATION: 240,
  DEFAULT_REST_TIME: 60,
  DEFAULT_SET_REST: 90,
} as const;

export const WATER = {
  DEFAULT_GOAL: 2000,
  GLASS_SIZE: 250,
  MIN_INTAKE: 0,
  MAX_INTAKE: 10000,
} as const;

export const MEAL = {
  TYPES: ['breakfast', 'lunch', 'dinner', 'snack'] as const,
  MAX_PER_MEAL: 50,
} as const;

export const EXERCISE = {
  MAX_SETS: 20,
  MAX_REPS: 100,
  MAX_WEIGHT: 1000,
  MAX_DURATION: 3600,
} as const;

export const UPLOAD = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024,
  MAX_VIDEO_SIZE: 100 * 1024 * 1024,
  ACCEPTED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  ACCEPTED_VIDEO_TYPES: ['mp4', 'mov', 'avi'],
  AVATAR_MAX_SIZE: 5 * 1024 * 1024,
} as const;

export const LIMITS = {
  MAX_FRIENDS: 5000,
  MAX_FOLLOWING: 2000,
  MAX_POST_LENGTH: 2000,
  MAX_COMMENT_LENGTH: 500,
  MAX_BIO_LENGTH: 500,
  MAX_USERNAME_LENGTH: 30,
  MIN_USERNAME_LENGTH: 3,
  MAX_DISPLAY_NAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
} as const;

export const CHAT = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_GROUP_MEMBERS: 100,
  MAX_FORWARD_COUNT: 10,
  TYPING_TIMEOUT: 3000,
} as const;

export const AI = {
  MAX_CONVERSATIONS: 100,
  MAX_MESSAGES_PER_CONVERSATION: 500,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_HISTORY_LENGTH: 50,
} as const;

export const SOCKET = {
  RECONNECT_DELAYS: [1000, 2000, 5000, 10000],
  MAX_RECONNECT_ATTEMPTS: 10,
  PING_INTERVAL: 25000,
  PING_TIMEOUT: 20000,
} as const;

export const CACHE = {
  SHORT: 60 * 1000,
  MEDIUM: 5 * 60 * 1000,
  LONG: 30 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

export const ACTIONS = {
  LIKE: 'like',
  UNLIKE: 'unlike',
  FOLLOW: 'follow',
  UNFOLLOW: 'unfollow',
  SAVE: 'save',
  UNSAVE: 'unsave',
  BLOCK: 'block',
  UNBLOCK: 'unblock',
  MUTE: 'mute',
  UNMUTE: 'unmute',
  PIN: 'pin',
  UNPIN: 'unpin',
  ARCHIVE: 'archive',
  UNARCHIVE: 'unarchive',
} as const;

export const CHART_COLORS = {
  PRIMARY: '#FF1E3C',
  SECONDARY: '#3B82F6',
  SUCCESS: '#30D158',
  WARNING: '#FFC857',
  DANGER: '#FF453A',
  PURPLE: '#AF52DE',
  TEAL: '#5AC8FA',
  ORANGE: '#FF9500',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNAUTHORIZED: 'Please sign in to continue.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  OFFLINE: 'You are currently offline. Some features may be limited.',
  SYNC_ERROR: 'Failed to sync data. Changes will be saved locally.',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
} as const;
