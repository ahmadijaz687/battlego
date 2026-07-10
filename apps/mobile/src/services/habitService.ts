import { randomUUID } from 'expo-crypto';
import { getDatabase, type DB } from '../database';
import type { HabitRow, HabitLogRow } from '../database/types';
import { now, today } from '../database/helpers';

function getDb(): DB {
  return getDatabase();
}

export function createHabit(userId: string, data: {
  name: string; description?: string; category: string;
  frequency?: string; target?: number; unit?: string;
}): HabitRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    `INSERT INTO habits (id, user_id, name, description, category, frequency, target, unit)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, data.name, data.description ?? null, data.category,
     data.frequency ?? 'daily', data.target ?? 1, data.unit ?? null]
  );
  return d.getFirstSync<HabitRow>('SELECT * FROM habits WHERE id = ?', [id])!;
}

export function logHabit(habitId: string, data: {
  date?: string; value?: number; note?: string;
}): HabitLogRow {
  const d = getDb();
  const logDate = data.date ?? today();

  const existing = d.getFirstSync<HabitLogRow>(
    'SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?', [habitId, logDate]
  );
  if (existing) {
    d.runSync(
      'UPDATE habit_logs SET value = ?, note = ? WHERE id = ?',
      [data.value ?? 1, data.note ?? existing.note, existing.id]
    );
    return d.getFirstSync<HabitLogRow>('SELECT * FROM habit_logs WHERE id = ?', [existing.id])!;
  }

  d.execSync('BEGIN IMMEDIATE');
  try {
    const id = randomUUID();
    d.runSync(
      'INSERT INTO habit_logs (id, habit_id, date, value, note) VALUES (?, ?, ?, ?, ?)',
      [id, habitId, logDate, data.value ?? 1, data.note ?? null]
    );
    updateHabitStreak(habitId);
    d.execSync('COMMIT');
    return d.getFirstSync<HabitLogRow>('SELECT * FROM habit_logs WHERE id = ?', [id])!;
  } catch (e) {
    d.execSync('ROLLBACK');
    throw e;
  }
}

function updateHabitStreak(habitId: string): void {
  const d = getDb();
  const habit = d.getFirstSync<HabitRow>('SELECT * FROM habits WHERE id = ?', [habitId]);
  if (!habit) return;

  const logs = d.getAllSync<HabitLogRow>(
    'SELECT * FROM habit_logs WHERE habit_id = ? ORDER BY date DESC LIMIT 100', [habitId]
  );

  const dayKeys: number[] = Array.from(
    new Set(logs.map((l) => {
      const day = new Date(l.date);
      day.setHours(0, 0, 0, 0);
      return day.getTime();
    }))
  ).sort((a, b) => b - a);

  const oneDay = 24 * 60 * 60 * 1000;
  const today_ = new Date();
  today_.setHours(0, 0, 0, 0);
  const todayMs = today_.getTime();

  let streak = 0;
  if (dayKeys.length > 0 && (dayKeys[0] === todayMs || dayKeys[0] === todayMs - oneDay)) {
    streak = 1;
    for (let i = 1; i < dayKeys.length; i++) {
      if (dayKeys[i - 1] - dayKeys[i] === oneDay) {
        streak += 1;
      } else {
        break;
      }
    }
  }

  const longestStreak = Math.max(streak, habit.longest_streak);
  d.runSync(
    'UPDATE habits SET streak = ?, longest_streak = ?, updated_at = ? WHERE id = ?',
    [streak, longestStreak, now(), habitId]
  );
}

export function getHabits(userId: string, activeOnly = true): HabitRow[] {
  const d = getDb();
  if (activeOnly) {
    return d.getAllSync<HabitRow>(
      'SELECT * FROM habits WHERE user_id = ? AND active = 1 ORDER BY created_at DESC', [userId]
    );
  }
  return d.getAllSync<HabitRow>(
    'SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC', [userId]
  );
}

export function getHabitById(habitId: string): HabitRow | null {
  return getDb().getFirstSync<HabitRow>('SELECT * FROM habits WHERE id = ?', [habitId]);
}

export function getHabitStreak(habitId: string): number {
  const habit = getHabitById(habitId);
  return habit?.streak ?? 0;
}

export function getHabitHistory(habitId: string, days = 30): HabitLogRow[] {
  const d = getDb();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0]!;

  return d.getAllSync<HabitLogRow>(
    'SELECT * FROM habit_logs WHERE habit_id = ? AND date >= ? ORDER BY date DESC',
    [habitId, cutoffStr]
  );
}

export function getHabitStats(userId: string): {
  total: number; tracked: number; completionRate: number; bestStreak: number;
  habits: Array<{ id: string; name: string; category: string; streak: number; longestStreak: number }>;
} {
  const d = getDb();
  const habits = d.getAllSync<HabitRow>(
    'SELECT * FROM habits WHERE user_id = ? AND active = 1', [userId]
  );

  const todayStr = today();
  let trackedToday = 0;

  const habitDetails = habits.map((h) => {
    const hasLogToday = d.getFirstSync<{ cnt: number }>(
      'SELECT COUNT(*) as cnt FROM habit_logs WHERE habit_id = ? AND date = ?', [h.id, todayStr]
    );
    if ((hasLogToday?.cnt ?? 0) > 0) trackedToday++;

    return {
      id: h.id,
      name: h.name,
      category: h.category,
      streak: h.streak,
      longestStreak: h.longest_streak,
    };
  });

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.longest_streak), 0);

  return {
    total: habits.length,
    tracked: trackedToday,
    completionRate: habits.length > 0 ? Math.round((trackedToday / habits.length) * 100) : 0,
    bestStreak,
    habits: habitDetails,
  };
}

export function deleteHabit(habitId: string, userId: string): boolean {
  const d = getDb();
  const habit = d.getFirstSync<HabitRow>('SELECT * FROM habits WHERE id = ? AND user_id = ?', [habitId, userId]);
  if (!habit) return false;
  d.runSync('DELETE FROM habits WHERE id = ?', [habitId]);
  return true;
}
