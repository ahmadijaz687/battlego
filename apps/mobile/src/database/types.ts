export interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
  streak: number;
  longest_streak: number;
  points: number;
  timezone: string | null;
  health_providers: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfileRow {
  id: string;
  user_id: string;
  bio: string | null;
  date_of_birth: string | null;
  height: number | null;
  height_unit: string;
  goal: string | null;
  experience: string;
  fitness_level: string;
  activity_level: string;
  equipment: string;
  injuries: string;
  preferences: string;
  onboarding_complete: number;
  created_at: string;
  updated_at: string;
}

export interface UserLevelRow {
  id: string;
  user_id: string;
  level: number;
  xp: number;
  total_xp: number;
  updated_at: string;
}

export interface ExerciseRow {
  id: string;
  name: string;
  primary_muscle: string;
  secondary_muscles: string;
  equipment: string;
  difficulty: string;
  category: string | null;
  tags: string;
  instructions: string | null;
  image_url: string | null;
  video_url: string | null;
  met: number | null;
  is_bodyweight: number;
  calories_per_min: number | null;
  demo_media: string;
  created_at: string;
  updated_at: string;
}

export type WorkoutType = 'strength' | 'cardio' | 'hybrid';
export type WorkoutDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type RecordType = 'MAX_WEIGHT' | 'MAX_REPS' | 'BEST_TIME' | 'LONGEST_DISTANCE';
export type BattleMode = 'REPS' | 'CALORIES' | 'DURATION' | 'DISTANCE' | 'WORKOUTS';
export type BattleStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
export type UnitType = 'lbs' | 'kg';

