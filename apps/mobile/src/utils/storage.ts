type StorageBackend = {
  set(key: string, value: string): void;
  getString(key: string): string | undefined;
  delete(key: string): void;
  clearAll(): void;
};

function createWebStorage(): StorageBackend {
  return {
    set(key: string, value: string) {
      try {
        localStorage.setItem(key, value);
      } catch {
        // localStorage might be unavailable
      }
    },
    getString(key: string): string | undefined {
      try {
        return localStorage.getItem(key) ?? undefined;
      } catch {
        return undefined;
      }
    },
    delete(key: string) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
    clearAll() {
      try {
        localStorage.clear();
      } catch {
        // ignore
      }
    },
  };
}

let storageImpl: StorageBackend;

try {
  // Try to load MMKV (native mobile)
  const { MMKV } = require('react-native-mmkv');
  const mmkv = new MMKV();
  storageImpl = {
    set(key: string, value: string) { mmkv.set(key, value); },
    getString(key: string) { return mmkv.getString(key); },
    delete(key: string) { mmkv.delete(key); },
    clearAll() { mmkv.clearAll(); },
  };
} catch {
  // Fallback to web-compatible localStorage
  storageImpl = createWebStorage();
}

export const storageKeys = {
  auth: {
    accessToken: 'auth.accessToken',
    refreshToken: 'auth.refreshToken',
    user: 'auth.user',
  },
  workout: {
    currentSession: 'workout.currentSession',
    templates: 'workout.templates',
    recentExercises: 'workout.recentExercises',
    offlineQueue: 'workout.offlineQueue',
  },
  settings: {
    theme: 'settings.theme',
    notifications: 'settings.notifications',
  },
  sync: {
    lastSync: 'sync.lastSyncTimestamp',
    deadLetterQueue: 'sync.deadLetterQueue',
    conflicts: 'sync.conflicts',
  },
} as const;

export function setItem(key: string, value: unknown) {
  storageImpl.set(key, JSON.stringify(value));
}

export function getItem<T>(key: string): T | null {
  const value = storageImpl.getString(key);
  return value ? JSON.parse(value) as T : null;
}

export function removeItem(key: string) {
  storageImpl.delete(key);
}

export function clearAll() {
  storageImpl.clearAll();
}

export { storageImpl as storage };