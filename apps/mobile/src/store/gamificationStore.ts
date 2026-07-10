import { create } from 'zustand';
import * as gamificationService from '../services/gamificationService';
import * as battleService from '../services/battleService';
import type { BadgeRow, UserBadgeRow, AchievementRow, UserAchievementRow } from '../database/types';
import { useAuthStore } from './authStore';

interface GamificationProfile {
  level: number;
  xp: number;
  totalXp: number;
  streakDays: number;
  badges: (UserBadgeRow & { badge: BadgeRow })[];
  nextLevelXp: number;
}

interface GamificationState {
  profile: GamificationProfile | null;
  level: GamificationProfile | null;
  gamificationProfile: GamificationProfile | null;
  achievements: (UserAchievementRow & { achievement: AchievementRow })[];
  userAchievements: (UserAchievementRow & { achievement: AchievementRow })[];
  allBadges: BadgeRow[];
  badges: BadgeRow[];
  dailyMissions: any | null;
  leaderboard: any[];
  isLoading: boolean;
  error: string | null;
  loadProfile: () => void;
  loadAchievements: () => void;
  loadBadges: () => void;
  loadDailyMissions: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchLevel: () => void;
  fetchAchievements: () => void;
  fetchUserAchievements: () => void;
  fetchGamificationProfile: () => void;
  fetchBadges: () => void;
  fetchLeaderboard: () => void;
  fetchDailyMissions: () => void;
}

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  profile: null,
  level: null,
  gamificationProfile: null,
  achievements: [],
  userAchievements: [],
  allBadges: [],
  badges: [],
  dailyMissions: null,
  leaderboard: [],
  isLoading: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  loadProfile: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const profile = gamificationService.getGamificationProfile(userId);
      set({ profile, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load gamification profile' });
    }
  },

  loadAchievements: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const achievements = gamificationService.getUserAchievements(userId);
      set({ achievements, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load achievements' });
    }
  },

  loadBadges: () => {
    try {
      set({ isLoading: true, error: null });
      const allBadges = gamificationService.getBadges();
      set({ allBadges, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load badges' });
    }
  },

  loadDailyMissions: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const dailyMissions = gamificationService.getDailyMissions(userId);
      set({ dailyMissions, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load daily missions' });
    }
  },

  fetchLevel: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const levelData = gamificationService.getLevel(userId);
      set({ level: levelData as any });
    } catch { /* ignore */ }
  },

  fetchAchievements: () => { get().loadAchievements(); },
  fetchUserAchievements: () => { get().loadAchievements(); },
  fetchGamificationProfile: () => { get().loadProfile(); },
  fetchBadges: () => { get().loadBadges(); },
  fetchLeaderboard: () => {
    try {
      const entries = battleService.getLeaderboard();
      set({ leaderboard: entries });
    } catch { /* ignore */ }
  },
  fetchDailyMissions: () => { get().loadDailyMissions(); },
}));
