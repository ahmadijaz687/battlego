import { prisma } from './database.js';

export interface ProactiveSuggestion {
  type: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  actionLabel?: string;
}

export async function checkForProactiveTriggers(userId: string): Promise<ProactiveSuggestion | null> {
  const now = new Date();
  const triggers: ProactiveSuggestion[] = [];

  const lastWorkout = await prisma.workout.findFirst({
    where: { userId, completedAt: { not: null } },
    orderBy: { completedAt: 'desc' },
    select: { completedAt: true },
  });

  if (lastWorkout?.completedAt) {
    const daysSinceLastWorkout = Math.floor(
      (now.getTime() - lastWorkout.completedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastWorkout > 2 && daysSinceLastWorkout <= 5) {
      triggers.push({
        type: 'missed_workout',
        message: `It's been ${daysSinceLastWorkout} days since your last workout. ` +
          `Even a quick 20-minute session keeps the momentum going!`,
        priority: 'medium',
        actionLabel: 'Start Quick Workout',
      });
    } else if (daysSinceLastWorkout > 5 && daysSinceLastWorkout <= 7) {
      triggers.push({
        type: 'missed_workout',
        message: `It's been ${daysSinceLastWorkout} days since you trained. ` +
          `Don't let the gap grow — a workout today will get you back on track!`,
        priority: 'high',
        actionLabel: 'Resume Training',
      });
    } else if (daysSinceLastWorkout > 7) {
      triggers.push({
        type: 'missed_workout',
        message: `It's been over a week since your last workout. ` +
          `The hardest part is showing up. Let's get back to it — you've got this!`,
        priority: 'high',
        actionLabel: 'Restart Training',
      });
    }
  }

  const recentMeals = await prisma.meal.findMany({
    where: { userId, createdAt: { gte: new Date(now.getTime() - 48 * 60 * 60 * 1000) } },
    include: {
      foods: { include: { food: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (recentMeals.length > 0) {
    let totalProtein = 0;
    const mealDays = new Set(
      recentMeals.map((m) => new Date(m.createdAt).toISOString().split('T')[0])
    );
    const daysWithMeals = mealDays.size;

    for (const meal of recentMeals) {
      for (const mf of meal.foods) {
        totalProtein += mf.food.protein * mf.quantity;
      }
    }

    const avgProtein = daysWithMeals > 0 ? totalProtein / daysWithMeals : 0;

    if (avgProtein > 0 && avgProtein < 80) {
      triggers.push({
        type: 'low_protein',
        message: `Your recent protein intake (~${Math.round(avgProtein)}g/day) is below the recommended range. ` +
          `Try adding a protein source to each meal.`,
        priority: 'medium',
        actionLabel: 'View High-Protein Meals',
      });
    }
  }

  const waterLast48h = await prisma.waterLog.aggregate({
    where: { userId, date: { gte: new Date(now.getTime() - 48 * 60 * 60 * 1000) } },
    _sum: { amount: true },
  });

  if (waterLast48h._sum.amount !== null && waterLast48h._sum.amount < 1000) {
    triggers.push({
      type: 'low_hydration',
      message: `Your water intake has been low. Aim for at least 2-3 liters per day ` +
        `for optimal performance and recovery.`,
      priority: 'low',
      actionLabel: 'Log Water',
    });
  }

  const streakInfo = await getStreakMilestone(userId);
  if (streakInfo.current > 0 && streakInfo.current % streakInfo.nextMilestone === 0) {
    const milestone = streakInfo.current;
    let message = '';
    if (milestone === 3) {
      message = `You've completed 3 days in a row! A great start to a new habit. Keep it going!`;
    } else if (milestone === 7) {
      message = `🔥 One full week of consistency! That's how results are built. Amazing work!`;
    } else if (milestone === 14) {
      message = `🌟 Two weeks straight! You're building a powerful habit. Keep showing up!`;
    } else if (milestone === 30) {
      message = `🏆 ONE MONTH of consistent training! You're not just building a body, you're building discipline!`;
    } else {
      message = `🎉 ${milestone} day streak! You're incredibly consistent!`;
    }
    triggers.push({
      type: 'streak_milestone',
      message,
      priority: 'high',
      actionLabel: 'Share Your Streak',
    });
  }

  const recentWeightLogs = await prisma.weightLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 3,
  });

  if (recentWeightLogs.length >= 2) {
    const oldest = recentWeightLogs[recentWeightLogs.length - 1];
    const newest = recentWeightLogs[0];
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    if (new Date(oldest.date) < twoWeeksAgo && Math.abs(newest.weight - oldest.weight) < 0.5) {
      triggers.push({
        type: 'weight_stall',
        message: `Your weight has been stable for over 2 weeks. If you're aiming for change, ` +
          `consider adjusting your calorie intake or training volume.`,
        priority: 'medium',
        actionLabel: 'Review Nutrition',
      });
    }
  }

  const recentNutritionLogs = await prisma.meal.count({
    where: { userId, createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } },
  });

  if (recentNutritionLogs === 0) {
    triggers.push({
      type: 'incomplete_logs',
      message: `You haven't logged any meals today. Tracking helps you stay on top of your nutrition goals!`,
      priority: 'low',
      actionLabel: 'Log a Meal',
    });
  }

  triggers.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 } as const;
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return triggers.length > 0 ? triggers[0] : null;
}

export async function getStreakMilestone(userId: string): Promise<{ current: number; nextMilestone: number }> {
  const recentWorkouts = await prisma.workout.findMany({
    where: { userId, completedAt: { not: null } },
    orderBy: { completedAt: 'desc' },
    select: { completedAt: true },
    take: 60,
  });

  if (recentWorkouts.length === 0) {
    return { current: 0, nextMilestone: 3 };
  }

  const dates = recentWorkouts
    .map((w) => w.completedAt)
    .filter((d): d is Date => d !== null)
    .map((d) => d.toISOString().split('T')[0]);
  const uniqueDates = [...new Set(dates)].sort().reverse();

  const today = new Date().toISOString().split('T')[0];
  let currentStreak = 0;
  let checkDate = new Date(today);

  for (const dateStr of uniqueDates) {
    const expected = checkDate.toISOString().split('T')[0];
    if (dateStr === expected) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (currentStreak > 0) {
      break;
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (dateStr === yesterday.toISOString().split('T')[0]) {
        currentStreak = 1;
        checkDate = new Date(yesterday);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
  const nextMilestone = milestones.find((m) => m > currentStreak) || currentStreak + 30;

  return { current: currentStreak, nextMilestone };
}
