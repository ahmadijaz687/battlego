import { create } from 'zustand';
import * as habitService from '../services/habitService';
import type { HabitRow, HabitLogRow } from '../database/types';
import { useAuthStore } from './authStore';

interface HabitStats {
  total: number;
  tracked: number;
  completionRate: number;
  bestStreak: number;
  habits: Array<{ id: string; name: string; category: string; streak: number; longestStreak: number }>;
}

interface HabitState {
  habits: HabitRow[];
  habitStats: HabitStats | null;
  isLoading: boolean;
  error: string | null;

  fetchHabits: () => void;
  fetchHabitStats: () => void;
  createHabit: (data: { name: string; description?: string; category: string; frequency?: string; target?: number; unit?: string }) => void;
  logHabit: (habitId: string, data?: { date?: string; value?: number; note?: string }) => void;
  deleteHabit: (habitId: string) => void;
}

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  habitStats: null,
  isLoading: false,
  error: null,

  fetchHabits: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true });
      const habits = habitService.getHabits(userId);
      set({ habits, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load habits', isLoading: false });
    }
  },

  fetchHabitStats: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true });
      const stats = habitService.getHabitStats(userId);
      set({ habitStats: stats, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load habit stats', isLoading: false });
    }
  },

  createHabit: (data) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      habitService.createHabit(userId, data);
      const habits = habitService.getHabits(userId);
      set({ habits });
    } catch (err) {
      set({ error: 'Failed to create habit' });
    }
  },

  logHabit: (habitId, data) => {
    try {
      habitService.logHabit(habitId, data);
      const userId = getUserId();
      if (userId) {
        const stats = habitService.getHabitStats(userId);
        set({ habitStats: stats });
      }
    } catch (err) {
      set({ error: 'Failed to log habit' });
    }
  },

  deleteHabit: (habitId) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      habitService.deleteHabit(habitId, userId);
      const habits = habitService.getHabits(userId);
      set({ habits });
    } catch (err) {
      set({ error: 'Failed to delete habit' });
    }
  },
}));
