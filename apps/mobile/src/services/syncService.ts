import { apiClient } from './apiClient';
import {
  offlineQueue,
  performDeltaSync,
  startBackgroundSync,
  stopBackgroundSync,
  getPendingConflicts,
  resolveConflict as resolveConflictItem,
  getLastSyncTimestamp,
  Conflict,
  ConflictStrategy,
  SyncResult,
} from './offlineQueue';

interface PullResult {
  workouts: Record<string, unknown>[];
  nutrition: Record<string, unknown>[];
  battles: Record<string, unknown>[];
  social: Record<string, unknown>[];
  health: Record<string, unknown>[];
  habits: Record<string, unknown>[];
  profiles: Record<string, unknown>[];
  deletedIds: string[];
}

interface PushResult {
  accepted: Array<{ id: string; serverVersion: Record<string, unknown> }>;
  conflicts: Array<{ id: string; clientVersion: Record<string, unknown>; serverVersion: Record<string, unknown> }>;
  rejected: Array<{ id: string; reason: string }>;
}

class SyncService {
  private isSyncing = false;
  private syncIntervalId: ReturnType<typeof setInterval> | null = null;
  private online = true;

  setOnlineStatus(status: boolean): void {
    this.online = status;
  }

  async sync(): Promise<SyncResult> {
    if (this.isSyncing || !this.online) {
      return { synced: 0, failed: 0, conflicts: 0, total: 0 };
    }

    this.isSyncing = true;

    try {
      const pendingCount = offlineQueue.getCount();

      if (pendingCount > 0) {
        const queueResult = await offlineQueue.syncAll();
        if (queueResult.failed > 0) {
          return queueResult;
        }
      }

      const deltaResult = await performDeltaSync();
      return deltaResult;
    } catch {
      return { synced: 0, failed: offlineQueue.getCount(), conflicts: 0, total: offlineQueue.getCount() };
    } finally {
      this.isSyncing = false;
    }
  }

  async pullChanges(domains?: string[]): Promise<PullResult> {
    const lastSync = getLastSyncTimestamp();

    const response = await apiClient.post('/sync/pull', {
      lastSync: lastSync > 0 ? new Date(lastSync).toISOString() : undefined,
      domains: domains || [],
    });

    return response.data?.data as PullResult;
  }

  async pushChanges(): Promise<PushResult> {
    const pendingItems = offlineQueue.getAll();

    if (pendingItems.length === 0) {
      return { accepted: [], conflicts: [], rejected: [] };
    }

    const changes = pendingItems.map((item) => ({
      domain: item.type.split('-')[0],
      action: item.type.startsWith('create') ? 'create' : ('update' as const),
      entityId: item.id,
      data: item.data,
      clientTimestamp: new Date(item.timestamp).toISOString(),
    }));

    const response = await apiClient.post('/sync/push', { changes });
    const result = response.data?.data as PushResult;

    for (const accepted of result.accepted || []) {
      offlineQueue.markSynced(accepted.id);
    }

    return result;
  }

  async handleConflicts(conflicts: Conflict[]): Promise<void> {
    for (const conflict of conflicts) {
      try {
        await resolveConflictItem(conflict.id, 'server_wins');
      } catch {
        // Individual conflict resolution failure
      }
    }
  }

  startAutoSync(intervalMs = 30000): void {
    this.stopAutoSync();
    startBackgroundSync(intervalMs);

    this.syncIntervalId = setInterval(() => {
      this.sync();
    }, intervalMs);
  }

  stopAutoSync(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
    stopBackgroundSync();
  }

  getLastSyncTime(): number {
    return getLastSyncTimestamp();
  }

  isOnline(): boolean {
    return this.online;
  }

  async getPendingChanges(): Promise<number> {
    return offlineQueue.getCount();
  }

  getPendingConflicts(): Conflict[] {
    return getPendingConflicts();
  }

  async resolveConflict(conflictId: string, strategy: ConflictStrategy): Promise<void> {
    return resolveConflictItem(conflictId, strategy);
  }
}

export const syncService = new SyncService();
