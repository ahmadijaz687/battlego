import { prisma } from '../services/database.js';

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, avatar: true, createdAt: true },
  });
  if (!user) throw new Error('User not found');
  return user;
}

export async function updateProfile(userId: string, data: { name?: string; avatar?: string }) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, name: true, avatar: true },
  });
}

export async function getSettings(userId: string) {
  const settings = await prisma.$transaction(async (tx) => {
    let s = await tx.userSettings.findUnique({ where: { userId } });
    if (!s) {
      s = await tx.userSettings.create({ data: { userId } });
    }
    return s;
  });
  return {
    theme: settings.theme,
    units: settings.units,
    notifications: typeof settings.notifications === 'object' ? settings.notifications : {},
  };
}

export async function updateSettings(
  userId: string,
  data: { theme?: string; units?: string; notifications?: Record<string, unknown> }
) {
  return prisma.userSettings.upsert({
    where: { userId },
    update: data as never,
    create: { userId, ...data } as never,
  });
}

// ============================================
// USER PROFILE DETAILS
// ============================================

export async function getProfileDetails(userId: string) {
  const profile = await prisma.$transaction(async (tx) => {
    let p = await tx.userProfile.findUnique({ where: { userId } });
    if (!p) {
      p = await tx.userProfile.create({ data: { userId } });
    }
    return p;
  });
  return profile;
}

export async function updateProfileDetails(userId: string, data: {
  bio?: string;
  dateOfBirth?: string;
  height?: number;
  heightUnit?: string;
  goal?: string;
  experience?: string;
  fitnessLevel?: string;
  activityLevel?: string;
  equipment?: string[];
  injuries?: string[];
  preferences?: Record<string, unknown>;
}) {
  return prisma.userProfile.upsert({
    where: { userId },
    update: {
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.dateOfBirth !== undefined && { dateOfBirth: new Date(data.dateOfBirth) }),
      ...(data.height !== undefined && { height: data.height }),
      ...(data.heightUnit !== undefined && { heightUnit: data.heightUnit }),
      ...(data.goal !== undefined && { goal: data.goal }),
      ...(data.experience !== undefined && { experience: data.experience }),
      ...(data.fitnessLevel !== undefined && { fitnessLevel: data.fitnessLevel }),
      ...(data.activityLevel !== undefined && { activityLevel: data.activityLevel }),
      ...(data.equipment !== undefined && { equipment: data.equipment as never }),
      ...(data.injuries !== undefined && { injuries: data.injuries as never }),
      ...(data.preferences !== undefined && { preferences: data.preferences as never }),
    },
    create: {
      userId,
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.dateOfBirth !== undefined && { dateOfBirth: new Date(data.dateOfBirth) }),
      ...(data.height !== undefined && { height: data.height }),
      ...(data.goal !== undefined && { goal: data.goal }),
      ...(data.experience !== undefined && { experience: data.experience }),
      ...(data.fitnessLevel !== undefined && { fitnessLevel: data.fitnessLevel }),
      ...(data.activityLevel !== undefined && { activityLevel: data.activityLevel }),
      ...(data.equipment !== undefined && { equipment: data.equipment as never }),
      ...(data.injuries !== undefined && { injuries: data.injuries as never }),
    },
  });
}

export async function getProfileStats(userId: string) {
  const [workoutCount, battleCount, achievementCount, currentStreak] = await Promise.all([
    prisma.workout.count({ where: { userId, completedAt: { not: null } } }),
    prisma.battle.count({
      where: { OR: [{ creatorId: userId }, { opponentId: userId }], status: 'completed' },
    }),
    prisma.userAchievement.count({ where: { userId } }),
    prisma.workout.count({
      where: { userId, completedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  const totalWorkouts = await prisma.workout.count({ where: { userId } });

  return {
    totalWorkouts,
    completedWorkouts: workoutCount,
    completedBattles: battleCount,
    achievements: achievementCount,
    weeklyWorkouts: currentStreak,
  };
}

export async function updateProfileAvatar(userId: string, avatarUrl: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatar: avatarUrl },
    select: { id: true, name: true, email: true, avatar: true },
  });
}

export async function completeOnboarding(userId: string, data: {
  goal: string;
  experience: string;
  fitnessLevel: string;
  activityLevel: string;
  equipment: string[];
  injuries: string[];
}) {
  return prisma.userProfile.upsert({
    where: { userId },
    update: { ...data, onboardingComplete: true },
    create: { userId, ...data, onboardingComplete: true },
  });
}

export async function getOnboardingStatus(userId: string) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { onboardingComplete: true },
  });
  return { onboardingComplete: profile?.onboardingComplete ?? false };
}
