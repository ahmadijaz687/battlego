export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
}

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface Workout {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'hybrid';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  exercises: WorkoutExercise[];
  createdAt: string;
  completedAt?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  weight?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export interface Meal {
  id: string;
  name: string;
  foods: { foodId: string; quantity: number }[];
  time?: string;
}

export interface Friend {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
}

export interface Battle {
  id: string;
  creatorId: string;
  opponentId?: string;
  type: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  winnerId?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  xp: number;
  level: number;
  avatar?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'friend_request' | 'battle_invite' | 'achievement' | 'message';
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
}
