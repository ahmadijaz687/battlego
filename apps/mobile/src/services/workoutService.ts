import { randomUUID } from 'expo-crypto';
import { getDatabase, type DB } from '../database';
import type {
  WorkoutRow,
  WorkoutSectionRow,
  WorkoutExerciseRow,
  WorkoutSetRow,
  PersonalRecordRow,
  ExerciseRow,
  WorkoutSessionData,
  WorkoutHistoryDay,
  WorkoutAnalytics,
  RecordType,
} from '../database/types';
import { now, today } from '../database/helpers';

function getDb(): DB {
  return getDatabase();
}

export type { WorkoutRow, WorkoutSectionRow, WorkoutExerciseRow, WorkoutSetRow, PersonalRecordRow, ExerciseRow, WorkoutSessionData, WorkoutHistoryDay, WorkoutAnalytics, RecordType };

export function getExerciseLibrary(): ExerciseRow[] {
  return getDb().getAllSync<ExerciseRow>('SELECT * FROM exercises ORDER BY name ASC');
}

export function getExercises(): ExerciseRow[] {
  return getExerciseLibrary();
}

export function searchExercises(q: string, category?: string, limit = 50): ExerciseRow[] {
  const d = getDb();
  let sql = 'SELECT * FROM exercises WHERE 1=1';
  const params: unknown[] = [];
  if (q) {
    sql += ' AND (name LIKE ? OR primary_muscle LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  sql += ' ORDER BY name ASC LIMIT ?';
  params.push(limit);
  return d.getAllSync<ExerciseRow>(sql, params as any);
}

export function getTemplates() {
  return getDb().getAllSync<{
    id: string; name: string; description: string | null;
    difficulty: string; duration: number; exercises: string;
  }>('SELECT * FROM workout_templates ORDER BY name ASC');
}

export function createWorkout(
  userId: string,
  data: { name: string; type: string; difficulty: string; duration: number }
): WorkoutRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    'INSERT INTO workouts (id, user_id, name, type, difficulty, duration) VALUES (?, ?, ?, ?, ?, ?)',
    [id, userId, data.name, data.type, data.difficulty, data.duration]
  );
  const created = d.getFirstSync<WorkoutRow>('SELECT * FROM workouts WHERE id = ?', [id]);
  if (!created) throw new Error('Failed to create workout');
  return created;
}

export function createWorkoutFromTemplate(userId: string, templateId: string): WorkoutRow {
  const d = getDb();
  const template = d.getFirstSync<{
    id: string; name: string; difficulty: string; duration: number; exercises: string;
  }>('SELECT * FROM workout_templates WHERE id = ?', [templateId]);
  if (!template) throw new Error('Template not found');

  const workout = createWorkout(userId, {
    name: template.name,
    type: 'strength',
    difficulty: template.difficulty,
    duration: template.duration,
  });

  const exercises = JSON.parse(template.exercises) as Array<{
    exerciseId: string; name: string; sets: number; reps: number; rest: number;
  }>;

  const sectionId = randomUUID();
  d.runSync(
    'INSERT INTO workout_sections (id, workout_id, type, name, sort_order) VALUES (?, ?, ?, ?, ?)',
    [sectionId, workout.id, 'main', template.name, 0]
  );

  exercises.forEach((ex, idx) => {
    const weId = randomUUID();
    d.runSync(
      'INSERT INTO workout_exercises (id, section_id, exercise_id, name, sort_order) VALUES (?, ?, ?, ?, ?)',
      [weId, sectionId, ex.exerciseId, ex.name, idx]
    );
    for (let s = 1; s <= ex.sets; s++) {
      d.runSync(
        'INSERT INTO workout_sets (id, exercise_id, set_number, reps, rest_after) VALUES (?, ?, ?, ?, ?)',
        [randomUUID(), weId, s, ex.reps, ex.rest]
      );
    }
  });

  return workout;
}

