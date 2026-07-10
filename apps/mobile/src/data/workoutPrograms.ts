

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'strength' | 'cardio' | 'hybrid';
  exerciseIds: string[];
  estimatedDuration: number;
}

export const workoutPrograms: WorkoutTemplate[] = [
  {
    id: 'template-beginner-strength',
    name: 'Full Body Strength',
    description: '3x per week full body program',
    difficulty: 'beginner',
    type: 'strength',
    exerciseIds: ['ex-bench-press', 'ex-squats', 'ex-pull-ups'],
    estimatedDuration: 45,
  },
];