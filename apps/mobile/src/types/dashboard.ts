export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  calories: { current: number; goal: number; burned: number };
  steps: { current: number; goal: number };
  activeMinutes: { current: number; goal: number };
  waterIntake: { current: number; goal: number };
}

export interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WorkoutSummary {
  weeklyWorkouts: number;
  totalMinutes: number;
  favoriteType: string;
}

export interface UpcomingWorkout {
  id: string;
  name: string;
  time: string;
  duration: number;
  type: string;
}

export interface UpcomingBattle {
  id: string;
  opponent: { name: string; id: string };
  workout: string;
  time: string;
  prize: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: { id: string; name: string };
  xp: number;
  level: number;
}

export interface FriendActivity {
  id: string;
  user: { name: string; id: string };
  activity: string;
  time: string;
  value?: string;
}

export interface AITip {
  id: string;
  tip: string;
  category: 'workout' | 'nutrition' | 'recovery' | 'motivation';
}