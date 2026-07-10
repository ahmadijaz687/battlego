export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string[];
  thumbnail?: string;
  demoUrl?: string;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  tempo?: string;
  rpe?: number;
  restAfter?: number;
  notes?: string;
  completed: boolean;
  isPR?: boolean;
}

export interface WorkoutSection {
  id: string;
  type: 'warmup' | 'main' | 'cooldown';
  name: string;
  exercises: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'hybrid';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  sections: WorkoutSection[];
  createdAt: string;
  completedAt?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  workoutsPerWeek: number;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: string;
    rest: number;
  }[];
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  type: '1rm' | 'reps' | 'volume';
  value: number;
  unit: string;
  date: string;
  previousValue?: number;
}

export interface WorkoutHistory {
  date: string;
  workouts: Workout[];
}

export interface WorkoutAnalytics {
  weeklyVolume: number;
  monthlyVolume: number;
  muscleBalance: Record<string, number>;
  workoutFrequency: number;
  consistencyScore: number;
  strengthProgress: { exercise: string; current: number; previous: number }[];
}