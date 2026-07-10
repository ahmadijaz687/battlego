import { randomUUID } from 'expo-crypto';
import { getDatabase, type DB } from '../database';
import type {
  BattleRow,
  BattleParticipantRow,
  BattleProgressRow,
  BattleMode,
  BattleStatus,
  BattleDetail,
  WorkoutRow,
} from '../database/types';
import { now } from '../database/helpers';

function getDb(): DB {
  return getDatabase();
}

// ── Battle CRUD ────────────────────────────────────────────────

export function createBattle(userId: string, data: {
  type: string; opponentId?: string; mode?: BattleMode;
  target?: number; metric?: string;
}): BattleRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    `INSERT INTO battles (id, creator_id, opponent_id, type, battle_mode, metric, target, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [id, userId, data.opponentId ?? null, data.type, data.mode ?? null, data.metric ?? null, data.target ?? null]
  );
  return d.getFirstSync<BattleRow>('SELECT * FROM battles WHERE id = ?', [id])!;
}

export function joinBattle(userId: string, battleId: string): BattleParticipantRow {
  const d = getDb();
  const battle = d.getFirstSync<BattleRow>('SELECT * FROM battles WHERE id = ?', [battleId]);
  if (!battle) throw new Error('Battle not found');
  if (battle.status !== 'pending' && battle.status !== 'active') throw new Error('Battle is not joinable');

  const existing = d.getFirstSync<BattleParticipantRow>(
    'SELECT * FROM battle_participants WHERE battle_id = ? AND user_id = ?', [battleId, userId]
  );
  if (existing) return existing;

  d.execSync('BEGIN IMMEDIATE');
  try {
    const id = randomUUID();
    d.runSync(
      'INSERT OR IGNORE INTO battle_participants (id, battle_id, user_id, status) VALUES (?, ?, ?, ?)',
      [id, battleId, userId, 'active']
    );

    if (battle.status === 'pending' && battle.opponent_id) {
      d.runSync(
        "UPDATE battles SET status = 'active', start_time = ? WHERE id = ? AND status = 'pending'",
        [now(), battleId]
      );
    }
    d.execSync('COMMIT');
    return d.getFirstSync<BattleParticipantRow>(
      'SELECT * FROM battle_participants WHERE battle_id = ? AND user_id = ?', [battleId, userId]
    )!;
  } catch (e) {
    d.execSync('ROLLBACK');
    throw e;
  }
}

export function updateBattleProgress(userId: string, battleId: string, currentValue: number): BattleProgressRow {
  const d = getDb();
  const battle = d.getFirstSync<BattleRow>('SELECT * FROM battles WHERE id = ?', [battleId]);
  if (!battle) throw new Error('Battle not found');
  if (battle.status !== 'active') throw new Error('Battle is not active');

  const targetValue = battle.target ?? 100;
  const percentage = Math.min(100, (currentValue / targetValue) * 100);

  const existing = d.getFirstSync<BattleProgressRow>(
    'SELECT * FROM battle_progress WHERE battle_id = ? AND user_id = ?', [battleId, userId]
  );

  if (existing) {
    d.runSync(
      'UPDATE battle_progress SET current_value = ?, percentage = ?, last_updated = ? WHERE id = ?',
      [currentValue, percentage, now(), existing.id]
    );
    return d.getFirstSync<BattleProgressRow>('SELECT * FROM battle_progress WHERE id = ?', [existing.id])!;
  }

  const id = randomUUID();
  d.runSync(
    'INSERT INTO battle_progress (id, battle_id, user_id, current_value, target_value, percentage) VALUES (?, ?, ?, ?, ?, ?)',
    [id, battleId, userId, currentValue, targetValue, percentage]
  );
  return d.getFirstSync<BattleProgressRow>('SELECT * FROM battle_progress WHERE id = ?', [id])!;
}

export function completeBattle(userId: string, battleId: string): BattleRow {
  const d = getDb();
  const battle = d.getFirstSync<BattleRow>('SELECT * FROM battles WHERE id = ?', [battleId]);
  if (!battle) throw new Error('Battle not found');
  if (battle.creator_id !== userId && battle.opponent_id !== userId) throw new Error('Not a participant');

  const creatorProgress = d.getFirstSync<BattleProgressRow>(
    'SELECT * FROM battle_progress WHERE battle_id = ? AND user_id = ?', [battleId, battle.creator_id]
  );
  const opponentProgress = battle.opponent_id
    ? d.getFirstSync<BattleProgressRow>(
        'SELECT * FROM battle_progress WHERE battle_id = ? AND user_id = ?', [battleId, battle.opponent_id]
      )
    : null;

  const creatorScore = creatorProgress?.current_value ?? 0;
  const opponentScore = opponentProgress?.current_value ?? 0;

  const winnerId =
    creatorScore > opponentScore
      ? battle.creator_id
      : opponentScore > creatorScore
        ? battle.opponent_id
        : null;

  d.execSync('BEGIN IMMEDIATE');
  try {
    d.runSync(
      `UPDATE battles SET status = 'completed', end_time = ?, winner_id = ?,
       creator_score = ?, opponent_score = ? WHERE id = ?`,
      [now(), winnerId, creatorScore, opponentScore, battleId]
    );

    d.runSync(
      `INSERT INTO battle_results (id, battle_id, winner_id, completed_at, total_participants, average_score)
       VALUES (?, ?, ?, ?, 2, ?)`,
      [randomUUID(), battleId, winnerId, now(), (creatorScore + opponentScore) / 2]
    );
    d.execSync('COMMIT');
  } catch (e) {
    d.execSync('ROLLBACK');
    throw e;
  }

  return d.getFirstSync<BattleRow>('SELECT * FROM battles WHERE id = ?', [battleId])!;
}

// ── Queries ────────────────────────────────────────────────────

export function getBattles(userId: string, limit = 20): BattleRow[] {
  return getDb().getAllSync<BattleRow>(
    `SELECT * FROM battles WHERE creator_id = ? OR opponent_id = ? ORDER BY created_at DESC LIMIT ?`,
    [userId, userId, limit]
  );
}

export function getActiveBattles(userId: string): BattleRow[] {
  return getDb().getAllSync<BattleRow>(
    `SELECT * FROM battles WHERE (creator_id = ? OR opponent_id = ?) AND status = 'active' ORDER BY created_at DESC`,
    [userId, userId]
  );
}

export function getBattleById(battleId: string): BattleDetail | null {
  const d = getDb();
  const battle = d.getFirstSync<BattleRow>('SELECT * FROM battles WHERE id = ?', [battleId]);
  if (!battle) return null;

  const creator = d.getFirstSync<{ id: string; name: string; avatar: string | null }>(
    'SELECT id, name, avatar FROM users WHERE id = ?', [battle.creator_id]
  );
  const opponent = battle.opponent_id
    ? d.getFirstSync<{ id: string; name: string; avatar: string | null }>(
        'SELECT id, name, avatar FROM users WHERE id = ?', [battle.opponent_id]
      )
    : null;

  const progressRows = d.getAllSync<BattleProgressRow>(
    'SELECT * FROM battle_progress WHERE battle_id = ?', [battleId]
  );

  const participants = [
    {
      user: creator ?? { id: battle.creator_id, name: 'Unknown', avatar: null },
      progressValue: battle.creator_score ?? 0,
      isWinner: battle.winner_id === battle.creator_id,
      joinedAt: battle.created_at,
    },
    ...(opponent
      ? [{
          user: opponent,
          progressValue: battle.opponent_score ?? 0,
          isWinner: battle.winner_id === battle.opponent_id,
          joinedAt: battle.start_time ?? battle.created_at,
        }]
      : []),
  ];

  const standings = [...participants]
    .sort((a, b) => b.progressValue - a.progressValue)
    .map((p, index) => ({
      rank: index + 1,
      userId: p.user.id,
      name: p.user.name,
      progressValue: p.progressValue,
      isWinner: p.isWinner,
    }));

  return {
    id: battle.id,
    type: battle.type,
    mode: battle.battle_mode,
    metric: battle.metric,
    target: battle.target,
    status: battle.status,
    startDate: battle.start_time,
    endDate: battle.end_time,
    inviteCode: battle.invite_code,
    createdBy: battle.creator_id,
    participants,
    standings,
  };
}

export function getBattleStats(userId: string) {
  const d = getDb();
  const total = d.getFirstSync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM battles WHERE creator_id = ? OR opponent_id = ?', [userId, userId]
  )?.cnt ?? 0;

  const wins = d.getFirstSync<{ cnt: number }>(
    "SELECT COUNT(*) as cnt FROM battles WHERE status = 'completed' AND winner_id = ?", [userId]
  )?.cnt ?? 0;

  const losses = d.getFirstSync<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM battles WHERE status = 'completed' AND winner_id IS NOT NULL AND winner_id != ? AND (creator_id = ? OR opponent_id = ?)`,
    [userId, userId, userId]
  )?.cnt ?? 0;

  const active = d.getFirstSync<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM battles WHERE status = 'active' AND (creator_id = ? OR opponent_id = ?)`,
    [userId, userId]
  )?.cnt ?? 0;

  return { total, wins, losses, active, winRate: total > 0 ? Math.round((wins / total) * 100) : 0 };
}

// ── Leaderboard ────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  xp: number;
  level: number;
  score: number;
}

export function getLeaderboard(limit = 50): LeaderboardEntry[] {
  const d = getDb();
  const rows = d.getAllSync<{
    user_id: string; level: number; total_xp: number;
    name: string; avatar: string | null;
  }>(
    `SELECT ul.user_id, ul.level, ul.total_xp, u.name, u.avatar
     FROM user_levels ul
     LEFT JOIN users u ON u.id = ul.user_id
     ORDER BY ul.total_xp DESC LIMIT ?`,
    [limit]
  );

  return rows.map((row, i) => ({
    rank: i + 1,
    userId: row.user_id,
    name: row.name ?? 'Unknown',
    avatar: row.avatar ?? null,
    xp: row.total_xp,
    level: row.level,
    score: row.total_xp,
  }));
}

// ── Battle Computation ─────────────────────────────────────────

export function computeBattleScore(
  userId: string,
  battleId: string,
  startDate: string,
  endDate: string
): number {
  const d = getDb();
  const battle = d.getFirstSync<BattleRow>('SELECT * FROM battles WHERE id = ?', [battleId]);
  if (!battle) throw new Error('Battle not found');

  const mode = battle.battle_mode ?? 'REPS';

  switch (mode) {
    case 'REPS':
      return computeRepsScore(d, userId, startDate, endDate);
    case 'CALORIES':
      return computeCaloriesScore(d, userId, startDate, endDate);
    case 'DURATION':
      return computeDurationScore(d, userId, startDate, endDate);
    case 'DISTANCE':
      return computeDistanceScore(d, userId, startDate, endDate);
    case 'WORKOUTS':
      return computeWorkoutCountScore(d, userId, startDate, endDate);
    default:
      return 0;
  }
}

function computeRepsScore(d: DB, userId: string, start: string, end: string): number {
  const result = d.getFirstSync<{ total: number }>(
    `SELECT COALESCE(SUM(ws.reps), 0) as total
     FROM workout_sets ws
     JOIN workout_exercises we ON ws.exercise_id = we.id
     JOIN workout_sections wsec ON we.section_id = wsec.id
     JOIN workouts w ON wsec.workout_id = w.id
     WHERE w.user_id = ? AND ws.completed = 1
       AND w.completed_at >= ? AND w.completed_at <= ?`,
    [userId, start, end]
  );
  return result?.total ?? 0;
}

function computeCaloriesScore(d: DB, userId: string, start: string, end: string): number {
  const workouts = d.getAllSync<WorkoutRow & { met: number | null }>(
    `SELECT w.*, e.met
     FROM workouts w
     JOIN workout_sections ws ON ws.workout_id = w.id
     JOIN workout_exercises we ON we.section_id = ws.id
     JOIN exercises e ON we.exercise_id = e.id
     WHERE w.user_id = ? AND w.completed_at IS NOT NULL
       AND w.completed_at >= ? AND w.completed_at <= ?
     GROUP BY w.id`,
    [userId, start, end]
  );

  let totalCalories = 0;
  for (const w of workouts) {
    const met = w.met ?? 5.0;
    const durationMinutes = w.duration / 60;
    totalCalories += Math.round(met * 70 * (durationMinutes / 60));
  }
  return totalCalories;
}

function computeDurationScore(d: DB, userId: string, start: string, end: string): number {
  const result = d.getFirstSync<{ total: number }>(
    `SELECT COALESCE(SUM(duration), 0) as total
     FROM workouts
     WHERE user_id = ? AND completed_at IS NOT NULL
       AND completed_at >= ? AND completed_at <= ?`,
    [userId, start, end]
  );
  return result?.total ?? 0;
}

function computeDistanceScore(d: DB, userId: string, start: string, end: string): number {
  const result = d.getFirstSync<{ total: number }>(
    `SELECT COALESCE(SUM(ws.distance), 0) as total
     FROM workout_sets ws
     JOIN workout_exercises we ON ws.exercise_id = we.id
     JOIN workout_sections wsec ON we.section_id = wsec.id
     JOIN workouts w ON wsec.workout_id = w.id
     WHERE w.user_id = ? AND ws.completed = 1
       AND w.completed_at >= ? AND w.completed_at <= ?`,
    [userId, start, end]
  );
  return result?.total ?? 0;
}

function computeWorkoutCountScore(d: DB, userId: string, start: string, end: string): number {
  const result = d.getFirstSync<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM workouts
     WHERE user_id = ? AND completed_at IS NOT NULL
       AND completed_at >= ? AND completed_at <= ?`,
    [userId, start, end]
  );
  return result?.cnt ?? 0;
}
