import { create } from 'zustand';
import * as healthService from '../services/healthService';
import { useAuthStore } from './authStore';

type SleepLogRow = any;
type HrvLogRow = any;
type MoodLogRow = any;

interface HealthState {
  sleepLogs: any[];
  hrvLogs: any[];
  moodLogs: any[];
  healthSummary: healthService.HealthSummary | null;
  healthMetrics: { steps?: number | null; heartRate?: number | null; sleep?: number | null; weight?: number | null } | null;
  isLoading: boolean;
  error: string | null;

  fetchSleepLogs: (days?: number) => void;
  fetchHRVLogs: (days?: number) => void;
  fetchMoodLogs: (days?: number) => void;
  fetchHealthSummary: (days?: number) => void;
  fetchHealthMetrics: (days?: number) => void;
  logSleep: (data: { date?: string; duration: number; quality?: number; deepSleep?: number; remSleep?: number; lightSleep?: number; awakeTime?: number; source?: string }) => void;
  logHRV: (data: { date?: string; hrv: number; rmssd?: number; sdnn?: number; source?: string }) => void;
  logMood: (data: { date?: string; mood: number; energy?: number; stress?: number; note?: string }) => void;
  syncHealth: (readings: healthService.HealthReading[]) => void;
}

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

export const useHealthStore = create<HealthState>((set) => ({
  sleepLogs: [],
  hrvLogs: [],
  moodLogs: [],
  healthSummary: null,
  healthMetrics: null,
  isLoading: false,
  error: null,

  fetchSleepLogs: (days = 30) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true });
      const logs = healthService.getSleepLogs(userId, days);
      set({ sleepLogs: logs, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load sleep logs', isLoading: false });
    }
  },

  fetchHRVLogs: (days = 30) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true });
      const logs = healthService.getHRVLogs(userId, days);
      set({ hrvLogs: logs, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load HRV logs', isLoading: false });
    }
  },

  fetchMoodLogs: (days = 30) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true });
      const logs = healthService.getMoodLogs(userId, days);
      set({ moodLogs: logs, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load mood logs', isLoading: false });
    }
  },

  fetchHealthSummary: (days = 7) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true });
      const summary = healthService.getHealthSummary(userId, days);
      set({ healthSummary: summary, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load health summary', isLoading: false });
    }
  },

  fetchHealthMetrics: (days = 7) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true });
      const metrics = healthService.getHealthMetricsSummary(userId, days);
      set({ healthMetrics: metrics, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load health metrics', isLoading: false });
    }
  },

  logSleep: (data) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      healthService.logSleep(userId, data);
      const logs = healthService.getSleepLogs(userId);
      set({ sleepLogs: logs });
    } catch (err) {
      set({ error: 'Failed to log sleep' });
    }
  },

  logHRV: (data) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      healthService.logHRV(userId, data);
      const logs = healthService.getHRVLogs(userId);
      set({ hrvLogs: logs });
    } catch (err) {
      set({ error: 'Failed to log HRV' });
    }
  },

  logMood: (data) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      healthService.logMood(userId, data);
      const logs = healthService.getMoodLogs(userId);
      set({ moodLogs: logs });
    } catch (err) {
      set({ error: 'Failed to log mood' });
    }
  },

  syncHealth: (readings) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      healthService.syncHealthData(userId, readings);
    } catch (err) {
      set({ error: 'Failed to sync health data' });
    }
  },
}));
