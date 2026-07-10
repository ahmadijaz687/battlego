import { prisma } from '../services/database.js';

export async function getHabits(userId: string) {
  return prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getActiveHabits(userId: string) {
  return prisma.habit.findMany({
    where: { userId, active: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createHabit(userId: string, data: {
  name: string;
  description?: string;
  category: string;
  frequency?: string;
  target?: number;
  unit?: string;
}) {
  return prisma.habit.create({
    data: { userId, ...data },
  });
}

export async function updateHabit(habitId: string, userId: string, data: {
  name?: string;
  description?: string;
  category?: string;
  frequency?: string;
  target?: number;
  unit?: string;
  active?: boolean;
}) {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) throw new Error('Habit not found');
  return prisma.habit.update({
    where: { id: habitId },
    data,
  });
}

export async function deleteHabit(habitId: string, userId: string) {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) throw new Error('Habit not found');
  await prisma.habit.delete({ where: { id: habitId } });
}

export async function logHabit(habitId: string, userId: string, data: {
  date: string;
  value?: number;
  note?: string;
}) {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) throw new Error('Habit not found');

  return prisma.$transaction(async (tx) => {
    const log = await tx.habitLog.upsert({
      where: { habitId_date: { habitId, date: new Date(data.date) } },
      update: { value: data.value ?? 1, note: data.note },
      create: { habitId, date: new Date(data.date), value: data.value ?? 1, note: data.note },
    });
    await updateStreakWithTx(tx, habitId, userId);
    return log;
  });
}

export async function getHabitLogs(habitId: string, userId: string, days = 30) {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) throw new Error('Habit not found');

  const since = new Date();
  since.setDate(since.getDate() - days);

  return prisma.habitLog.findMany({
    where: { habitId, date: { gte: since } },
    orderBy: { date: 'desc' },
  });
}

async function updateStreakWithTx(tx: Parameters<typeof prisma.$transaction>[0] extends (arg: infer T) => unknown ? T : never, habitId: string, userId: string) {
  const logs = await tx.habitLog.findMany({
    where: { habit: { id: habitId, userId } },
    orderBy: { date: 'desc' },
    take: 365,
  });

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].date);
    logDate.setHours(0, 0, 0, 0);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (logDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  const habit = await tx.habit.findUnique({ where: { id: habitId } });
  if (!habit) return;

  await tx.habit.update({
    where: { id: habitId },
    data: {
      streak,
      longestStreak: Math.max(streak, habit.longestStreak),
    },
  });
}

export async function getHabitStats(userId: string) {
  const habits = await prisma.habit.findMany({
    where: { userId, active: true },
  });

  const total = habits.length;
  const tracked = habits.filter((h) => h.streak > 0).length;
  const bestStreak = Math.max(...habits.map((h) => h.longestStreak), 0);

  return {
    total,
    tracked,
    completionRate: total > 0 ? Math.round((tracked / total) * 100) : 0,
    bestStreak,
    habits: habits.map((h) => ({
      id: h.id,
      name: h.name,
      category: h.category,
      streak: h.streak,
      longestStreak: h.longestStreak,
    })),
  };
}
