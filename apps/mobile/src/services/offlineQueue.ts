import { storage, storageKeys } from '../utils/storage';
import { apiClient } from './apiClient';

export interface OfflineQueueItem {
  id: string;
  type: 'start-workout' | 'complete-set' | 'complete-workout' | 'log-exercise' | 'create-meal' | 'log-water' | 'log-weight' | 'create-post' | 'send-message';
  data: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  synced: boolean;
  conflictResolution?: 'overwrite' | 'merge' | 'skip';
}

export interface Conflict {
  id: string;
  entityId: string;
  domain: string;
  clientVersion: Record<string, unknown>;
  serverVersion: Record<string, unknown>;
  createdAt: number;
}

export interface SyncResult {
  synced: number;
  failed: number;
  conflicts: number;
  total: number;
}

export type ConflictStrategy = 'client_wins' | 'server_wins' | 'merge';

const QUEUE_KEY = storageKeys.workout.offlineQueue;
const DEAD_LETTER_KEY = storageKeys.sync.deadLetterQueue;
const CONFLICTS_KEY = storageKeys.sync.conflicts;
const LAST_SYNC_KEY = storageKeys.sync.lastSync;
const MAX_RETRIES = 5;
const BASE_RETRY_DELAY = 1000;

type QueueChangeListener = (items: OfflineQueueItem[]) => void;

class OfflineQueueManager {
  private listeners: Set<QueueChangeListener> = new Set();
  private isSyncing = false;

  private load(): OfflineQueueItem[] {
    const raw = storage.getString(QUEUE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as OfflineQueueItem[];
    } catch {
      return [];
    }
  }

  private save(items: OfflineQueueItem[]): void {
    storage.set(QUEUE_KEY, JSON.stringify(items));
    this.notify();
  }

  private notify(): void {
    const items = this.load();
    this.listeners.forEach((listener) => listener(items));
  }

  subscribe(listener: QueueChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  add(type: OfflineQueueItem['type'], data: Record<string, unknown>): OfflineQueueItem {
    const items = this.load();
    const item: OfflineQueueItem = {
      id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: MAX_RETRIES,
      synced: false,
    };
    items.push(item);
    this.save(items);
    return item;
  }

  getAll(): OfflineQueueItem[] {
    return this.load().filter((item) => !item.synced);
  }

  getAllIncludingSynced(): OfflineQueueItem[] {
    return this.load();
  }

  markSynced(id: string): void {
    const items = this.load();
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index].synced = true;
      this.save(items);
    }
  }

  remove(id: string): void {
    const items = this.load();
    this.save(items.filter((item) => item.id !== id));
  }

  clear(): void {
    this.save([]);
  }

  getCount(): number {
    return this.load().filter((item) => !item.synced).length;
  }

  private getRetryDelay(retryCount: number): number {
    return BASE_RETRY_DELAY * Math.pow(2, retryCount) + Math.random() * 1000;
  }

  private getEndpoint(type: OfflineQueueItem['type']): string | null {
    const endpoints: Record<OfflineQueueItem['type'], string | null> = {
      'start-workout': null,
      'complete-set': '/workouts/sets/complete',
      'complete-workout': '/workouts/complete',
      'log-exercise': '/workouts/logs',
      'create-meal': '/nutrition/meals',
      'log-water': '/nutrition/water/logs',
      'log-weight': '/nutrition/weight/logs',
      'create-post': '/social/posts',
      'send-message': '/social/messages',
    };
    return endpoints[type];
  }

  private async syncItem(item: OfflineQueueItem): Promise<boolean> {
    const endpoint = this.getEndpoint(item.type);
    if (!endpoint) {
      this.markSynced(item.id);
      return true;
    }

    try {
      await apiClient.post(endpoint, item.data);
      this.markSynced(item.id);
      return true;
    } catch (error: any) {
      if (error?.response?.status === 409 || error?.response?.status === 404) {
        this.remove(item.id);
        return true;
      }

      if (item.retryCount >= item.maxRetries) {
        this.moveToDeadLetter(item);
        this.remove(item.id);
        return false;
      }

      const items = this.load();
      const idx = items.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        items[idx].retryCount++;
        this.save(items);
      }

      return false;
    }
  }

  private moveToDeadLetter(item: OfflineQueueItem): void {
    const raw = storage.getString(DEAD_LETTER_KEY);
    const deadLetter: OfflineQueueItem[] = raw ? JSON.parse(raw) : [];
    deadLetter.push({ ...item, retryCount: item.retryCount + 1 });
    storage.set(DEAD_LETTER_KEY, JSON.stringify(deadLetter));
  }

  getDeadLetterQueue(): OfflineQueueItem[] {
    const raw = storage.getString(DEAD_LETTER_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as OfflineQueueItem[];
    } catch {
      return [];
    }
  }

  clearDeadLetterQueue(): void {
    storage.set(DEAD_LETTER_KEY, '[]');
  }

  retryDeadLetterItem(id: string): void {
    const raw = storage.getString(DEAD_LETTER_KEY);
    if (!raw) return;
    const deadLetter: OfflineQueueItem[] = JSON.parse(raw);
    const item = deadLetter.find(i => i.id === id);
    if (item) {
      item.retryCount = 0;
      item.timestamp = Date.now();
      const items = this.load();
      items.push(item);
      this.save(items);
      const updated = deadLetter.filter(i => i.id !== id);
      storage.set(DEAD_LETTER_KEY, JSON.stringify(updated));
    }
  }

  async syncAll(): Promise<SyncResult> {
    if (this.isSyncing) return { synced: 0, failed: 0, conflicts: 0, total: 0 };
    this.isSyncing = true;

    try {
      const items = this.getAll();
      let synced = 0;
      let failed = 0;

      for (const item of items) {
        const success = await this.syncItem(item);
        if (success) {
          synced++;
        } else {
          failed++;
          await new Promise((resolve) => setTimeout(resolve, this.getRetryDelay(item.retryCount)));
        }
      }

      return { synced, failed, conflicts: 0, total: items.length };
    } finally {
      this.isSyncing = false;
    }
  }

  async processRetryQueue(): Promise<void> {
    const items = this.getAll();
    const now = Date.now();

    for (const item of items) {
      const lastAttemptAge = now - item.timestamp;
      const requiredWait = this.getRetryDelay(item.retryCount);

      if (lastAttemptAge >= requiredWait) {
        await this.syncItem(item);
      }
    }
  }

  async processQueue(): Promise<SyncResult> {
    return this.syncAll();
  }
}

