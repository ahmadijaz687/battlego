import { create } from 'zustand';
import { ExerciseSet, WorkoutSession, WorkoutAnalytics } from '../types/workout';
import { WorkoutTemplate } from '../data/workoutPrograms';
import * as workoutService from '../services/workoutService';
import { useAuthStore } from './authStore';

interface HistoryDay {
  date: string;
  workouts: WorkoutSession[];
}

interface WorkoutState {
  currentSession: WorkoutSession | null;
  activeSetId: string | null;
  activeExerciseIndex: number;
  elapsedTime: number;
  isRunning: boolean;
  templates: WorkoutTemplate[];
  history: HistoryDay[];
  records: any[];
  analytics: WorkoutAnalytics | null;
  isLoading: boolean;
  error: string | null;
  startSession: (session: WorkoutSession) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  addSet: (set: ExerciseSet) => void;
  completeSet: (setId: string) => void;
  completeWorkout: () => void;
  tick: () => void;
  loadTemplates: () => void;
  loadHistory: () => void;
  loadRecords: () => void;
  loadAnalytics: () => void;
  loadCurrentSession: () => void;
}

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  currentSession: null,
  activeSetId: null,
  activeExerciseIndex: 0,
  elapsedTime: 0,
  isRunning: false,
  templates: [],
  history: [],
  records: [],
  analytics: null,
  isLoading: false,
  error: null,

  startSession: (session) => set({ currentSession: session, isRunning: true, elapsedTime: 0 }),

  pauseSession: () => set({ isRunning: false }),

  resumeSession: () => set({ isRunning: true }),

  completeSession: () => set({ currentSession: null, activeSetId: null, isRunning: false }),

  completeWorkout: () => {
    const userId = getUserId();
    const session = get().currentSession;
    if (userId && session) {
      try {
        workoutService.completeWorkout(userId, session.id);
      } catch (err) {
        set({ error: 'Failed to complete workout' });
      }
    }
    set({ currentSession: null, activeSetId: null, isRunning: false });
  },

  addSet: (setConfig) => {
    const session = get().currentSession;
    if (session) {
      set({
        currentSession: {
          ...session,
          exercises: [...session.exercises, setConfig],
        },
      });
    }
  },

  completeSet: (setId) => {
    const session = get().currentSession;
    if (session) {
      set({
        currentSession: {
          ...session,
          exercises: session.exercises.map((e) =>
            e.id === setId ? { ...e, sets: e.sets.map((s, i) => (i === e.sets.length - 1 ? { ...s, completed: true } : s)) } : e
          ),
        },
        activeExerciseIndex: get().activeExerciseIndex + 1,
      });
    }
  },

  tick: () => {
    if (get().isRunning) {
      set({ elapsedTime: get().elapsedTime + 1 });
    }
  },

  loadTemplates: () => {
    try {
      const rows = workoutService.getTemplates();
      const templates: WorkoutTemplate[] = rows.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description ?? '',
        difficulty: r.difficulty as any,
        type: 'strength' as const,
        exerciseIds: [],
        estimatedDuration: r.duration,
        duration: r.duration,
        exercises: JSON.parse(r.exercises),
      }));
      set({ templates });
    } catch (err) {
      set({ error: 'Failed to load workout templates' });
    }
  },

  loadHistory: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const days = workoutService.getWorkoutHistory(userId);
      const history: HistoryDay[] = days.map((d) => ({
        date: d.date,
        workouts: d.workouts.map((w) => ({
          id: w.id,
          name: w.name,
          type: w.type,
          duration: w.duration,
          exercises: [],
          isActive: !w.completed_at && !!w.started_at,
          isCompleted: !!w.completed_at,
          createdAt: w.created_at,
        })),
      }));
      set({ history });
    } catch (err) {
      set({ error: 'Failed to load workout history' });
    }
  },

  loadRecords: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const records = workoutService.getPersonalRecords(userId);
      set({ records });
    } catch (err) {
      set({ error: 'Failed to load personal records' });
    }
  },

  loadAnalytics: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const analytics = workoutService.getWorkoutAnalytics(userId);
      set({ analytics: analytics as unknown as WorkoutAnalytics });
    } catch (err) {
      set({ error: 'Failed to load analytics' });
    }
  },

  loadCurrentSession: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const sessionData = workoutService.getCurrentSession(userId);
      if (sessionData) {
        set({
          currentSession: {
            id: sessionData.workout.id,
            name: sessionData.workout.name,
            type: sessionData.workout.type,
            duration: sessionData.workout.duration,
            exercises: [],
            isActive: true,
            isCompleted: false,
          },
          isRunning: true,
        });
      }
    } catch (err) {
      set({ error: 'Failed to load current session' });
    }
  },
}));
