import { MIGRATIONS } from './migrations';
import { seedDatabase } from './seed';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

let nativeDb: any = null;

export interface DB {
  execSync(sql: string): void;
  getAllSync<T>(sql: string, params?: any[]): T[];
  getFirstSync<T>(sql: string, params?: any[]): T | null;
  runSync(sql: string, params?: any[]): void;
  withTransactionSync(fn: () => void): void;
  closeSync(): void;
}

function createWebDb(): DB {
  const tables = new Set<string>();
  const data = new Map<string, any[]>();
  let rowId = 0;

  function ensureTable(name: string) {
    if (name.startsWith('_schema_version')) return;
    if (!tables.has(name)) tables.add(name);
  }

  function getAllSyncInternal(sql: string, _params?: any[]): any[] {
    const match = sql.match(/FROM\s+(\w+)/i);
    if (match) return data.get(match[1]!) ?? [];
    return [];
  }

  return {
    execSync(_sql: string) {},
    getAllSync<T>(sql: string, _params?: any[]): T[] {
      return getAllSyncInternal(sql, _params) as T[];
    },
    getFirstSync<T>(sql: string, params?: any[]): T | null {
      const rows = getAllSyncInternal(sql, params);
      return rows.length > 0 ? rows[0] as T : null;
    },
    runSync(sql: string, params?: any[]) {
      const insertMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
      if (insertMatch) {
        ensureTable(insertMatch[1]!);
        const rows = data.get(insertMatch[1]!) ?? [];
        const row: any = { id: params?.[0] ?? String(++rowId) };
        rows.push(row);
        data.set(insertMatch[1]!, rows);
      }
    },
    withTransactionSync(fn: () => void) { fn(); },
    closeSync() {},
  };
}

export function getDatabase(): DB {
  if (isWeb) {
    return createWebDb();
  }
  if (!nativeDb) {
    const sqlite = require('expo-sqlite');
    nativeDb = sqlite.openDatabaseSync('fitnessbattle.db');
    configureDatabase(nativeDb);
    runMigrations(nativeDb);
    seedDatabase(nativeDb);
  }
  return nativeDb;
}

function configureDatabase(database: DB): void {
  if (isWeb) return;
  database.execSync('PRAGMA journal_mode = WAL;');
  database.execSync('PRAGMA foreign_keys = ON;');
  database.execSync('PRAGMA busy_timeout = 5000;');
  database.execSync('PRAGMA cache_size = -8000;');
}

function runMigrations(database: DB): void {
  if (isWeb) return;
  database.execSync(`CREATE TABLE IF NOT EXISTS _schema_version (
    version INTEGER PRIMARY KEY NOT NULL,
    applied_at TEXT NOT NULL DEFAULT (datetime('now')),
    description TEXT
  );`);

  const current = database.getFirstSync<{ version: number }>(
    'SELECT version FROM _schema_version ORDER BY version DESC LIMIT 1'
  );
  const currentVersion = current?.version ?? 0;

  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      database.withTransactionSync(() => {
        for (const stmt of migration.statements) {
          database.execSync(stmt);
        }
        database.runSync(
          'INSERT INTO _schema_version (version, description) VALUES (?, ?)',
          [migration.version, migration.description]
        );
      });
    }
  }
}

export function resetDatabase(): void {
  if (nativeDb) {
    nativeDb.closeSync();
    nativeDb = null;
  }
}
