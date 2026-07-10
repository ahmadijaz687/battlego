import { create } from 'zustand';
import { getDatabase } from '../database';
import { useAuthStore } from './authStore';

interface UserProfileData {
  id: string;
  userId: string;
  bio: string | null;
  dateOfBirth: string | null;
  height: number | null;
  heightUnit: string;
  goal: string | null;
  experience: string;
  fitnessLevel: string;
  activityLevel: string;
  equipment: string[];
  injuries: string[];
  preferences: Record<string, unknown>;
  onboardingComplete: boolean;
}

interface UserLevelData {
  level: number;
  xp: number;
  totalXp: number;
}

interface ProfileState {
  profile: UserProfileData | null;
  level: UserLevelData | null;
  isLoading: boolean;
  error: string | null;
  loadProfile: () => void;
  loadLevel: () => void;
  updateProfile: (data: Partial<UserProfileData>) => void;
  completeOnboarding: (data: {
    goal: string;
    experience: string;
    fitnessLevel: string;
    activityLevel: string;
    equipment: string[];
    injuries: string[];
  }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  level: null,
  isLoading: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  loadProfile: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const d = getDatabase();
      const row = d.getFirstSync<any>(
        'SELECT * FROM user_profiles WHERE user_id = ?', [userId]
      );
      if (row) {
        set({
          profile: {
            id: row.id,
            userId: row.user_id,
            bio: row.bio,
            dateOfBirth: row.date_of_birth,
            height: row.height,
            heightUnit: row.height_unit,
            goal: row.goal,
            experience: row.experience,
            fitnessLevel: row.fitness_level,
            activityLevel: row.activity_level,
            equipment: JSON.parse(row.equipment || '[]'),
            injuries: JSON.parse(row.injuries || '[]'),
            preferences: JSON.parse(row.preferences || '{}'),
            onboardingComplete: row.onboarding_complete === 1,
          },
          isLoading: false,
        });
      } else {
        set({
          profile: {
            id: '',
            userId,
            bio: null,
            dateOfBirth: null,
            height: null,
            heightUnit: 'cm',
            goal: null,
            experience: 'beginner',
            fitnessLevel: 'beginner',
            activityLevel: 'sedentary',
            equipment: [],
            injuries: [],
            preferences: {},
            onboardingComplete: false,
          },
          isLoading: false,
        });
      }
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load profile' });
    }
  },

  loadLevel: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const d = getDatabase();
      const row = d.getFirstSync<any>(
        'SELECT * FROM user_levels WHERE user_id = ?', [userId]
      );
      if (row) {
        set({
          level: {
            level: row.level,
            xp: row.xp,
            totalXp: row.total_xp,
          },
        });
      }
    } catch (err) {
      set({ error: 'Failed to load level' });
    }
  },

  updateProfile: (data) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const d = getDatabase();
      const existing = d.getFirstSync<any>(
        'SELECT * FROM user_profiles WHERE user_id = ?', [userId]
      );
      if (existing) {
        const updates: string[] = [];
        const values: any[] = [];
        if (data.bio !== undefined) { updates.push('bio = ?'); values.push(data.bio); }
        if (data.goal !== undefined) { updates.push('goal = ?'); values.push(data.goal); }
        if (data.experience !== undefined) { updates.push('experience = ?'); values.push(data.experience); }
        if (data.fitnessLevel !== undefined) { updates.push('fitness_level = ?'); values.push(data.fitnessLevel); }
        if (data.activityLevel !== undefined) { updates.push('activity_level = ?'); values.push(data.activityLevel); }
        if (data.height !== undefined) { updates.push('height = ?'); values.push(data.height); }
        if (data.equipment !== undefined) { updates.push('equipment = ?'); values.push(JSON.stringify(data.equipment)); }
        if (data.injuries !== undefined) { updates.push('injuries = ?'); values.push(JSON.stringify(data.injuries)); }
        if (updates.length > 0) {
          d.runSync(
            `UPDATE user_profiles SET ${updates.join(', ')}, updated_at = datetime('now') WHERE user_id = ?`,
            [...values, userId]
          );
        }
      }
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : null,
      }));
    } catch (err) {
      set({ error: 'Failed to update profile' });
    }
  },

  completeOnboarding: (data) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const d = getDatabase();
      const { randomUUID } = require('expo-crypto');
      const id = randomUUID();
      d.runSync(
        `INSERT OR REPLACE INTO user_profiles
         (id, user_id, goal, experience, fitness_level, activity_level, equipment, injuries, onboarding_complete)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [id, userId, data.goal, data.experience, data.fitnessLevel, data.activityLevel,
         JSON.stringify(data.equipment), JSON.stringify(data.injuries)]
      );
      set((state) => ({
        profile: state.profile
          ? { ...state.profile, ...data, equipment: data.equipment, injuries: data.injuries, onboardingComplete: true }
          : null,
      }));
    } catch (err) {
      set({ error: 'Failed to complete onboarding' });
    }
  },
}));
