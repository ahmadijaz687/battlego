import { prisma } from '../../src/services/database.js';
import type { Prisma } from '@prisma/client';
import {
  buildUserInput,
  buildWorkoutInput,
  buildFoodInput,
  buildMealInput,
  buildAchievementInput,
  buildChallengeInput,
  buildChallengeParticipantInput,
  buildPostInput,
  buildAIConversationInput,
  buildAIMessageInput,
  buildBattleInput,
  buildSleepLogInput,
  buildHRVLogInput,
  buildMoodLogInput,
  buildHabitInput,
} from './factories.js';
import { hashPassword } from './generators.js';

// ─── User ──────────────────────────────────────────────────────────────
export async function createUser(
  overrides?: Partial<Prisma.UserCreateInput>,
) {
  const hashed = await hashPassword(overrides?.password);
  const input = buildUserInput({ ...overrides, password: hashed });
  const user = await prisma.user.create({ data: input });

  await prisma.userLevel.create({ data: { userId: user.id } });
  await prisma.userSettings.create({ data: { userId: user.id } });

  return user;
}

export async function createUsers(count: number) {
  const users = [] as Awaited<ReturnType<typeof createUser>>[];
  for (let i = 0; i < count; i++) {
    users.push(await createUser());
  }
  return users;
}

// ─── Workout ───────────────────────────────────────────────────────────
export async function createWorkout(
  userId: string,
  overrides?: Partial<Prisma.WorkoutCreateInput>,
) {
  const input = buildWorkoutInput(userId, overrides);
  return prisma.workout.create({ data: input });
}

export async function createFullWorkout(
  userId: string,
  overrides?: Partial<Prisma.WorkoutCreateInput>,
) {
  const workout = await createWorkout(userId, overrides);

  const section = await prisma.workoutSection.create({
    data: {
      workoutId: workout.id,
      type: 'circuit',
      name: 'Circuit 1',
    },
  });

  const exercise = await prisma.workoutExercise.create({
    data: {
      sectionId: section.id,
      name: 'Bench Press',
    },
  });

  await prisma.workoutSet.create({
    data: {
      exerciseId: exercise.id,
      setNumber: 1,
      reps: 10,
      weight: 50,
    },
  });

  return { workout, section, exercise };
}

// ─── Nutrition ─────────────────────────────────────────────────────────
export async function createFood(
  overrides?: Partial<Prisma.FoodCreateInput>,
) {
  const input = buildFoodInput(overrides);
  return prisma.food.create({ data: input });
}

export async function createMeal(
  userId: string,
  foodIds: string[],
  overrides?: Partial<Prisma.MealCreateInput>,
) {
  const input = buildMealInput(userId, overrides);
  const meal = await prisma.meal.create({ data: input });

  for (const foodId of foodIds) {
    await prisma.mealFood.create({
      data: {
        mealId: meal.id,
        foodId,
        quantity: 1,
      },
    });
  }

  return meal;
}

// ─── Gamification ──────────────────────────────────────────────────────
export async function createAchievement(
  overrides?: Partial<Prisma.AchievementCreateInput>,
) {
  const input = buildAchievementInput(overrides);
  return prisma.achievement.create({ data: input });
}

export async function unlockAchievement(userId: string, achievementName: string) {
  const achievement = await prisma.achievement.findUniqueOrThrow({
    where: { name: achievementName },
  });
  return prisma.userAchievement.create({
    data: { userId, achievementId: achievement.id },
  });
}

// ─── Challenges ────────────────────────────────────────────────────────
export async function createChallenge(
  createdBy: string,
  overrides?: Partial<Prisma.ChallengeCreateInput>,
) {
  const input = buildChallengeInput(createdBy, overrides);
  return prisma.challenge.create({ data: input });
}

export async function joinChallenge(challengeId: string, userId: string) {
  const input = buildChallengeParticipantInput(challengeId, userId);
  return prisma.challengeParticipant.create({ data: input });
}

// ─── Social ────────────────────────────────────────────────────────────
export async function createPost(
  userId: string,
  userName: string,
  overrides?: Partial<Prisma.PostCreateInput>,
) {
  const input = buildPostInput(userId, userName, overrides);
  return prisma.post.create({ data: input });
}

// ─── AI ────────────────────────────────────────────────────────────────
export async function createAIConversation(
  userId: string,
  overrides?: Partial<Prisma.AIConversationCreateInput>,
) {
  const input = buildAIConversationInput(userId, overrides);
  return prisma.aIConversation.create({ data: input });
}

export async function createAIMessage(
  conversationId: string,
  overrides?: Partial<Prisma.AIMessageCreateInput>,
) {
  const input = buildAIMessageInput(conversationId, overrides);
  return prisma.aIMessage.create({ data: input });
}

// ─── Battles ───────────────────────────────────────────────────────────
export async function createBattle(
  creatorId: string,
  overrides?: Partial<Prisma.BattleCreateInput>,
) {
  const input = buildBattleInput(creatorId, overrides);
  return prisma.battle.create({ data: input });
}

// ─── Health ────────────────────────────────────────────────────────────
export async function createSleepLog(
  userId: string,
  overrides?: Partial<Prisma.SleepLogCreateInput>,
) {
  const input = buildSleepLogInput(userId, overrides);
  return prisma.sleepLog.create({ data: input });
}

export async function createHRVLog(
  userId: string,
  overrides?: Partial<Prisma.HRVLogCreateInput>,
) {
  const input = buildHRVLogInput(userId, overrides);
  return prisma.hRVLog.create({ data: input });
}

export async function createMoodLog(
  userId: string,
  overrides?: Partial<Prisma.MoodLogCreateInput>,
) {
  const input = buildMoodLogInput(userId, overrides);
  return prisma.moodLog.create({ data: input });
}

// ─── Habits ────────────────────────────────────────────────────────────
export async function createHabit(
  userId: string,
  overrides?: Partial<Prisma.HabitCreateInput>,
) {
  const input = buildHabitInput(userId, overrides);
  return prisma.habit.create({ data: input });
}
