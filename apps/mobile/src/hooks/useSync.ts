import { useState, useEffect, useCallback, useRef } from 'react';
import { syncService } from '../services/syncService';
import { offlineQueue, getPendingConflicts, Conflict, SyncResult } from '../services/offlineQueue';
import { useNetworkStatus } from './useNetworkStatus';

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: number;
  pendingChanges: number;
  conflicts: Conflict[];
  sync: () => Promise<SyncResult>;
  refresh: () => Promise<void>;
  resolveConflict: (conflictId: string, strategy: 'client_wins' | 'server_wins' | 'merge') => Promise<void>;
}

export function useSync(): SyncState {
  const { isConnected } = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(syncService.getLastSyncTime());
  const [pendingChanges, setPendingChanges] = useState(0);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    if (!mountedRef.current) return;

    const pending = await syncService.getPendingChanges();
    if (mountedRef.current) setPendingChanges(pending);

    syncService.setOnlineStatus(isConnected);

    const currentConflicts = getPendingConflicts();
    if (mountedRef.current) setConflicts(currentConflicts);

    const lastSyncTime = syncService.getLastSyncTime();
    if (mountedRef.current && lastSyncTime !== lastSync) setLastSync(lastSyncTime);
  }, [isConnected, lastSync]);

  useEffect(() => {
    syncService.setOnlineStatus(isConnected);
  }, [isConnected]);

  useEffect(() => {
    refresh();

    const unsubscribe = offlineQueue.subscribe(() => {
      refresh();
    });

    const interval = setInterval(refresh, 10000);

    return () => {
      mountedRef.current = false;
      unsubscribe();
      clearInterval(interval);
    };
  }, [refresh]);

  const sync = useCallback(async (): Promise<SyncResult> => {
    if (isSyncing || !isConnected) {
      return { synced: 0, failed: 0, conflicts: 0, total: 0 };
    }

    setIsSyncing(true);
    try {
      const result = await syncService.sync();
      setLastSync(Date.now());
      await refresh();
      return result;
    } finally {
      if (mountedRef.current) setIsSyncing(false);
    }
  }, [isSyncing, isConnected, refresh]);

  const resolveConflict = useCallback(async (conflictId: string, strategy: 'client_wins' | 'server_wins' | 'merge') => {
    await syncService.resolveConflict(conflictId, strategy);
    await refresh();
  }, [refresh]);

  return {
    isOnline: isConnected,
    isSyncing,
    lastSync,
    pendingChanges,
    conflicts,
    sync,
    refresh,
    resolveConflict,
  };
}