export function createCustomWorkout(
  userId: string,
  data: {
    name: string; type: string; difficulty: string;
    exercises: Array<{ exerciseId: string; name?: string; sets?: number; reps?: number; restSec?: number; order?: number }>;
  }
): WorkoutRow {
  const d = getDb();
  const workout = createWorkout(userId, {
    name: data.name,
    type: data.type,
    difficulty: data.difficulty,
    duration: data.exercises.length * 5,
  });

  const sectionId = randomUUID();
  d.runSync(
    'INSERT INTO workout_sections (id, workout_id, type, name, sort_order) VALUES (?, ?, ?, ?, ?)',
    [sectionId, workout.id, 'main', 'Main', 0]
  );

  data.exercises
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .forEach((ex, idx) => {
      const exerciseName =
        ex.name ??
        d.getFirstSync<{ name: string }>('SELECT name FROM exercises WHERE id = ?', [ex.exerciseId])?.name ??
        'Unknown Exercise';
      const weId = randomUUID();
      d.runSync(
        'INSERT INTO workout_exercises (id, section_id, exercise_id, name, sort_order) VALUES (?, ?, ?, ?, ?)',
        [weId, sectionId, ex.exerciseId, exerciseName, idx]
      );
      const numSets = ex.sets ?? 3;
      for (let s = 1; s <= numSets; s++) {
        d.runSync(
          'INSERT INTO workout_sets (id, exercise_id, set_number, reps, rest_after) VALUES (?, ?, ?, ?, ?)',
          [randomUUID(), weId, s, ex.reps ?? 10, ex.restSec ?? 60]
        );
      }
    });

  return workout;
}

export function startWorkout(userId: string, workoutId: string): WorkoutRow {
  const d = getDb();
  const workout = d.getFirstSync<WorkoutRow>(
    'SELECT * FROM workouts WHERE id = ? AND user_id = ?', [workoutId, userId]
  );
  if (!workout) throw new Error('Workout not found');
  d.runSync('UPDATE workouts SET started_at = ? WHERE id = ?', [now(), workoutId]);
  const updated = d.getFirstSync<WorkoutRow>('SELECT * FROM workouts WHERE id = ?', [workoutId]);
  if (!updated) throw new Error('Workout not found after update');
  return updated;
}

export function completeWorkout(userId: string, workoutId: string): { status: string; completedAt: string } {
  const d = getDb();
  const workout = d.getFirstSync<WorkoutRow>(
    'SELECT * FROM workouts WHERE id = ? AND user_id = ?', [workoutId, userId]
  );
  if (!workout) throw new Error('Workout not found');
  const completedAt = now();
  d.runSync('UPDATE workouts SET completed_at = ? WHERE id = ?', [completedAt, workoutId]);
  return { status: 'completed', completedAt };
}

export function addSection(workoutId: string, data: { type: string; name: string; sortOrder?: number }): WorkoutSectionRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    'INSERT INTO workout_sections (id, workout_id, type, name, sort_order) VALUES (?, ?, ?, ?, ?)',
    [id, workoutId, data.type, data.name, data.sortOrder ?? 0]
  );
  const created = d.getFirstSync<WorkoutSectionRow>('SELECT * FROM workout_sections WHERE id = ?', [id]);
  if (!created) throw new Error('Failed to create section');
  return created;
}

export function addExercise(sectionId: string, data: { exerciseId: string; name: string; sortOrder?: number }): WorkoutExerciseRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    'INSERT INTO workout_exercises (id, section_id, exercise_id, name, sort_order) VALUES (?, ?, ?, ?, ?)',
    [id, sectionId, data.exerciseId, data.name, data.sortOrder ?? 0]
  );
  const created = d.getFirstSync<WorkoutExerciseRow>('SELECT * FROM workout_exercises WHERE id = ?', [id]);
  if (!created) throw new Error('Failed to create exercise');
  return created;
}

export function addSet(workoutExerciseId: string, data: { setNumber: number; reps?: number; restAfter?: number }): WorkoutSetRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    'INSERT INTO workout_sets (id, exercise_id, set_number, reps, rest_after) VALUES (?, ?, ?, ?, ?)',
    [id, workoutExerciseId, data.setNumber, data.reps ?? null, data.restAfter ?? null]
  );
  const created = d.getFirstSync<WorkoutSetRow>('SELECT * FROM workout_sets WHERE id = ?', [id]);
  if (!created) throw new Error('Failed to create set');
  return created;
}

