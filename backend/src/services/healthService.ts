import { prisma } from '../services/database.js';

export async function getSleepLogs(userId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return prisma.sleepLog.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: 'desc' },
  });
}

export async function logSleep(userId: string, data: {
  date: string;
  duration: number;
  quality?: number;
  deepSleep?: number;
  remSleep?: number;
  lightSleep?: number;
  awakeTime?: number;
  source?: string;
}) {
  return prisma.sleepLog.upsert({
    where: { userId_date: { userId, date: new Date(data.date) } },
    update: data,
    create: { userId, ...data, date: new Date(data.date) },
  });
}

export async function getHRVLogs(userId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return prisma.hRVLog.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: 'desc' },
  });
}

export async function logHRV(userId: string, data: {
  date: string;
  hrv: number;
  rmssd?: number;
  sdnn?: number;
  source?: string;
}) {
  return prisma.hRVLog.upsert({
    where: { userId_date: { userId, date: new Date(data.date) } },
    update: data,
    create: { userId, ...data, date: new Date(data.date) },
  });
}

export async function getMoodLogs(userId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return prisma.moodLog.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: 'desc' },
  });
}

export async function logMood(userId: string, data: {
  date: string;
  mood: number;
  energy?: number;
  stress?: number;
  note?: string;
}) {
  return prisma.moodLog.upsert({
    where: { userId_date: { userId, date: new Date(data.date) } },
    update: data,
    create: { userId, ...data, date: new Date(data.date) },
  });
}

export async function getReadiness(userId: string) {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [sleepLogs, hrvLogs, moodLogs, lastWorkout] = await Promise.all([
    prisma.sleepLog.findMany({ where: { userId, date: { gte: lastWeek } }, orderBy: { date: 'desc' } }),
    prisma.hRVLog.findMany({ where: { userId, date: { gte: lastWeek } }, orderBy: { date: 'desc' } }),
    prisma.moodLog.findMany({ where: { userId, date: { gte: lastWeek } }, orderBy: { date: 'desc' } }),
    prisma.workout.findFirst({ where: { userId, completedAt: { gte: lastWeek } }, orderBy: { completedAt: 'desc' } }),
  ]);

  const avgSleep = sleepLogs.length > 0
    ? Math.round(sleepLogs.reduce((sum, l) => sum + l.duration, 0) / sleepLogs.length / 3600 * 10) / 10
    : null;
  const avgHRV = hrvLogs.length > 0
    ? Math.round(hrvLogs.reduce((sum, l) => sum + l.hrv, 0) / hrvLogs.length)
    : null;
  const avgMood = moodLogs.length > 0
    ? Math.round(moodLogs.reduce((sum, l) => sum + l.mood, 0) / moodLogs.length * 10) / 10
    : null;

  const readinessScore = [avgSleep ? Math.min(avgSleep / 8, 1) * 40 : 0, avgHRV ? Math.min(avgHRV / 80, 1) * 30 : 0, avgMood ? (avgMood / 10) * 30 : 0]
    .reduce((a, b) => a + b, 0);

  return {
    readinessScore: Math.round(readinessScore),
    sleep: { averageHours: avgSleep, quality: sleepLogs.length > 0 ? Math.round(sleepLogs.reduce((s, l) => s + (l.quality || 0), 0) / sleepLogs.length) : null },
    hrv: { average: avgHRV },
    mood: { average: avgMood },
    lastWorkout: lastWorkout ? { id: lastWorkout.id, completedAt: lastWorkout.completedAt } : null,
  };
}

export async function syncHealthData(
  userId: string,
  readings: Array<{ source: string; metric: string; value: number; recordedAt?: string }>
) {
  const result = await prisma.healthData.createMany({
    data: readings.map((r) => ({
      userId,
      source: r.source,
      metric: r.metric,
      value: r.value,
      recordedAt: r.recordedAt ? new Date(r.recordedAt) : new Date(),
    })),
  });
  return { created: result.count };
}

export async function getHealthDataSummary(userId: string, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const rows = await prisma.healthData.findMany({
    where: { userId, recordedAt: { gte: since } },
    orderBy: { recordedAt: 'desc' },
  });

  const byMetric = (metric: string) => rows.filter((r) => r.metric === metric);
  const average = (arr: { value: number }[]) =>
    arr.length > 0
      ? Math.round((arr.reduce((sum, r) => sum + r.value, 0) / arr.length) * 10) / 10
      : null;

  const steps = byMetric('steps');
  const heartRate = byMetric('heart_rate');
  const sleep = byMetric('sleep');
  const weight = byMetric('weight');

  return {
    days,
    averageSteps: average(steps),
    restingHeartRate: heartRate.length > 0 ? heartRate[0]!.value : null,
    averageSleepHours: average(sleep),
    latestWeight: weight.length > 0 ? weight[0]!.value : null,
    totalReadings: rows.length,
  };
}

export async function getHealthSummary(userId: string, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [sleepLogs, hrvLogs, moodLogs] = await Promise.all([
    prisma.sleepLog.findMany({ where: { userId, date: { gte: since } }, orderBy: { date: 'desc' } }),
    prisma.hRVLog.findMany({ where: { userId, date: { gte: since } }, orderBy: { date: 'desc' } }),
    prisma.moodLog.findMany({ where: { userId, date: { gte: since } }, orderBy: { date: 'desc' } }),
  ]);

  const avgSleep = sleepLogs.length > 0
    ? Math.round(sleepLogs.reduce((sum, l) => sum + l.duration, 0) / sleepLogs.length / 3600 * 10) / 10
    : null;
  const avgHRV = hrvLogs.length > 0
    ? Math.round(hrvLogs.reduce((sum, l) => sum + l.hrv, 0) / hrvLogs.length)
    : null;
  const avgMood = moodLogs.length > 0
    ? Math.round(moodLogs.reduce((sum, l) => sum + l.mood, 0) / moodLogs.length * 10) / 10
    : null;

  return {
    sleep: { logs: sleepLogs, averageHours: avgSleep, totalLogs: sleepLogs.length },
    hrv: { logs: hrvLogs, average: avgHRV, totalLogs: hrvLogs.length },
    mood: { logs: moodLogs, average: avgMood, totalLogs: moodLogs.length },
  };
}
