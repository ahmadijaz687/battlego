import { Exercise } from '../types/exercise';

const exercises: Exercise[] = [
  {
    id: 'ex-bench-press',
    name: 'Bench Press',
    description: 'Horizontal pressing exercise for chest and triceps',
    muscles: ['Chest', 'Triceps', 'Shoulders'],
    equipment: ['Barbell', 'Bench'],
    difficulty: 'intermediate',
    instructions: ['Lie on bench', 'Lower bar to chest', 'Press upward'],
    searchTags: ['chest', 'press', 'barbell', 'strength'],
    category: 'strength',
  },
  {
    id: 'ex-pull-ups',
    name: 'Pull-ups',
    description: 'Vertical pulling exercise for back and biceps',
    muscles: ['Back', 'Biceps'],
    equipment: ['Pull-up Bar'],
    difficulty: 'intermediate',
    instructions: ['Grab bar with wide grip', 'Pull until chin over bar', 'Lower with control'],
    searchTags: ['back', 'pull', 'bodyweight', 'strength'],
    category: 'strength',
  },
  {
    id: 'ex-squats',
    name: 'Squats',
    description: 'Fundamental leg exercise for quads, glutes, and hamstrings',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    equipment: ['Barbell', 'Bodyweight'],
    difficulty: 'beginner',
    instructions: ['Stand with feet shoulder-width', 'Sit back into squat', 'Drive through heels'],
    searchTags: ['legs', 'quads', 'glutes', 'strength'],
    category: 'strength',
  },
];

export const exerciseDatabase = {
  exercises,
  byMuscle: (muscle: string) => exercises.filter((e) => e.muscles.includes(muscle)),
  byEquipment: (equipment: string) => exercises.filter((e) => e.equipment.includes(equipment)),
  byId: (id: string) => exercises.find((e) => e.id === id),
  search: (query: string) => exercises.filter((e) => e.name.toLowerCase().includes(query.toLowerCase())),
};