export function getCurrentSession(userId: string): WorkoutSessionData | null {
  const d = getDb();
  const workout = d.getFirstSync<WorkoutRow>(
    `SELECT * FROM workouts WHERE user_id = ? AND started_at IS NOT NULL AND completed_at IS NULL
     ORDER BY started_at DESC LIMIT 1`, [userId]
  );
  if (!workout) return null;
  return getWorkoutSession(userId, workout.id);
}

export function getWorkoutSession(userId: string, workoutId: string): WorkoutSessionData {
  const d = getDb();
  const workout = d.getFirstSync<WorkoutRow>(
    'SELECT * FROM workouts WHERE id = ? AND user_id = ?', [workoutId, userId]
  );
  if (!workout) throw new Error('Workout not found');

  const sections = d.getAllSync<WorkoutSectionRow>(
    'SELECT * FROM workout_sections WHERE workout_id = ? ORDER BY sort_order', [workoutId]
  ).map((section) => {
    const exercises = d.getAllSync<WorkoutExerciseRow>(
      'SELECT * FROM workout_exercises WHERE section_id = ? ORDER BY sort_order', [section.id]
    ).map((exercise) => {
      const sets = d.getAllSync<WorkoutSetRow>(
        'SELECT * FROM workout_sets WHERE exercise_id = ? ORDER BY set_number', [exercise.id]
      );
      return { ...exercise, sets };
    });
    return { ...section, exercises };
  });

  return { workout, sections };
}

// ── Set completion + PR detection ───────────────────────────────

export function completeSet(
  userId: string,
  workoutId: string,
  setId: string,
  data: {
    reps?: number;
    weight?: number;
    duration?: number;
    distance?: number;
    tempo?: string;
    rpe?: number;
    notes?: string;
  }
): WorkoutSetRow & { prDetected: boolean } {
  const d = getDb();

  const workout = d.getFirstSync<WorkoutRow>(
    'SELECT * FROM workouts WHERE id = ? AND user_id = ?', [workoutId, userId]
  );
  if (!workout) throw new Error('Workout not found');

  const existingSet = d.getFirstSync<WorkoutSetRow>(
    'SELECT * FROM workout_sets WHERE id = ?', [setId]
  );
  if (!existingSet) throw new Error('Set not found');

  if (existingSet.completed === 1) {
    return { ...existingSet, prDetected: existingSet.is_pr === 1 };
  }

  d.execSync('BEGIN IMMEDIATE');
  try {
    const completedAt = now();
    d.runSync(
      `UPDATE workout_sets SET
         reps = COALESCE(?, reps), weight = COALESCE(?, weight),
         duration = COALESCE(?, duration), distance = COALESCE(?, distance),
         tempo = COALESCE(?, tempo), rpe = COALESCE(?, rpe),
         notes = COALESCE(?, notes), completed = 1, completed_at = ?
       WHERE id = ?`,
      [data.reps ?? null, data.weight ?? null, data.duration ?? null, data.distance ?? null,
       data.tempo ?? null, data.rpe ?? null, data.notes ?? null, completedAt, setId]
    );

    const prDetected = detectAndRecordPR(d, userId, existingSet.exercise_id, {
      reps: data.reps ?? existingSet.reps,
      weight: data.weight ?? existingSet.weight,
      duration: data.duration ?? existingSet.duration,
      distance: data.distance ?? existingSet.distance,
    });

    if (prDetected) {
      d.runSync('UPDATE workout_sets SET is_pr = 1 WHERE id = ?', [setId]);
    }

    d.execSync('COMMIT');

    const updated = d.getFirstSync<WorkoutSetRow>('SELECT * FROM workout_sets WHERE id = ?', [setId]);
    if (!updated) throw new Error('Set not found after update');
    return { ...updated, prDetected };
  } catch (e) {
    d.execSync('ROLLBACK');
    throw e;
  }
}

