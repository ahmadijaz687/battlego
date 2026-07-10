import { prisma } from './database.js';

export interface UserContext {
  profile: {
    name: string;
    email: string;
    createdAt: string;
  } | null;
  userProfile: {
    goal: string | null;
    experience: string;
    fitnessLevel: string;
    activityLevel: string;
    bio: string | null;
  } | null;
  level: {
    level: number;
    xp: number;
    totalXp: number;
  } | null;
  activeBattles: Array<{
    id: string;
    type: string;
    myScore: number | null;
    opponentScore: number | null;
    status: string;
  }>;
  recentWorkouts: Array<{
    name: string;
    type: string;
    duration: number;
    completedAt: string;
  }>;
  workoutStats: {
    totalWorkouts: number;
    totalMinutes: number;
    averageDuration: number;
    weeklyFrequency: number;
    currentStreak: number;
  };
  recentMeals: Array<{
    name: string;
    time: string;
    totalCalories: number;
  }>;
  nutritionSummary: {
    averageDailyCalories: number;
    averageProtein: number;
    averageCarbs: number;
    averageFat: number;
    waterIntake: number;
    dailyWaterAverage: number;
  };
  weightTrend: Array<{
    date: string;
    weight: number;
    unit: string;
  }>;
  personalRecords: Array<{
    exerciseName: string;
    value: number;
    unit: string;
    date: string;
  }>;
  recentConversations: Array<{
    title: string;
    messageCount: number;
    lastMessage: string;
  }>;
  goals: string;
}

export async function buildUserContext(userId: string): Promise<UserContext> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, createdAt: true },
  });

  const recentWorkouts = await prisma.workout.findMany({
    where: { userId, completedAt: { not: null } },
    orderBy: { completedAt: 'desc' },
    take: 10,
    select: { name: true, type: true, duration: true, completedAt: true },
  });

  const totalWorkouts = await prisma.workout.count({
    where: { userId, completedAt: { not: null } },
  });

  const totalMinutes = recentWorkouts.reduce((sum, w) => sum + w.duration, 0);

  const recentMeals = await prisma.meal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 7,
    include: {
      foods: {
        include: { food: true },
      },
    },
  });

  const weightLogs = await prisma.weightLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 10,
  });

  const personalRecords = await prisma.personalRecord.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 5,
  });

  const recentConversations = await prisma.aIConversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: {
      messages: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
    },
  });

  const settings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  const userProfile = await prisma.userProfile.findUnique({
    where: { userId },
    select: {
      goal: true,
      experience: true,
      fitnessLevel: true,
      activityLevel: true,
      bio: true,
    },
  });

  const userLevel = await prisma.userLevel.findUnique({
    where: { userId },
    select: { level: true, xp: true, totalXp: true },
  });

  const streakAgg = await prisma.habit.aggregate({
    where: { userId, active: true },
    _max: { streak: true },
  });
  const currentStreak = streakAgg._max.streak || 0;

  const activeBattles = await prisma.battle.findMany({
    where: {
      status: 'active',
      OR: [{ creatorId: userId }, { opponentId: userId }],
    },
    orderBy: { startTime: 'desc' },
    take: 5,
    select: {
      id: true,
      creatorId: true,
      type: true,
      creatorScore: true,
      opponentScore: true,
      status: true,
    },
  });

  const mealCalories = recentMeals.map((m) =>
    m.foods.reduce((sum, f) => sum + f.food.calories * f.quantity, 0)
  );

  const averageCalories = mealCalories.length > 0
    ? Math.round(mealCalories.reduce((a, b) => a + b, 0) / mealCalories.length)
    : 0;

  const averageProtein = recentMeals.length > 0
    ? Math.round(
        recentMeals.reduce((sum, m) =>
          sum + m.foods.reduce((s, f) => s + f.food.protein * f.quantity, 0), 0
        ) / recentMeals.length
      )
    : 0;

  const averageCarbs = recentMeals.length > 0
    ? Math.round(
        recentMeals.reduce((sum, m) =>
          sum + m.foods.reduce((s, f) => s + f.food.carbs * f.quantity, 0), 0
        ) / recentMeals.length
      )
    : 0;

  const averageFat = recentMeals.length > 0
    ? Math.round(
        recentMeals.reduce((sum, m) =>
          sum + m.foods.reduce((s, f) => s + f.food.fat * f.quantity, 0), 0
        ) / recentMeals.length
      )
    : 0;

  const totalWater = await prisma.waterLog.aggregate({
    where: { userId, date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    _sum: { amount: true },
  });

  const waterTotal = totalWater._sum.amount || 0;

  return {
    profile: user ? {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    } : null,
    userProfile: userProfile ? {
      goal: userProfile.goal,
      experience: userProfile.experience,
      fitnessLevel: userProfile.fitnessLevel,
      activityLevel: userProfile.activityLevel,
      bio: userProfile.bio,
    } : null,
    level: userLevel ? {
      level: userLevel.level,
      xp: userLevel.xp,
      totalXp: userLevel.totalXp,
    } : null,
    activeBattles: activeBattles.map((b) => ({
      id: b.id,
      type: b.type,
      myScore: b.creatorId === userId ? b.creatorScore : b.opponentScore,
      opponentScore: b.creatorId === userId ? b.opponentScore : b.creatorScore,
      status: b.status,
    })),
    recentWorkouts: recentWorkouts.map((w) => ({
      name: w.name,
      type: w.type,
      duration: w.duration,
      completedAt: w.completedAt?.toISOString() || '',
    })),
    workoutStats: {
      totalWorkouts,
      totalMinutes,
      averageDuration: totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0,
      weeklyFrequency: Math.round(totalWorkouts / Math.max(1, Math.floor((Date.now() - (user?.createdAt?.getTime() || Date.now())) / (7 * 24 * 60 * 60 * 1000)))),
      currentStreak,
    },
    recentMeals: recentMeals.map((m) => ({
      name: m.name,
      time: m.time || '',
      totalCalories: m.foods.reduce((sum, f) => sum + f.food.calories * f.quantity, 0),
    })),
    nutritionSummary: {
      averageDailyCalories: averageCalories,
      averageProtein,
      averageCarbs,
      averageFat,
      waterIntake: waterTotal,
      dailyWaterAverage: Math.round(waterTotal / 7),
    },
    weightTrend: weightLogs.map((w) => ({
      date: w.date,
      weight: w.weight,
      unit: w.unit,
    })),
    personalRecords: personalRecords.map((r) => ({
      exerciseName: r.exerciseName,
      value: r.value,
      unit: r.unit,
      date: r.date.toISOString(),
    })),
    recentConversations: recentConversations.map((c) => ({
      title: c.title,
      messageCount: c.messages.length,
      lastMessage: c.messages[0]?.content?.slice(0, 100) || '',
    })),
    goals: settings?.notifications ? JSON.stringify(settings.notifications) : 'Not specified',
  };
}

