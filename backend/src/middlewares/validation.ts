import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { errorResponse } from '../utils/response.js';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map((issue) =>
        `${issue.path.join('.')}: ${issue.message}`
      );
      res.status(400).json(errorResponse('Validation failed', errors));
      return;
    }
    req[source] = result.data;
    next();
  };
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').transform((e) => e.toLowerCase().trim()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format').transform((e) => e.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be 50 characters or less').trim(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const socialSchema = z.object({
  provider: z.enum(['google', 'apple', 'x', 'meta']),
  idToken: z.string().min(1, 'ID token is required'),
});

export const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  type: z.enum(['strength', 'cardio', 'hybrid']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number().int().positive('Duration must be positive'),
  sections: z.array(z.object({
    type: z.enum(['warmup', 'main', 'cooldown']),
    name: z.string().min(1).max(255).trim(),
    order: z.number().int().min(0).default(0),
    exercises: z.array(z.object({
      exerciseId: z.string().uuid(),
      name: z.string().min(1).max(255).trim(),
      order: z.number().int().min(0).default(0),
    })).optional(),
  })).optional(),
});

export const completeSetSchema = z.object({
  reps: z.number().int().positive().optional(),
  weight: z.number().positive().optional(),
  duration: z.number().positive().optional(),
  distance: z.number().positive().optional(),
});

export const createFoodSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  brand: z.string().max(255).trim().optional(),
  calories: z.number().int().positive('Calories must be positive'),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  servingSize: z.string().min(1).max(100).trim(),
  barcode: z.string().max(255).trim().optional(),
});

export const createMealSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  time: z.string().max(50).optional(),
  foods: z.array(z.object({
    foodId: z.string().uuid(),
    quantity: z.number().positive('Quantity must be positive'),
  })).min(1, 'At least one food item is required'),
});

export const updateMealSchema = createMealSchema.partial();

export const createWaterLogSchema = z.object({
  amount: z.number().int().positive('Amount must be positive'),
});

export const createWeightLogSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  weight: z.number().positive('Weight must be positive'),
  unit: z.enum(['lbs', 'kg']),
});

export const createMeasurementSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  chest: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  hips: z.number().positive().optional(),
  shoulders: z.number().positive().optional(),
  arms: z.number().positive().optional(),
  forearms: z.number().positive().optional(),
  thighs: z.number().positive().optional(),
  calves: z.number().positive().optional(),
  neck: z.number().positive().optional(),
  bodyFat: z.number().min(0).max(100).optional(),
});

export const createShoppingItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().max(50).trim(),
  category: z.string().max(100).trim(),
});

export const updateShoppingItemSchema = createShoppingItemSchema.partial().extend({
  completed: z.boolean().optional(),
});

export const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  images: z.array(z.string()).optional(),
  workoutId: z.string().optional(),
  mealId: z.string().optional(),
  type: z.enum(['workout', 'nutrition', 'transformation', 'achievement', 'battle', 'general']),
  userName: z.string().min(1).max(255).trim(),
  userAvatar: z.string().max(500).optional(),
});

export const createStorySchema = z.object({
  image: z.string().max(500).optional(),
  videoUrl: z.string().max(500).optional(),
  duration: z.number().int().positive().default(5000),
  userName: z.string().min(1).max(255).trim(),
});

export const sendFriendRequestSchema = z.object({
  fromUserId: z.string().uuid(),
  fromUserName: z.string().min(1).max(255).trim(),
  fromUserAvatar: z.string().max(500).optional(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  senderId: z.string().uuid(),
  senderName: z.string().min(1).max(255).trim(),
  content: z.string().min(1, 'Message content is required'),
  mediaUrl: z.string().max(500).optional(),
  type: z.enum(['text', 'image', 'voice']).default('text'),
});

export const createCommunitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  description: z.string().min(1, 'Description is required'),
  avatar: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false),
  userName: z.string().min(1).max(255).trim(),
});

export const createConversationSchema = z.object({
  title: z.string().min(1).max(255).trim().default('New Conversation'),
});

export const addMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1, 'Message content is required'),
});

export const chatReplySchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  content: z.string().min(1, 'Message content is required'),
  role: z.enum(['user', 'assistant']).default('user'),
});

export const aiWorkoutSchema = z.object({
  level: z.number().int().min(1).max(5).optional(),
  goal: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  injuries: z.array(z.string()).optional(),
});

export const aiReplacementSchema = z.object({
  exerciseId: z.string().optional(),
  constraints: z.object({
    equipment: z.array(z.string()).optional(),
    targetMuscles: z.array(z.string()).optional(),
  }).optional(),
});

export const aiOverloadSchema = z.object({
  exerciseId: z.string().optional(),
  history: z.array(z.object({
    reps: z.number(),
    weight: z.number(),
    date: z.string(),
  })).optional(),
});

export const aiRecoverySchema = z.object({
  lastWorkout: z.string().datetime().optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  stressLevel: z.number().min(0).max(10).optional(),
});