function detectAndRecordPR(
  d: DB,
  userId: string,
  exerciseId: string,
  data: { reps: number | null; weight: number | null; duration: number | null; distance: number | null }
): boolean {
  const exercise = d.getFirstSync<{ is_bodyweight: number }>(
    'SELECT is_bodyweight FROM exercises WHERE id = ?', [exerciseId]
  );
  const isBodyweight = exercise?.is_bodyweight === 1;

  let prDetected = false;

  if (data.weight != null && data.weight > 0 && data.reps != null && data.reps >= 2) {
    const estimated1RM = computeEstimated1RM(data.weight, data.reps);
    if (estimated1RM > 0) {
      prDetected = upsertPersonalRecord(d, userId, exerciseId, 'MAX_WEIGHT', estimated1RM, 'lbs', isBodyweight) || prDetected;
    }
  }

  if (data.reps != null && data.reps > 0 && (isBodyweight || data.weight == null || data.weight === 0)) {
    prDetected = upsertPersonalRecord(d, userId, exerciseId, 'MAX_REPS', data.reps, 'reps', isBodyweight) || prDetected;
  }

  if (data.duration != null && data.duration > 0) {
    prDetected = upsertPersonalRecordTime(d, userId, exerciseId, 'BEST_TIME', data.duration, 'seconds') || prDetected;
  }

  if (data.distance != null && data.distance > 0) {
    prDetected = upsertPersonalRecord(d, userId, exerciseId, 'LONGEST_DISTANCE', data.distance, 'distance', false) || prDetected;
  }

  return prDetected;
}

function computeEstimated1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;

  const epley = weight * (1 + reps / 30);
  let brzycki = 0;
  if (reps < 37) {
    brzycki = weight * (36 / (37 - reps));
  }

  if (brzycki <= 0) return Math.round(epley * 100) / 100;
  return Math.round(((epley + brzycki) / 2) * 100) / 100;
}

function upsertPersonalRecord(
  d: DB, userId: string, exerciseId: string,
  recordType: RecordType, value: number, unit: string, _isBodyweight: boolean
): boolean {
  const exerciseName = d.getFirstSync<{ name: string }>(
    'SELECT name FROM exercises WHERE id = ?', [exerciseId]
  )?.name ?? 'Unknown';

  const existing = d.getFirstSync<PersonalRecordRow>(
    'SELECT * FROM personal_records WHERE user_id = ? AND exercise_id = ? AND record_type = ?',
    [userId, exerciseId, recordType]
  );

  if (!existing) {
    d.runSync(
      `INSERT INTO personal_records (id, user_id, exercise_id, exercise_name, record_type, value, unit, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), userId, exerciseId, exerciseName, recordType, value, unit, today()]
    );
    return true;
  }

  if (value > existing.value) {
    d.runSync('UPDATE personal_records SET value = ?, date = ?, unit = ? WHERE id = ?', [value, today(), unit, existing.id]);
    return true;
  }

  return false;
}

function upsertPersonalRecordTime(
  d: DB, userId: string, exerciseId: string,
  recordType: RecordType, value: number, unit: string
): boolean {
  const exerciseName = d.getFirstSync<{ name: string }>(
    'SELECT name FROM exercises WHERE id = ?', [exerciseId]
  )?.name ?? 'Unknown';

  const existing = d.getFirstSync<PersonalRecordRow>(
    'SELECT * FROM personal_records WHERE user_id = ? AND exercise_id = ? AND record_type = ?',
    [userId, exerciseId, recordType]
  );

  if (!existing) {
    d.runSync(
      `INSERT INTO personal_records (id, user_id, exercise_id, exercise_name, record_type, value, unit, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), userId, exerciseId, exerciseName, recordType, value, unit, today()]
    );
    return true;
  }

  if (value < existing.value) {
    d.runSync('UPDATE personal_records SET value = ?, date = ?, unit = ? WHERE id = ?', [value, today(), unit, existing.id]);
    return true;
  }

  return false;
}

