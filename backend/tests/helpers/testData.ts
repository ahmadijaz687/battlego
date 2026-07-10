import { prisma } from '../../src/services/database.js';
import type { Prisma } from '@prisma/client';
import { hashPassword } from './generators.js';

export const TEST_USER_ID = 'test-user-id';
export const TEST_USER_EMAIL = 'test@example.com';
export const TEST_USER_PASSWORD = 'TestPass123!';
export const TEST_CHALLENGE_ID = 'challenge-1';
export const TEST_ACHIEVEMENT_NAME = 'first-workout';

export type WithRequired<T, K extends keyof T> = Pick<Required<T>, K> & Omit<T, K>;

export async function seedTestFixtures() {
  const hashedPassword = await hashPassword(TEST_USER_PASSWORD);

  const userInput: Prisma.UserCreateInput = {
    id: TEST_USER_ID,
    email: TEST_USER_EMAIL,
    password: hashedPassword,
    name: 'Test User',
    avatar: '',
  };

  await prisma.user.upsert({
    where: { email: TEST_USER_EMAIL },
    update: {},
    create: userInput,
  });

  const settingsInput: Prisma.UserSettingsCreateInput = {
    userId: TEST_USER_ID,
    theme: 'dark',
    units: 'imperial',
    notifications: JSON.stringify({ workout: true, nutrition: true, social: true, battle: true }),
  };

  await prisma.userSettings.upsert({
    where: { userId: TEST_USER_ID },
    update: {},
    create: settingsInput,
  });

  const achievementInput: Prisma.AchievementCreateInput = {
    name: TEST_ACHIEVEMENT_NAME,
    description: 'Complete your first workout',
    icon: '🏋️',
    category: 'workout',
    xpReward: 100,
    criteria: JSON.stringify({ type: 'workout_complete', count: 1 }),
  };

  await prisma.achievement.upsert({
    where: { name: TEST_ACHIEVEMENT_NAME },
    update: {},
    create: achievementInput,
  });

  const challengeInput: Prisma.ChallengeCreateInput = {
    id: TEST_CHALLENGE_ID,
    name: 'Test Challenge',
    description: 'A test challenge for e2e testing',
    type: 'steps',
    goal: JSON.stringify({ steps: 10000 }),
    reward: JSON.stringify({ xp: 100 }),
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    createdBy: TEST_USER_ID,
  };

  await prisma.challenge.upsert({
    where: { id: TEST_CHALLENGE_ID },
    update: {},
    create: challengeInput,
  });
}

export async function clearTestFixtures() {
  await prisma.challengeParticipant.deleteMany({ where: { challengeId: TEST_CHALLENGE_ID } });
  await prisma.challenge.deleteMany({ where: { id: TEST_CHALLENGE_ID } });
  await prisma.userAchievement.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.userLevel.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.userSettings.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.friend.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.friendRequest.deleteMany({ where: { senderId: TEST_USER_ID } });
  await prisma.friendRequest.deleteMany({ where: { receiverId: TEST_USER_ID } });
  await prisma.notification.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.battlePass.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.message.deleteMany({ where: { senderId: TEST_USER_ID } });
  await prisma.conversationMember.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.communityMember.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.post.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.story.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.user.deleteMany({ where: { id: TEST_USER_ID } });
}
