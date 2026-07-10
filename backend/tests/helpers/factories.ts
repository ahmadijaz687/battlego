import type { Prisma } from '@prisma/client';
import { uniqueId, genEmail } from './generators.js';

// ─── User ──────────────────────────────────────────────────────────────
export function buildUserInput(
  overrides?: Partial<Prisma.UserCreateInput>,
): Prisma.UserCreateInput {
  const id = overrides?.id || uniqueId('user');
  return {
    id,
    email: genEmail(id),
    password: 'password-placeholder',
    name: genName(id),
    ...overrides,
    id,
    email: overrides?.email || genEmail(id),
    name: overrides?.name || genName(id),
  };
}

// ─── Workout ───────────────────────────────────────────────────────────
export function buildWorkoutInput(
  userId: string,
  overrides?: Partial<Prisma.WorkoutCreateInput>,
): Prisma.WorkoutCreateInput {
  const id = uniqueId('workout');
  return {
    id,
    userId,
    name: `Workout ${id}`,
    type: 'strength',
    difficulty: 'intermediate',
    duration: 45,
    ...overrides,
    id,
  };
}

export function buildWorkoutSectionInput(
  workoutId: string,
  overrides?: Partial<Prisma.WorkoutSectionCreateInput>,
): Prisma.WorkoutSectionCreateInput {
  const id = uniqueId('section');
  return {
    id,
    workoutId,
    type: 'circuit',
    name: `Section ${id}`,
    ...overrides,
    id,
  };
}

export function buildWorkoutExerciseInput(
  sectionId: string,
  overrides?: Partial<Prisma.WorkoutExerciseCreateInput>,
): Prisma.WorkoutExerciseCreateInput {
  const id = uniqueId('wkt-ex');
  return {
    id,
    sectionId,
    name: `Exercise ${id}`,
    ...overrides,
    id,
  };
}

export function buildWorkoutSetInput(
  exerciseId: string,
  setNumber: number,
  overrides?: Partial<Prisma.WorkoutSetCreateInput>,
): Prisma.WorkoutSetCreateInput {
  const id = uniqueId('set');
  return {
    id,
    exerciseId,
    setNumber,
    reps: 10,
    weight: 50,
    ...overrides,
    id,
  };
}

// ─── Nutrition ─────────────────────────────────────────────────────────
export function buildFoodInput(
  overrides?: Partial<Prisma.FoodCreateInput>,
): Prisma.FoodCreateInput {
  const id = uniqueId('food');
  return {
    id,
    name: `Food ${id}`,
    calories: 200,
    protein: 20,
    carbs: 25,
    fat: 5,
    servingSize: '100g',
    ...overrides,
    id,
  };
}

export function buildMealInput(
  userId: string,
  overrides?: Partial<Prisma.MealCreateInput>,
): Prisma.MealCreateInput {
  const id = uniqueId('meal');
  return {
    id,
    userId,
    name: `Meal ${id}`,
    ...overrides,
    id,
  };
}

export function buildWaterLogInput(
  userId: string,
  overrides?: Partial<Prisma.WaterLogCreateInput>,
): Prisma.WaterLogCreateInput {
  const id = uniqueId('water');
  return {
    id,
    userId,
    amount: 250,
    ...overrides,
    id,
  };
}

export function buildWeightLogInput(
  userId: string,
  overrides?: Partial<Prisma.WeightLogCreateInput>,
): Prisma.WeightLogCreateInput {
  const id = uniqueId('weight');
  return {
    id,
    userId,
    date: new Date().toISOString().split('T')[0],
    weight: 75,
    unit: 'kg',
    ...overrides,
    id,
  };
}

// ─── Gamification ──────────────────────────────────────────────────────
export function buildAchievementInput(
  overrides?: Partial<Prisma.AchievementCreateInput>,
): Prisma.AchievementCreateInput {
  const name = overrides?.name || uniqueId('achievement');
  return {
    name,
    description: `Achievement ${name}`,
    icon: '🏆',
    category: 'workout',
    xpReward: 100,
    ...overrides,
    name,
  };
}

export function buildUserAchievementInput(
  userId: string,
  achievementId: string,
  overrides?: Partial<Prisma.UserAchievementCreateInput>,
): Prisma.UserAchievementCreateInput {
  const id = uniqueId('ua');
  return {
    id,
    userId,
    achievementId,
    ...overrides,
    id,
  };
}

// ─── Challenges ────────────────────────────────────────────────────────
export function buildChallengeInput(
  createdBy: string,
  overrides?: Partial<Prisma.ChallengeCreateInput>,
): Prisma.ChallengeCreateInput {
  const id = uniqueId('challenge');
  return {
    id,
    name: `Challenge ${id}`,
    description: `Description for ${id}`,
    type: 'steps',
    goal: { steps: 10000 },
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    createdBy,
    ...overrides,
    id,
  };
}

