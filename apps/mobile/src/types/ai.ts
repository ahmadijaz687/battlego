export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  thinking?: boolean;
}

export interface CoachPersonality {
  id: string;
  name: string;
  description: string;
}

export interface AISettings {
  goal: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'general_fitness';
  trainingStyle: 'gym' | 'home' | 'outdoor';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  units: 'metric' | 'imperial';
  language: string;
  responseLength: 'brief' | 'normal' | 'detailed';
  notifications: {
    workout: boolean;
    nutrition: boolean;
    hydration: boolean;
    recovery: boolean;
    motivation: boolean;
  };
}

export interface WorkoutRecommendation {
  id: string;
  name: string;
  type: 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'full_body' | 'hiit' | 'strength' | 'hypertrophy' | 'recovery' | 'mobility';
  exercises: AIExercise[];
  duration: number;
  calories: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
}

export interface AIExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface NutritionRecommendation {
  meals: AIMealPlan[];
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface AIMealPlan {
  id: string;
  name: string;
  foods: AIFoodItem[];
  calories: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface AIFoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecoveryAnalysis {
  score: number;
  status: 'well_recovered' | 'moderate' | 'fatigued';
  recommendations: string[];
  nextWorkout?: WorkoutRecommendation;
}