export interface WorkoutRow {
  id: string;
  user_id: string;
  name: string;
  type: WorkoutType;
  difficulty: WorkoutDifficulty;
  duration: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface WorkoutSectionRow {
  id: string;
  workout_id: string;
  type: string;
  name: string;
  sort_order: number;
}

export interface WorkoutExerciseRow {
  id: string;
  section_id: string;
  exercise_id: string;
  name: string;
  sort_order: number;
}

export interface WorkoutSetRow {
  id: string;
  exercise_id: string;
  set_number: number;
  reps: number | null;
  weight: number | null;
  duration: number | null;
  distance: number | null;
  tempo: string | null;
  rpe: number | null;
  rest_after: number | null;
  notes: string | null;
  completed: number;
  is_pr: number;
  completed_at: string | null;
}

export interface PersonalRecordRow {
  id: string;
  user_id: string;
  exercise_id: string;
  exercise_name: string;
  record_type: RecordType;
  value: number;
  unit: string;
  date: string;
}

export interface WorkoutTemplateRow {
  id: string;
  name: string;
  description: string | null;
  difficulty: WorkoutDifficulty;
  duration: number;
  exercises: string;
  created_at: string;
}

export interface FoodRow {
  id: string;
  name: string;
  brand: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  serving_size: string;
  category: string | null;
  tags: string;
  barcode: string | null;
  per_100g: string | null;
  created_at: string;
}

export interface MealRow {
  id: string;
  user_id: string;
  name: string;
  type: MealType;
  date: string;
  time: string | null;
  created_at: string;
}

export interface MealFoodRow {
  id: string;
  meal_id: string;
  food_id: string;
  quantity: number;
  user_id: string | null;
  updated_at: string;
}

export interface WaterLogRow {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  updated_at: string;
}

export interface WeightLogRow {
  id: string;
  user_id: string;
  date: string;
  weight: number;
  unit: UnitType;
}

export interface BodyMeasurementRow {
  id: string;
  user_id: string;
  date: string;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  shoulders: number | null;
  arms: number | null;
  forearms: number | null;
  thighs: number | null;
  calves: number | null;
  neck: number | null;
  body_fat: number | null;
}

export interface BattleRow {
  id: string;
  creator_id: string;
  opponent_id: string | null;
  type: string;
  battle_type_id: string | null;
  battle_mode: BattleMode | null;
  metric: string | null;
  target: number | null;
  invite_code: string | null;
  status: BattleStatus;
  creator_score: number | null;
  opponent_score: number | null;
  start_time: string | null;
  end_time: string | null;
  winner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BattleParticipantRow {
  id: string;
  battle_id: string;
  user_id: string;
  joined_at: string;
  status: string;
  progress: number;
  score: number;
  rank: number | null;
  xp_earned: number;
  coins_earned: number;
  completed: number;
  completion_time: string | null;
}

export interface BattleProgressRow {
  id: string;
  battle_id: string;
  user_id: string;
  current_value: number;
  target_value: number;
  percentage: number;
  last_updated: string;
}

export interface LeaderboardRow {
  id: string;
  type: string;
  period: string | null;
  season_id: string | null;
  updated_at: string;
  created_at: string;
}

export interface LeaderboardEntryRow {
  id: string;
  leaderboard_id: string;
  user_id: string;
  rank: number;
  xp: number;
  points: number;
  wins: number;
  losses: number;
  streak: number;
  workouts: number;
  calories: number;
  distance: number;
  updated_at: string;
}

export interface AchievementRow {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xp_reward: number;
  criteria: string;
  created_at: string;
}

export interface UserAchievementRow {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface BadgeRow {
  id: string;
  key: string;
  name: string;
  description: string | null;
  icon: string | null;
  tier: string;
  xp_reward: number;
}

export interface UserBadgeRow {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
}

export interface CoinRow {
  id: string;
  user_id: string;
  balance: number;
  earned: number;
  spent: number;
  updated_at: string;
  created_at: string;
}

export interface CoinTransactionRow {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface SeasonRow {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  active: number;
  created_at: string;
}

export interface BattlePassRow {
  id: string;
  user_id: string;
  season_id: string;
  tier: number;
  xp: number;
  premium: number;
  claimed: string;
  created_at: string;
  updated_at: string;
}

export interface HabitRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string;
  frequency: string;
  target: number;
  unit: string | null;
  streak: number;
  longest_streak: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface HabitLogRow {
  id: string;
  habit_id: string;
  date: string;
  value: number;
  note: string | null;
  created_at: string;
}

export interface SleepLogRow {
  id: string;
  user_id: string;
  date: string;
  duration: number;
  quality: number | null;
  deep_sleep: number | null;
  rem_sleep: number | null;
  light_sleep: number | null;
  awake_time: number | null;
  source: string | null;
  created_at: string;
}

export interface HrvLogRow {
  id: string;
  user_id: string;
  date: string;
  hrv: number;
  rmssd: number | null;
  sdnn: number | null;
  source: string | null;
  created_at: string;
}

export interface MoodLogRow {
  id: string;
  user_id: string;
  date: string;
  mood: number;
  energy: number | null;
  stress: number | null;
  note: string | null;
  created_at: string;
}

export interface DailyMissionRow {
  id: string;
  user_id: string;
  mission_date: string;
  missions: string;
  completed: number;
  reward_claimed: number;
  created_at: string;
}

export interface WeeklyMissionRow {
  id: string;
  user_id: string;
  week: number;
  year: number;
  missions: string;
  completed: number;
  reward_claimed: number;
  created_at: string;
}

export interface MonthlyMissionRow {
  id: string;
  user_id: string;
  month: number;
  year: number;
  missions: string;
  completed: number;
  reward_claimed: number;
  created_at: string;
}

export interface WorkoutSessionData {
  workout: WorkoutRow;
  sections: (WorkoutSectionRow & {
    exercises: (WorkoutExerciseRow & {
      sets: WorkoutSetRow[];
    })[];
  })[];
}

export interface WorkoutHistoryDay {
  date: string;
  workouts: WorkoutRow[];
}

export interface WorkoutAnalytics {
  weeklyVolume: number;
  monthlyVolume: number;
  muscleBalance: Record<string, number>;
  workoutFrequency: number;
  consistencyScore: number;
  strengthProgress: Array<{ exercise: string; current: number; previous: number }>;
}

export interface DailyMacros {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: (MealRow & { foods: (MealFoodRow & { food: FoodRow })[] })[];
}

export interface BattleDetail {
  id: string;
  type: string;
  mode: BattleMode | null;
  metric: string | null;
  target: number | null;
  status: BattleStatus;
  startDate: string | null;
  endDate: string | null;
  inviteCode: string | null;
  createdBy: string;
  participants: Array<{
    user: { id: string; name: string; avatar: string | null };
    progressValue: number;
    isWinner: boolean;
    joinedAt: string;
  }>;
  standings: Array<{
    rank: number;
    userId: string;
    name: string;
    progressValue: number;
    isWinner: boolean;
  }>;
}