export function buildChallengeParticipantInput(
  challengeId: string,
  userId: string,
  overrides?: Partial<Prisma.ChallengeParticipantCreateInput>,
): Prisma.ChallengeParticipantCreateInput {
  const id = uniqueId('cp');
  return {
    id,
    challengeId,
    userId,
    ...overrides,
    id,
  };
}

// ─── Social ────────────────────────────────────────────────────────────
export function buildPostInput(
  userId: string,
  userName: string,
  overrides?: Partial<Prisma.PostCreateInput>,
): Prisma.PostCreateInput {
  const id = uniqueId('post');
  return {
    id,
    userId,
    userName,
    content: `Post content ${id}`,
    type: 'update',
    ...overrides,
    id,
  };
}

export function buildStoryInput(
  userId: string,
  userName: string,
  overrides?: Partial<Prisma.StoryCreateInput>,
): Prisma.StoryCreateInput {
  const id = uniqueId('story');
  return {
    id,
    userId,
    userName,
    duration: 24,
    expiresAt: new Date(Date.now() + 86400000),
    ...overrides,
    id,
  };
}

export function buildFriendInput(
  userId: string,
  friendId: string,
  overrides?: Partial<Prisma.FriendCreateInput>,
): Prisma.FriendCreateInput {
  const id = uniqueId('friend');
  return {
    id,
    userId,
    friendId,
    name: genName(friendId),
    username: friendId,
    status: 'accepted',
    ...overrides,
    id,
  };
}

export function buildFriendRequestInput(
  userId: string,
  fromUserId: string,
  overrides?: Partial<Prisma.FriendRequestCreateInput>,
): Prisma.FriendRequestCreateInput {
  const id = uniqueId('fr');
  return {
    id,
    userId,
    fromUserId,
    fromUserName: genName(fromUserId),
    status: 'pending',
    ...overrides,
    id,
  };
}

// ─── AI ────────────────────────────────────────────────────────────────
export function buildAIConversationInput(
  userId: string,
  overrides?: Partial<Prisma.AIConversationCreateInput>,
): Prisma.AIConversationCreateInput {
  const id = uniqueId('ai-conv');
  return {
    id,
    userId,
    title: `Conversation ${id}`,
    ...overrides,
    id,
  };
}

export function buildAIMessageInput(
  conversationId: string,
  overrides?: Partial<Prisma.AIMessageCreateInput>,
): Prisma.AIMessageCreateInput {
  const id = uniqueId('ai-msg');
  return {
    id,
    conversationId,
    role: 'user',
    content: `Message ${id}`,
    ...overrides,
    id,
  };
}

// ─── Battles ───────────────────────────────────────────────────────────
export function buildBattleInput(
  creatorId: string,
  overrides?: Partial<Prisma.BattleCreateInput>,
): Prisma.BattleCreateInput {
  const id = uniqueId('battle');
  return {
    id,
    creatorId,
    type: 'steps',
    status: 'pending',
    ...overrides,
    id,
  };
}

// ─── Health ────────────────────────────────────────────────────────────
export function buildSleepLogInput(
  userId: string,
  overrides?: Partial<Prisma.SleepLogCreateInput>,
): Prisma.SleepLogCreateInput {
  const id = uniqueId('sleep');
  return {
    id,
    userId,
    date: new Date().toISOString().split('T')[0],
    duration: 480,
    ...overrides,
    id,
  };
}

export function buildHRVLogInput(
  userId: string,
  overrides?: Partial<Prisma.HRVLogCreateInput>,
): Prisma.HRVLogCreateInput {
  const id = uniqueId('hrv');
  return {
    id,
    userId,
    date: new Date().toISOString().split('T')[0],
    hrv: 65,
    ...overrides,
    id,
  };
}

export function buildMoodLogInput(
  userId: string,
  overrides?: Partial<Prisma.MoodLogCreateInput>,
): Prisma.MoodLogCreateInput {
  const id = uniqueId('mood');
  return {
    id,
    userId,
    date: new Date().toISOString().split('T')[0],
    mood: 7,
    ...overrides,
    id,
  };
}

// ─── Habits ────────────────────────────────────────────────────────────
export function buildHabitInput(
  userId: string,
  overrides?: Partial<Prisma.HabitCreateInput>,
): Prisma.HabitCreateInput {
  const id = uniqueId('habit');
  return {
    id,
    userId,
    name: `Habit ${id}`,
    category: 'fitness',
    ...overrides,
    id,
  };
}

export function buildHabitLogInput(
  habitId: string,
  overrides?: Partial<Prisma.HabitLogCreateInput>,
): Prisma.HabitLogCreateInput {
  const id = uniqueId('habit-log');
  return {
    id,
    habitId,
    date: new Date().toISOString().split('T')[0],
    ...overrides,
    id,
  };
}