export const offlineQueue = new OfflineQueueManager();

let syncTimer: ReturnType<typeof setTimeout> | null = null;

export function startOfflineSync(): void {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    offlineQueue.syncAll();
    syncTimer = null;
  }, 2000);
}

export function stopOfflineSync(): void {
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }
}

export function startRetryInterval(intervalMs = 30000): () => void {
  const timer = setInterval(() => {
    offlineQueue.processRetryQueue();
  }, intervalMs);
  return () => clearInterval(timer);
}

export async function performDeltaSync(): Promise<SyncResult> {
  const lastSync = storage.getString(LAST_SYNC_KEY);
  const lastSyncTimestamp = lastSync ? parseInt(lastSync, 10) : 0;

  const pendingItems = offlineQueue.getAll();

  const changes = pendingItems.map((item) => ({
    domain: item.type.split('-')[0] === 'create' ? item.type.split('-')[1] : item.type.split('-')[0],
    action: item.type.startsWith('create') ? 'create' : 'update',
    entityId: item.id,
    data: item.data,
    clientTimestamp: new Date(item.timestamp).toISOString(),
  }));

  try {
    const pullResponse = await apiClient.post('/sync/pull', {
      lastSync: lastSyncTimestamp > 0 ? new Date(lastSyncTimestamp).toISOString() : undefined,
      domains: [],
    });

    const pullResult = pullResponse.data?.data;
    if (pullResult) {
      for (const domain of ['workouts', 'nutrition', 'battles', 'social', 'health', 'habits', 'profiles'] as const) {
        const items = pullResult[domain] as Record<string, unknown>[] | undefined;
        if (items && items.length > 0) {
          storage.set(`sync.cache.${domain}`, JSON.stringify(items));
        }
      }
    }

    if (changes.length > 0) {
      const pushResponse = await apiClient.post('/sync/push', { changes });
      const pushResult = pushResponse.data?.data;

      if (pushResult) {
        for (const accepted of pushResult.accepted || []) {
          offlineQueue.markSynced(accepted.id);
        }

        const conflicts: Conflict[] = (pushResult.conflicts || []).map((c: any) => ({
          id: `conflict-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          entityId: c.id,
          domain: changes.find(ch => ch.entityId === c.id)?.domain || 'unknown',
          clientVersion: c.clientVersion,
          serverVersion: c.serverVersion,
          createdAt: Date.now(),
        }));

        if (conflicts.length > 0) {
          const existingConflicts = getPendingConflicts();
          storage.set(CONFLICTS_KEY, JSON.stringify([...existingConflicts, ...conflicts]));
        }
      }
    }

    storage.set(LAST_SYNC_KEY, String(Date.now()));

    return {
      synced: pendingItems.length - offlineQueue.getCount(),
      failed: offlineQueue.getCount(),
      conflicts: getPendingConflicts().length,
      total: pendingItems.length,
    };
  } catch {
    return { synced: 0, failed: pendingItems.length, conflicts: 0, total: pendingItems.length };
  }
}

let backgroundSyncInterval: ReturnType<typeof setInterval> | null = null;

export function startBackgroundSync(intervalMs = 60000): void {
  if (backgroundSyncInterval) return;
  backgroundSyncInterval = setInterval(async () => {
    const lastSync = storage.getString(LAST_SYNC_KEY);
    const pendingCount = offlineQueue.getCount();

    if (pendingCount > 0 || !lastSync) {
      await performDeltaSync();
    }
  }, intervalMs);
}

export function stopBackgroundSync(): void {
  if (backgroundSyncInterval) {
    clearInterval(backgroundSyncInterval);
    backgroundSyncInterval = null;
  }
}

export function getPendingConflicts(): Conflict[] {
  const raw = storage.getString(CONFLICTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Conflict[];
  } catch {
    return [];
  }
}

export async function resolveConflict(
  conflictId: string,
  strategy: ConflictStrategy
): Promise<void> {
  const conflicts = getPendingConflicts();
  const conflict = conflicts.find(c => c.id === conflictId);
  if (!conflict) throw new Error(`Conflict ${conflictId} not found`);

  await apiClient.post('/sync/resolve', {
    resolutions: [{
      entityId: conflict.entityId,
      strategy,
    }],
  });

  const updated = conflicts.filter(c => c.id !== conflictId);
  storage.set(CONFLICTS_KEY, JSON.stringify(updated));
}

export function getLastSyncTimestamp(): number {
  const raw = storage.getString(LAST_SYNC_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

export function setLastSyncTimestamp(timestamp: number): void {
  storage.set(LAST_SYNC_KEY, String(timestamp));
}
