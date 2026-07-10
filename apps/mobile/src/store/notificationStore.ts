import { create } from 'zustand';
import { Notification, NotificationPreferences } from '../types/social';
import { getDatabase } from '../database';
import { useAuthStore } from './authStore';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  isLoading: boolean;
  error: string | null;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  setUnreadCount: (count: number) => void;
  setPreferences: (preferences: Partial<NotificationPreferences>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadNotifications: () => void;
  fetchNotifications: () => void;
}

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  preferences: {
    workout: true,
    meal: true,
    hydration: true,
    battle: true,
    friendRequest: true,
    message: true,
    achievement: true,
    system: true,
    email: false,
    push: true,
    sound: true,
    vibration: true,
  },
  isLoading: false,
  error: null,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.read ? 0 : 1),
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: state.notifications.find((n) => n.id === id && !n.read)
        ? state.unreadCount - 1
        : state.unreadCount,
    })),

  setUnreadCount: (unreadCount) => set({ unreadCount }),
  setPreferences: (prefs) =>
    set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  loadNotifications: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const d = getDatabase();
      const rows = d.getAllSync<any>(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
        [userId]
      );
      const notifications: Notification[] = rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        type: r.type,
        title: r.title,
        content: r.content,
        read: r.read === 1,
        createdAt: r.created_at,
        relatedId: r.related_id,
      }));
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load notifications' });
    }
  },

  fetchNotifications: () => { get().loadNotifications(); },
}));
