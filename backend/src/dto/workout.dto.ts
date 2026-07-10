export interface CreateWorkoutDTO {
  name: string;
  type: 'strength' | 'cardio' | 'hybrid';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  sections?: {
    type: 'warmup' | 'main' | 'cooldown';
    name: string;
    order: number;
    exercises?: {
      exerciseId: string;
      name: string;
      order: number;
    }[];
  }[];
}

export interface UpdateWorkoutDTO {
  name?: string;
  type?: 'strength' | 'cardio' | 'hybrid';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  sections?: {
    type: 'warmup' | 'main' | 'cooldown';
    name: string;
    order: number;
    exercises?: {
      exerciseId: string;
      name: string;
      order: number;
    }[];
  }[];
}

export interface CreateWorkoutSetDTO {
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
}

export interface CompleteWorkoutDTO {
  completedAt?: string;
}

export interface WorkoutFilters {
  type?: 'strength' | 'cardio' | 'hybrid';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  page?: number;
  limit?: number;
}
