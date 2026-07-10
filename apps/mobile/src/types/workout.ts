export type SetType = 'straight' | 'superset' | 'dropset' | 'giant-set' | 'circuit' | 'emom' | 'amrap' | 'rest-pause' | 'warmup' | 'cooldown';

export interface ExerciseSet {
  id: string;
  exerciseId: string;
  setType: SetType;
  restAfter?: number;
  targetReps?: number;
  targetWeight?: number;
  targetDuration?: number;
  sets: Array<{
    reps?: number;
    weight?: number;
    completed: boolean;
    actualReps?: number;
    actualWeight?: number;
  }>;
}

export interface WorkoutSession {
  id: string;
  name: string;
  exercises: ExerciseSet[];
  startTime?: Date;
  endTime?: Date;
  isActive: boolean;
  isCompleted: boolean;
  type: 'strength' | 'cardio' | 'hybrid';
  duration?: number;
  createdAt?: string;
}

export interface SetConfigBase {
  id: string;
  exerciseId: string;
  type: SetType;
}

export interface StraightSetConfig extends SetConfigBase {
  type: 'straight';
  sets: number;
  reps: number;
  weight?: number;
  rest: number;
}

export interface SupersetConfig extends SetConfigBase {
  type: 'superset';
  exerciseIds: string[];
  sets: number;
  reps: number;
  rest: number;
}

export interface DropsetConfig extends SetConfigBase {
  type: 'dropset';
  sets: number;
  reps: number;
  weights: number[];
  rest: number;
}

export interface GiantSetConfig extends SetConfigBase {
  type: 'giant-set';
  exerciseIds: string[];
  reps: number;
  rest: number;
}

export interface CircuitConfig extends SetConfigBase {
  type: 'circuit';
  exerciseIds: string[];
  rounds: number;
  timePerExercise: number;
  restBetween: number;
}

export interface EMOMConfig extends SetConfigBase {
  type: 'emom';
  minutes: number;
  reps: number;
}

export interface AMRAPConfig extends SetConfigBase {
  type: 'amrap';
  minutes: number;
  targetReps: number;
}

export interface WorkoutAnalytics {
  weeklyVolume: number;
  monthlyVolume: number;
  muscleBalance: Record<string, number>;
  workoutFrequency: number;
  consistencyScore: number;
  strengthProgress: Array<{ exercise: string; current: number; previous: number }>;
}