export function formatContextForPrompt(context: UserContext): string {
  const parts: string[] = [];

  if (context.profile) {
    parts.push(`User Profile: ${context.profile.name}, member since ${new Date(context.profile.createdAt).toLocaleDateString()}`);
  }

  if (context.userProfile) {
    parts.push(`\nGoals & Profile:`);
    parts.push(`- Primary Goal: ${context.userProfile.goal || 'Not specified'}`);
    parts.push(`- Experience: ${context.userProfile.experience}`);
    parts.push(`- Fitness Level: ${context.userProfile.fitnessLevel}`);
    parts.push(`- Activity Level: ${context.userProfile.activityLevel}`);
    if (context.userProfile.bio) parts.push(`- Bio: ${context.userProfile.bio}`);
  }

  if (context.level) {
    parts.push(`\nProgression: Level ${context.level.level} (${context.level.totalXp} total XP)`);
  }
  parts.push(`Current Streak: ${context.workoutStats.currentStreak} days`);

  parts.push(`\nWorkout Statistics:`);
  parts.push(`- Total Workouts: ${context.workoutStats.totalWorkouts}`);
  parts.push(`- Total Training Minutes: ${context.workoutStats.totalMinutes}`);
  parts.push(`- Average Workout Duration: ${context.workoutStats.averageDuration} minutes`);
  parts.push(`- Weekly Training Frequency: ~${context.workoutStats.weeklyFrequency}x per week`);

  if (context.recentWorkouts.length > 0) {
    parts.push(`\nRecent Workouts (last 10):`);
    context.recentWorkouts.forEach((w) => {
      parts.push(`- ${w.name} (${w.type}): ${w.duration}min on ${new Date(w.completedAt).toLocaleDateString()}`);
    });
  }

  if (context.personalRecords.length > 0) {
    parts.push(`\nPersonal Records:`);
    context.personalRecords.forEach((r) => {
      parts.push(`- ${r.exerciseName}: ${r.value} ${r.unit} (${new Date(r.date).toLocaleDateString()})`);
    });
  }

  if (context.recentMeals.length > 0) {
    parts.push(`\nRecent Nutrition (last 7 days):`);
    parts.push(`- Average daily calories: ~${context.nutritionSummary.averageDailyCalories}`);
    parts.push(`- Average daily protein: ~${context.nutritionSummary.averageProtein}g`);
    parts.push(`- Average daily carbs: ~${context.nutritionSummary.averageCarbs}g`);
    parts.push(`- Average daily fat: ~${context.nutritionSummary.averageFat}g`);
    parts.push(`- Weekly water intake: ${context.nutritionSummary.waterIntake}ml (~${context.nutritionSummary.dailyWaterAverage}ml/day)`);
  }

  if (context.activeBattles.length > 0) {
    parts.push(`\nActive Battles:`);
    context.activeBattles.forEach((b) => {
      parts.push(`- ${b.type}: your score ${b.myScore ?? 0} vs opponent ${b.opponentScore ?? 0}`);
    });
  }

  if (context.weightTrend.length > 0) {
    parts.push(`\nWeight Trend (last ${context.weightTrend.length} entries):`);
    context.weightTrend.forEach((w) => {
      parts.push(`- ${w.date}: ${w.weight} ${w.unit}`);
    });
  }

  if (context.recentConversations.length > 0) {
    parts.push(`\nRecent Coaching Conversations:`);
    context.recentConversations.forEach((c) => {
      parts.push(`- "${c.title}"`);
    });
  }

  return parts.join('\n');
}
