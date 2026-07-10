import { randomUUID } from 'expo-crypto';
import type { DB } from './index';

export function insertRow(
  db: DB,
  table: string,
  data: Record<string, unknown>
): string {
  const id = (data.id as string) ?? randomUUID();
  const fullData = { id, ...data };
  const keys = Object.keys(fullData);
  const placeholders = keys.map(() => '?').join(', ');
  const values = keys.map((k) => fullData[k] ?? null);

  db.runSync(
    `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`,
    values as any
  );
  return id;
}

export function updateRow(
  db: DB,
  table: string,
  id: string,
  data: Record<string, unknown>
): void {
  const keys = Object.keys(data);
  if (keys.length === 0) return;
  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => data[k] ?? null);

  db.runSync(`UPDATE ${table} SET ${setClause} WHERE id = ?`, [...values, id] as any);
}

export function deleteRow(db: DB, table: string, id: string): void {
  db.runSync(`DELETE FROM ${table} WHERE id = ?`, [id]);
}

export function findById<T>(db: DB, table: string, id: string): T | null {
  return db.getFirstSync<T>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
}

export function findAll<T>(
  db: DB,
  table: string,
  where?: string,
  params?: unknown[]
): T[] {
  const sql = where
    ? `SELECT * FROM ${table} WHERE ${where} ORDER BY created_at DESC`
    : `SELECT * FROM ${table} ORDER BY created_at DESC`;
  return db.getAllSync<T>(sql, (params ?? []) as any);
}

export function countRows(
  db: DB,
  table: string,
  where?: string,
  params?: unknown[]
): number {
  const sql = where
    ? `SELECT COUNT(*) as cnt FROM ${table} WHERE ${where}`
    : `SELECT COUNT(*) as cnt FROM ${table}`;
  const result = db.getFirstSync<{ cnt: number }>(sql, (params ?? []) as any);
  return result?.cnt ?? 0;
}

export function upsertRow(
  db: DB,
  table: string,
  uniqueColumns: string[],
  data: Record<string, unknown>
): string {
  const id = (data.id as string) ?? randomUUID();
  const fullData = { id, ...data };
  const keys = Object.keys(fullData);
  const placeholders = keys.map(() => '?').join(', ');
  const values = keys.map((k) => fullData[k] ?? null);

  const conflictCols = uniqueColumns.join(', ');
  const updateCols = keys.filter((k) => !uniqueColumns.includes(k));
  const updateClause =
    updateCols.length > 0
      ? `ON CONFLICT(${conflictCols}) DO UPDATE SET ${updateCols.map((k) => `${k} = excluded.${k}`).join(', ')}`
      : `ON CONFLICT(${conflictCols}) DO NOTHING`;

  db.runSync(
    `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) ${updateClause}`,
    values as any
  );
  return id;
}

export function now(): string {
  return new Date().toISOString();
}

export function today(): string {
  return new Date().toISOString().split('T')[0]!;
}

export function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}
