import { prisma } from './database.js';

interface MetricsSnapshot {
  workoutsCompleted: number;
  totalVolume: number;
  totalDuration: number;
  totalCaloriesBurned: number;
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageSleep: number;
  weightChange: number;
  currentStreak: number;
}

async function getMetrics(userId: string, startDate: Date, endDate: Date): Promise<MetricsSnapshot> {
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      completedAt: { gte: startDate, lte: endDate },
    },
    include: {
      sections: {
        include: {
          exercises: {
            include: {
              sets: true,
            },
          },
        },
      },
    },
  });

  const meals = await prisma.meal.findMany({
    where: {
      userId,
      createdAt: { gte: startDate, lte: endDate },
    },
    include: {
      foods: {
        include: { food: true },
      },
    },
  });

  const dayCount = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

  let totalVolume = 0;
  let totalDuration = 0;
  let totalCaloriesBurned = 0;

  for (const workout of workouts) {
    totalDuration += workout.duration;
    totalCaloriesBurned += workout.duration * 7;
    for (const section of workout.sections) {
      for (const exercise of section.exercises) {
        for (const set of exercise.sets) {
          if (set.weight && set.reps) {
            totalVolume += set.weight * set.reps;
          }
        }
      }
    }
  }

  let totalMealCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  for (const meal of meals) {
    for (const mf of meal.foods) {
      totalMealCalories += mf.food.calories * mf.quantity;
      totalProtein += mf.food.protein * mf.quantity;
      totalCarbs += mf.food.carbs * mf.quantity;
      totalFat += mf.food.fat * mf.quantity;
    }
  }

  const mealCount = meals.length || 1;

  const weightLogs = await prisma.weightLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 2,
  });

  const weightChange = weightLogs.length >= 2
    ? weightLogs[0].weight - weightLogs[1].weight
    : 0;

  const sleepHours = 7;

  const recentWorkouts = await prisma.workout.findMany({
    where: { userId, completedAt: { not: null } },
    orderBy: { completedAt: 'desc' },
    take: 30,
  });

  let currentStreak = 0;
  if (recentWorkouts.length > 0) {
    const dates = recentWorkouts
      .map((w) => w.completedAt)
      .filter((d): d is Date => d !== null)
      .map((d) => d.toISOString().split('T')[0]);
    const uniqueDates = [...new Set(dates)].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const checkDate = new Date(today);
    for (const dateStr of uniqueDates) {
      const expected = checkDate.toISOString().split('T')[0];
      if (dateStr === expected) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return {
    workoutsCompleted: workouts.length,
    totalVolume,
    totalDuration,
    totalCaloriesBurned,
    averageCalories: Math.round(totalMealCalories / dayCount),
    averageProtein: Math.round(totalProtein / mealCount),
    averageCarbs: Math.round(totalCarbs / mealCount),
    averageFat: Math.round(totalFat / mealCount),
    averageSleep: sleepHours,
    weightChange: Math.round(weightChange * 10) / 10,
    currentStreak,
  };
}

function formatSummary(period: string, metrics: MetricsSnapshot, goals?: string): string {
  const parts: string[] = [];

  parts.push(`📊 ${period.charAt(0).toUpperCase() + period.slice(1)} Fitness Summary`);
  parts.push(``);

  if (goals) {
    parts.push(`🎯 Goal: ${goals}`);
    parts.push(``);
  }

  parts.push(`**Workouts**`);
  parts.push(`- Workouts completed: ${metrics.workoutsCompleted}`);
  parts.push(`- Total training time: ${metrics.totalDuration} minutes`);
  parts.push(`- Total training volume: ${metrics.totalVolume.toLocaleString()} kg/lbs`);
  parts.push(`- Estimated calories burned: ${metrics.totalCaloriesBurned}`);
  parts.push(`- Current streak: ${metrics.currentStreak} days`);
  parts.push(``);

  parts.push(`**Nutrition**`);
  parts.push(`- Average daily calories: ~${metrics.averageCalories}`);
  parts.push(`- Average protein: ~${metrics.averageProtein}g`);
  parts.push(`- Average carbs: ~${metrics.averageCarbs}g`);
  parts.push(`- Average fat: ~${metrics.averageFat}g`);
  parts.push(``);

  parts.push(`**Recovery**`);
  parts.push(`- Average sleep: ~${metrics.averageSleep}h`);
  parts.push(`- Weight change: ${metrics.weightChange >= 0 ? '+' : ''}${metrics.weightChange}`);

  if (metrics.currentStreak >= 7) {
    parts.push(``);
    parts.push(`🔥 You're on a ${metrics.currentStreak}-day streak! Amazing consistency!`);
  }

  parts.push(``);
  parts.push(`**Recommendations**`);
  const recommendations: string[] = [];

  if (metrics.averageProtein < 120) {
    recommendations.push(`📈 Increase protein intake to at least 120g/day for better recovery.`);
  }
  if (metrics.averageCalories < 1800) {
    recommendations.push(`🍽️ Your calorie intake seems low — ensure you're eating enough to fuel your training.`);
  }
  if (metrics.averageSleep < 7) {
    recommendations.push(`😴 Prioritize sleep — aim for 7-9 hours for optimal recovery.`);
  }
  if (metrics.workoutsCompleted < 3) {
    recommendations.push(`💪 Try to complete at least 3 workouts per week for consistent progress.`);
  }

  if (recommendations.length === 0) {
    recommendations.push(`✅ Great work! Keep doing what you're doing — consistency is key.`);
  }

  recommendations.forEach((r) => parts.push(r));

  return parts.join('\n');
}

export async function generateDailySummary(userId: string): Promise<string> {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 1);

  const metrics = await getMetrics(userId, startDate, endDate);

  const settings = await prisma.userSettings.findUnique({ where: { userId } });
  const goals = settings?.notifications ? JSON.stringify(settings.notifications) : undefined;

  return formatSummary('daily', metrics, goals);
}

export async function generateWeeklySummary(userId: string): Promise<string> {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 7);

  const metrics = await getMetrics(userId, startDate, endDate);

  const settings = await prisma.userSettings.findUnique({ where: { userId } });
  const goals = settings?.notifications ? JSON.stringify(settings.notifications) : undefined;

  return formatSummary('weekly', metrics, goals);
}

export async function generateMonthlySummary(userId: string): Promise<string> {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - 1);

  const metrics = await getMetrics(userId, startDate, endDate);

  const settings = await prisma.userSettings.findUnique({ where: { userId } });
  const goals = settings?.notifications ? JSON.stringify(settings.notifications) : undefined;

  return formatSummary('monthly', metrics, goals);
}