export const aiNutritionSchema = z.object({
  calories: z.number().positive(),
  macros: z.object({
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional(),
  }).optional(),
});

export const createBattleSchema = z.object({
  type: z.string().min(1, 'Battle type is required').max(100).trim(),
  opponentId: z.string().uuid('Valid opponent ID is required'),
});

export const updateScoreSchema = z.object({
  score: z.number().min(0, 'Score must be non-negative'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).trim().optional(),
  avatar: z.string().max(500).optional(),
});

export const updateSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system', 'amoled']).optional(),
  units: z.enum(['metric', 'imperial']).optional(),
  notifications: z.record(z.boolean()).optional(),
});

export const joinCommunitySchema = z.object({
  userName: z.string().min(1).max(255).trim(),
});

// ============================================
// USER PROFILE EXTENDED
// ============================================

export const updateProfileDetailsSchema = z.object({
  bio: z.string().max(2000).trim().optional(),
  dateOfBirth: z.string().optional(),
  height: z.number().positive().optional(),
  heightUnit: z.enum(['cm', 'ft']).optional(),
  goal: z.string().max(255).trim().optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced', 'elite']).optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).optional(),
  equipment: z.array(z.string()).optional(),
  injuries: z.array(z.string()).optional(),
  preferences: z.record(z.unknown()).optional(),
});

export const onboardingSchema = z.object({
  goal: z.string().min(1, 'Goal is required').max(255).trim(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced', 'elite']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  equipment: z.array(z.string()).default([]),
  injuries: z.array(z.string()).default([]),
});

// ============================================
// ACHIEVEMENTS & LEVELS
// ============================================

export const createAchievementSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  description: z.string().min(1).trim(),
  icon: z.string().max(500).trim(),
  category: z.string().max(100).trim(),
  xpReward: z.number().int().min(0).default(0),
  criteria: z.record(z.unknown()).default({}),
});

// ============================================
// BATTLE PASS & SEASONS
// ============================================

export const createSeasonSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  description: z.string().trim().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

export const claimBattlePassRewardSchema = z.object({
  tier: z.number().int().positive('Tier must be positive'),
});

// ============================================
// HABITS
// ============================================

export const createHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  description: z.string().trim().optional(),
  category: z.string().max(100).trim(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  target: z.number().int().positive().default(1),
  unit: z.string().max(50).trim().optional(),
});

export const updateHabitSchema = createHabitSchema.partial().extend({
  active: z.boolean().optional(),
});

export const logHabitSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  value: z.number().min(0).default(1),
  note: z.string().trim().optional(),
});

// ============================================
// CHALLENGES
// ============================================

export const createChallengeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  description: z.string().min(1).trim(),
  type: z.string().max(100).trim(),
  goal: z.record(z.unknown()),
  reward: z.record(z.unknown()).default({}),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

// ============================================
// HEALTH METRICS
// ============================================

export const logSleepSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  duration: z.number().int().positive('Duration must be positive'),
  quality: z.number().int().min(1).max(10).optional(),
  deepSleep: z.number().int().optional(),
  remSleep: z.number().int().optional(),
  lightSleep: z.number().int().optional(),
  awakeTime: z.number().int().optional(),
  source: z.string().max(100).trim().optional(),
});

export const logHRVSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  hrv: z.number().positive('HRV must be positive'),
  rmssd: z.number().optional(),
  sdnn: z.number().optional(),
  source: z.string().max(100).trim().optional(),
});

export const logMoodSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  mood: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(10).optional(),
  stress: z.number().int().min(1).max(10).optional(),
  note: z.string().trim().optional(),
});

export const healthSyncSchema = z.object({
  readings: z
    .array(
      z.object({
        source: z.enum(['apple', 'google']),
        metric: z.string().min(1, 'Metric is required').max(100).trim(),
        value: z.number(),
        recordedAt: z.string().datetime().optional(),
      })
    )
    .min(1, 'At least one reading is required'),
});

// ============================================
// ACCOUNT (password reset / email verification)
// ============================================

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format').transform((e) => e.toLowerCase().trim()),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export const pushTokenSchema = z.object({
  token: z.string().min(1, 'Push token is required'),
  platform: z.enum(['ios', 'android', 'web']).default('web'),
});

export const notificationReadSchema = z.object({
  id: z.string().min(1, 'Notification id is required'),
});

export const leaderboardQuerySchema = z.object({
  metric: z.enum(['workouts', 'calories', 'strength', 'cardio']).default('workouts'),
});

export const exerciseQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export const createCustomWorkoutSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  type: z.enum(['strength', 'cardio', 'hybrid']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().optional(),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string().min(1, 'exerciseId is required'),
        name: z.string().max(255).optional(),
        sets: z.number().int().min(0).optional(),
        reps: z.number().int().min(0).optional(),
        restSec: z.number().int().min(0).optional(),
        order: z.number().int().min(0).optional(),
      })
    )
    .optional(),
});