export function getPersonalRecords(userId: string): PersonalRecordRow[] {
  return getDb().getAllSync<PersonalRecordRow>(
    'SELECT * FROM personal_records WHERE user_id = ? ORDER BY date DESC', [userId]
  );
}

export function getPersonalRecordsByExercise(userId: string, exerciseId: string): PersonalRecordRow[] {
  return getDb().getAllSync<PersonalRecordRow>(
    'SELECT * FROM personal_records WHERE user_id = ? AND exercise_id = ?', [userId, exerciseId]
  );
}

export function getWorkoutHistory(userId: string, limit = 50): WorkoutHistoryDay[] {
  const d = getDb();
  const workouts = d.getAllSync<WorkoutRow>(
    'SELECT * FROM workouts WHERE user_id = ? ORDER BY created_at DESC LIMIT ?', [userId, limit]
  );

  const dayMap = new Map<string, WorkoutRow[]>();
  for (const w of workouts) {
    const dateKey = w.created_at.split('T')[0]!;
    const existing = dayMap.get(dateKey) ?? [];
    existing.push(w);
    dayMap.set(dateKey, existing);
  }

  return Array.from(dayMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, dayWorkouts]) => ({ date, workouts: dayWorkouts }));
}

export function getWorkoutById(userId: string, workoutId: string): WorkoutRow | null {
  return getDb().getFirstSync<WorkoutRow>(
    'SELECT * FROM workouts WHERE id = ? AND user_id = ?', [workoutId, userId]
  );
}

export function getWorkoutAnalytics(userId: string): WorkoutAnalytics {
  const d = getDb();

  const completed = d.getAllSync<WorkoutRow>(
    `SELECT * FROM workouts WHERE user_id = ? AND completed_at IS NOT NULL
     ORDER BY completed_at DESC`, [userId]
  );

  const now_ = new Date();
  const weekAgo = new Date(now_.getTime() - 7 * 86400000).toISOString();
  const monthAgo = new Date(now_.getTime() - 30 * 86400000).toISOString();

  const weeklyCount = completed.filter((w) => w.completed_at! >= weekAgo).length;
  const monthlyCount = completed.filter((w) => w.completed_at! >= monthAgo).length;

  const sets = d.getAllSync<{ exercise_name: string; weight: number | null; reps: number | null }>(
    `SELECT ws.exercise_id, e.name as exercise_name, ws.weight, ws.reps
     FROM workout_sets ws
     JOIN workout_exercises we ON ws.exercise_id = we.id
     JOIN exercises e ON we.exercise_id = e.id
     JOIN workouts w ON we.section_id IN (SELECT id FROM workout_sections WHERE workout_id = w.id)
     WHERE w.user_id = ? AND ws.completed = 1 AND w.completed_at IS NOT NULL
       AND ws.weight IS NOT NULL AND ws.reps IS NOT NULL`,
    [userId]
  );

  const muscleBalance: Record<string, number> = {};
  const exerciseProgress = new Map<string, number[]>();

  for (const s of sets) {
    muscleBalance[s.exercise_name] = (muscleBalance[s.exercise_name] ?? 0) + (s.weight ?? 0) * (s.reps ?? 0);
    const existing = exerciseProgress.get(s.exercise_name) ?? [];
    existing.push((s.weight ?? 0) * (s.reps ?? 0));
    exerciseProgress.set(s.exercise_name, existing);
  }

  const strengthProgress: Array<{ exercise: string; current: number; previous: number }> = [];
  for (const [exercise, volumes] of exerciseProgress) {
    if (volumes.length >= 2) {
      strengthProgress.push({ exercise, current: volumes[0]!, previous: volumes[1]! });
    }
  }

  const uniqueDays = new Set(completed.map((w) => w.completed_at!.split('T')[0]));

  return {
    weeklyVolume: weeklyCount,
    monthlyVolume: monthlyCount,
    muscleBalance,
    workoutFrequency: monthlyCount,
    consistencyScore: Math.min(100, Math.round((uniqueDays.size / 30) * 100)),
    strengthProgress: strengthProgress.sort((a, b) => b.current - a.current),
  };
}
