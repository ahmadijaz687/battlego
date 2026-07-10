import { randomUUID } from 'expo-crypto';
import { getDatabase, type DB } from '../database';
import type { SleepLogRow, HrvLogRow, MoodLogRow } from '../database/types';
import { now, today, daysAgo } from '../database/helpers';

function getDb(): DB {
  return getDatabase();
}

// ── Sleep ──────────────────────────────────────────────────────

export function logSleep(userId: string, data: {
  date?: string; duration: number; quality?: number;
  deepSleep?: number; remSleep?: number; lightSleep?: number;
  awakeTime?: number; source?: string;
}): SleepLogRow {
  const d = getDb();
  const logDate = data.date ?? today();
  const id = randomUUID();

  const existing = d.getFirstSync<SleepLogRow>(
    'SELECT * FROM sleep_logs WHERE user_id = ? AND date = ?', [userId, logDate]
  );
  if (existing) {
    d.runSync(
      `UPDATE sleep_logs SET duration = ?, quality = ?, deep_sleep = ?, rem_sleep = ?,
       light_sleep = ?, awake_time = ?, source = ? WHERE id = ?`,
      [data.duration, data.quality ?? null, data.deepSleep ?? null, data.remSleep ?? null,
       data.lightSleep ?? null, data.awakeTime ?? null, data.source ?? null, existing.id]
    );
    return d.getFirstSync<SleepLogRow>('SELECT * FROM sleep_logs WHERE id = ?', [existing.id])!;
  }

  d.runSync(
    `INSERT INTO sleep_logs (id, user_id, date, duration, quality, deep_sleep, rem_sleep, light_sleep, awake_time, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, logDate, data.duration, data.quality ?? null, data.deepSleep ?? null,
     data.remSleep ?? null, data.lightSleep ?? null, data.awakeTime ?? null, data.source ?? null]
  );
  return d.getFirstSync<SleepLogRow>('SELECT * FROM sleep_logs WHERE id = ?', [id])!;
}

export function getSleepLogs(userId: string, days = 30): SleepLogRow[] {
  const cutoff = daysAgo(days);
  return getDb().getAllSync<SleepLogRow>(
    'SELECT * FROM sleep_logs WHERE user_id = ? AND date >= ? ORDER BY date DESC',
    [userId, cutoff.split('T')[0]!]
  );
}

// ── HRV ────────────────────────────────────────────────────────

export function logHRV(userId: string, data: {
  date?: string; hrv: number; rmssd?: number; sdnn?: number; source?: string;
}): HrvLogRow {
  const d = getDb();
  const logDate = data.date ?? today();
  const id = randomUUID();

  const existing = d.getFirstSync<HrvLogRow>(
    'SELECT * FROM hrv_logs WHERE user_id = ? AND date = ?', [userId, logDate]
  );
  if (existing) {
    d.runSync(
      'UPDATE hrv_logs SET hrv = ?, rmssd = ?, sdnn = ?, source = ? WHERE id = ?',
      [data.hrv, data.rmssd ?? null, data.sdnn ?? null, data.source ?? null, existing.id]
    );
    return d.getFirstSync<HrvLogRow>('SELECT * FROM hrv_logs WHERE id = ?', [existing.id])!;
  }

  d.runSync(
    'INSERT INTO hrv_logs (id, user_id, date, hrv, rmssd, sdnn, source) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, userId, logDate, data.hrv, data.rmssd ?? null, data.sdnn ?? null, data.source ?? null]
  );
  return d.getFirstSync<HrvLogRow>('SELECT * FROM hrv_logs WHERE id = ?', [id])!;
}

export function getHRVLogs(userId: string, days = 30): HrvLogRow[] {
  const cutoff = daysAgo(days);
  return getDb().getAllSync<HrvLogRow>(
    'SELECT * FROM hrv_logs WHERE user_id = ? AND date >= ? ORDER BY date DESC',
    [userId, cutoff.split('T')[0]!]
  );
}

// ── Mood ───────────────────────────────────────────────────────

export function logMood(userId: string, data: {
  date?: string; mood: number; energy?: number; stress?: number; note?: string;
}): MoodLogRow {
  const d = getDb();
  const logDate = data.date ?? today();
  const id = randomUUID();

  const existing = d.getFirstSync<MoodLogRow>(
    'SELECT * FROM mood_logs WHERE user_id = ? AND date = ?', [userId, logDate]
  );
  if (existing) {
    d.runSync(
      'UPDATE mood_logs SET mood = ?, energy = ?, stress = ?, note = ? WHERE id = ?',
      [data.mood, data.energy ?? null, data.stress ?? null, data.note ?? null, existing.id]
    );
    return d.getFirstSync<MoodLogRow>('SELECT * FROM mood_logs WHERE id = ?', [existing.id])!;
  }

  d.runSync(
    'INSERT INTO mood_logs (id, user_id, date, mood, energy, stress, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, userId, logDate, data.mood, data.energy ?? null, data.stress ?? null, data.note ?? null]
  );
  return d.getFirstSync<MoodLogRow>('SELECT * FROM mood_logs WHERE id = ?', [id])!;
}

export function getMoodLogs(userId: string, days = 30): MoodLogRow[] {
  const cutoff = daysAgo(days);
  return getDb().getAllSync<MoodLogRow>(
    'SELECT * FROM mood_logs WHERE user_id = ? AND date >= ? ORDER BY date DESC',
    [userId, cutoff.split('T')[0]!]
  );
}

// ── Summary ────────────────────────────────────────────────────

export interface HealthSummary {
  sleep: { logs: SleepLogRow[]; averageHours: number | null; totalLogs: number };
  hrv: { logs: HrvLogRow[]; average: number | null; totalLogs: number };
  mood: { logs: MoodLogRow[]; average: number | null; totalLogs: number };
}

export function getHealthSummary(userId: string, days = 7): HealthSummary {
  const cutoff = daysAgo(days);
  const cutoffStr = cutoff.split('T')[0]!;

  const sleepLogs = getDb().getAllSync<SleepLogRow>(
    'SELECT * FROM sleep_logs WHERE user_id = ? AND date >= ? ORDER BY date DESC',
    [userId, cutoffStr]
  );
  const hrvLogs = getDb().getAllSync<HrvLogRow>(
    'SELECT * FROM hrv_logs WHERE user_id = ? AND date >= ? ORDER BY date DESC',
    [userId, cutoffStr]
  );
  const moodLogs = getDb().getAllSync<MoodLogRow>(
    'SELECT * FROM mood_logs WHERE user_id = ? AND date >= ? ORDER BY date DESC',
    [userId, cutoffStr]
  );

  const avgSleep = sleepLogs.length > 0
    ? Math.round(sleepLogs.reduce((sum, l) => sum + l.duration, 0) / sleepLogs.length / 60 * 10) / 10
    : null;

  const avgHrv = hrvLogs.length > 0
    ? Math.round(hrvLogs.reduce((sum, l) => sum + l.hrv, 0) / hrvLogs.length * 10) / 10
    : null;

  const avgMood = moodLogs.length > 0
    ? Math.round(moodLogs.reduce((sum, l) => sum + l.mood, 0) / moodLogs.length * 10) / 10
    : null;

  return {
    sleep: { logs: sleepLogs, averageHours: avgSleep, totalLogs: sleepLogs.length },
    hrv: { logs: hrvLogs, average: avgHrv, totalLogs: hrvLogs.length },
    mood: { logs: moodLogs, average: avgMood, totalLogs: moodLogs.length },
  };
}

// ── Health Data Sync (local storage only) ──────────────────────

export type HealthSource = 'apple_health' | 'google_fit' | 'manual' | 'device';

export interface HealthReading {
  source: string;
  metric: string;
  value: number;
  unit?: string;
  recordedAt?: string;
}

export function syncHealthData(userId: string, readings: HealthReading[]): { created: number } {
  const d = getDb();
  let created = 0;
  for (const r of readings) {
    d.runSync(
      'INSERT INTO health_data (id, user_id, source, metric, value, unit, recorded_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [randomUUID(), userId, r.source, r.metric, r.value, r.unit ?? null, r.recordedAt ?? now()]
    );
    created++;
  }
  return { created };
}

export function getHealthMetricsSummary(userId: string, days = 7): {
  steps?: number | null; heartRate?: number | null; sleep?: number | null; weight?: number | null;
} {
  const d = getDb();
  const cutoff = daysAgo(days);

  const steps = d.getFirstSync<{ total: number }>(
    "SELECT SUM(value) as total FROM health_data WHERE user_id = ? AND metric = 'steps' AND recorded_at >= ?",
    [userId, cutoff]
  )?.total;

  const heartRate = d.getFirstSync<{ avg: number }>(
    "SELECT AVG(value) as avg FROM health_data WHERE user_id = ? AND metric = 'heart_rate' AND recorded_at >= ?",
    [userId, cutoff]
  )?.avg;

  const latestWeight = d.getFirstSync<{ weight: number }>(
    'SELECT weight FROM weight_logs WHERE user_id = ? ORDER BY date DESC LIMIT 1', [userId]
  )?.weight;

  const sleepSummary = getHealthSummary(userId, days);

  return {
    steps: steps ?? null,
    heartRate: heartRate != null ? Math.round(heartRate) : null,
    sleep: sleepSummary.sleep.averageHours,
    weight: latestWeight ?? null,
  };
}
