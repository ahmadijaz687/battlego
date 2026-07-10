// ============================================
// API
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  errors?: Array<{ field: string; code: string; message: string }>;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================
// AUTH / USER
// ============================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: 'user' | 'admin' | 'guest';
  level: number;
  xp: number;
  streak: number;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export type UserRole = 'user' | 'admin' | 'guest';
export type FitnessGoal = 'lose_fat' | 'gain_muscle' | 'maintain' | 'improve_cardio' | 'strength' | 'athletic_performance';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type Gender = 'male' | 'female' | 'other';
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft';
export type DistanceUnit = 'km' | 'mi';
export type MeasurementSystem = 'metric' | 'imperial';
export type ThemeMode = 'light' | 'dark' | 'system' | 'amoled';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ru' | 'ja' | 'ko' | 'zh';
export type Timezone = string;

export interface UserProfile {
  id: string;
  userId: string;
  bio: string | null;
  dateOfBirth: string | null;
  height: number | null;
  heightUnit: HeightUnit;
  weight: number | null;
  weightUnit: WeightUnit;
  goal: FitnessGoal | null;
  experience: ExperienceLevel;
  fitnessLevel: FitnessLevel;
  activityLevel: ActivityLevel;
  equipment: string[];
  injuries: string[];
  preferences: Record<string, unknown>;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  theme: ThemeMode;
  accentColor: string;
  fontScale: number;
  language: Language;
  timezone: Timezone;
  measurementSystem: MeasurementSystem;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  distanceUnit: DistanceUnit;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  privacyProfile: 'public' | 'private' | 'friends';
  privacyPosts: 'public' | 'private' | 'friends';
  privacyBattles: 'public' | 'private' | 'friends';
  privacyFollowers: 'public' | 'private';
  offlineMode: boolean;
}

// ============================================
// EXERCISE
// ============================================

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type MovementType = 'compound' | 'isolation' | 'bodyweight';
export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'mobility' | 'balance';
export type BodyRegion = 'upper_body' | 'lower_body' | 'core' | 'full_body' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: Difficulty;
  movementType: MovementType;
  exerciseType: ExerciseType;
  bodyRegion: BodyRegion;
  instructions: string | null;
  commonMistakes: string[];
  tips: string[];
  breathingInstructions: string | null;
  videoUrl: string | null;
  thumbnail: string | null;
  gif: string | null;
  images: string[];
  estimatedCaloriesPerMinute: number;
  estimatedMET: number;
  averageDuration: number;
  recommendedSets: number;
  recommendedReps: number;
  recommendedRest: number;
  isCompound: boolean;
  isBodyweight: boolean;
  rating: number;
  views: number;
  favorites: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  color: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface ExerciseVariation {
  id: string;
  exerciseId: string;
  variationName: string;
  difficulty: Difficulty;
  equipment: string[];
  description: string | null;
  video: string | null;
  thumbnail: string | null;
}

export interface ExerciseHistory {
  id: string;
  userId: string;
  exerciseId: string;
  date: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  distance: number;
  calories: number;
  notes: string | null;
  personalRecord: boolean;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  value: number;
  unit: string;
  date: string;
}

// ============================================
// WORKOUT
// ============================================

export type WorkoutGoal = 'strength' | 'hypertrophy' | 'endurance' | 'fat_loss' | 'general_fitness';
export type WorkoutCategory = 'strength' | 'cardio' | 'hiit' | 'yoga' | 'pilates' | 'stretching' | 'calisthenics' | 'powerlifting' | 'crossfit' | 'bodyweight' | 'mobility';
export type WorkoutVisibility = 'public' | 'private' | 'friends';
export type WorkoutStatus = 'draft' | 'active' | 'completed' | 'cancelled';

export interface Workout {
  id: string;
  uuid: string;
  userId: string;
  title: string;
  description: string | null;
  goal: WorkoutGoal;
  difficulty: Difficulty;
  category: WorkoutCategory;
  duration: number;
  estimatedCalories: number;
  thumbnail: string | null;
  coverImage: string | null;
  exerciseCount: number;
  equipment: string[];
  visibility: WorkoutVisibility;
  isCompleted: boolean;
  isFavorite: boolean;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  exercise: Exercise;
  order: number;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  tempo: string | null;
  duration: number;
  distance: number;
  notes: string | null;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutId: string;
  startedAt: string;
  completedAt: string | null;
  duration: number;
  calories: number;
  averageHeartRate: number | null;
  maxHeartRate: number | null;
  steps: number;
  distance: number;
  rating: number | null;
  notes: string | null;
  completionPercentage: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
}

export interface WorkoutHistory {
  id: string;
  userId: string;
  workoutId: string;
  workout: Workout;
  date: string;
  startedAt: string;
  completedAt: string | null;
  duration: number;
  calories: number;
  rating: number | null;
  notes: string | null;
  completionPercentage: number;
}

export interface WorkoutSchedule {
  id: string;
  userId: string;
  workoutId: string;
  date: string;
  time: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  notificationEnabled: boolean;
  completed: boolean;
}

export interface WorkoutTemplate {
  id: string;
  title: string;
  description: string | null;
  category: WorkoutCategory;
  goal: WorkoutGoal;
  difficulty: Difficulty;
  estimatedTime: number;
  estimatedCalories: number;
  thumbnail: string | null;
  coverImage: string | null;
  author: string | null;
  rating: number;
  downloads: number;
  isOfficial: boolean;
  isPremium: boolean;
}

export interface WorkoutProgramDay {
  id: string;
  dayNumber: number;
  title: string;
  workoutId: string;
}

export interface WorkoutProgramWeek {
  id: string;
  programId: string;
  weekNumber: number;
  title: string;
  description: string | null;
  days: WorkoutProgramDay[];
}

export interface WorkoutProgram {
  id: string;
  title: string;
  description: string | null;
  goal: WorkoutGoal;
  difficulty: Difficulty;
  weeks: number;
  daysPerWeek: number;
  estimatedDuration: number;
  coverImage: string | null;
  author: string | null;
  rating: number;
  participants: number;
}

// ============================================
// NUTRITION
// ============================================

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Food {
  id: string;
  uuid: string;
  barcode: string | null;
  name: string;
  brand: string | null;
  categoryId: string | null;
  description: string | null;
  servingSize: string;
  servingUnit: string;
  servingsPerContainer: number | null;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
  cholesterol: number | null;
  potassium: number | null;
  calcium: number | null;
  iron: number | null;
  vitaminA: number | null;
  vitaminB12: number | null;
  vitaminC: number | null;
  vitaminD: number | null;
  vitaminE: number | null;
  vitaminK: number | null;
  magnesium: number | null;
  phosphorus: number | null;
  zinc: number | null;
  allergens: string[];
  ingredients: string[];
  image: string | null;
  thumbnail: string | null;
  rating: number;
  verified: boolean;
}

export interface FoodCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Meal {
  id: string;
  uuid: string;
  userId: string;
  mealType: MealType;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
  image: string | null;
  notes: string | null;
  isCompleted: boolean;
  foods: FoodEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  food: Food;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealPlanDay {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

export interface MealPlan {
  id: string;
  title: string;
  description: string | null;
  goal: FitnessGoal;
  difficulty: Difficulty;
  days: MealPlanDay[];
  author: string | null;
  image: string | null;
  estimatedCalories: number;
  estimatedProtein: number;
  estimatedCarbs: number;
  estimatedFat: number;
}

export interface NutritionGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyFiber: number;
  dailyWater: number;
  targetWeight: number | null;
  goalType: FitnessGoal;
  startDate: string | null;
  endDate: string | null;
}

export interface NutritionHistory {
  date: string;
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
  mealCount: number;
  goalCompletion: number;
}

export interface WaterIntake {
  id: string;
  userId: string;
  date: string;
  target: number;
  consumed: number;
  remaining: number;
  glassCount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  uuid: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  prepTime: number;
  cookTime: number | null;
  totalTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  ingredients: RecipeIngredient[];
  steps: string[];
  tags: string[];
  image: string | null;
  coverImage: string | null;
  authorId: string | null;
  rating: number;
  likes: number;
  favorites: number;
  visibility: 'public' | 'private';
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  foodId: string | null;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ShoppingListItem {
  id: string;
  userId: string;
  shoppingListId: string | null;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

export interface Supplement {
  id: string;
  userId: string;
  name: string;
  brand: string;
  dosage: string;
  time: string;
  frequency: string;
  notes: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface NutritionStatistics {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageWater: number;
  goalCompletionRate: number;
}

// ============================================
// BODY / HEALTH METRICS
// ============================================

export interface BodyMeasurement {
  id: string;
  userId: string;
  weight: number | null;
  bodyFat: number | null;
  bmi: number | null;
  bmr: number | null;
  tdee: number | null;
  neck: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  leftArm: number | null;
  rightArm: number | null;
  leftForearm: number | null;
  rightForearm: number | null;
  leftThigh: number | null;
  rightThigh: number | null;
  leftCalf: number | null;
  rightCalf: number | null;
  shoulders: number | null;
  measurementDate: string;
}

export interface WeightLog {
  id: string;
  userId: string;
  weight: number;
  bodyFat: number | null;
  muscleMass: number | null;
  waterPercentage: number | null;
  date: string;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  image: string;
  caption: string | null;
  weight: number | null;
  bodyFat: number | null;
  date: string;
  visibility: 'public' | 'private' | 'friends';
}

// ============================================
// BATTLE
// ============================================

export type BattleStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type BattleVisibility = 'public' | 'private' | 'friends';
export type BattleType = 'casual' | 'ranked';

export interface BattleCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  difficulty: Difficulty;
  color: string | null;
}

export interface Battle {
  id: string;
  uuid: string;
  battleCode: string;
  title: string;
  description: string | null;
  creatorId: string;
  creator: AuthUser;
  battleTypeId: string | null;
  categoryId: string | null;
  category: BattleCategory | null;
  status: BattleStatus;
  visibility: BattleVisibility;
  difficulty: Difficulty;
  goal: string;
  targetValue: number;
  unit: string | null;
  startDate: string;
  endDate: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  rewardXP: number;
  rewardCoins: number;
  rewardBadge: string | null;
  rewardTitle: string | null;
  winnerId: string | null;
  thumbnail: string | null;
  coverImage: string | null;
  rules: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BattleParticipant {
  id: string;
  battleId: string;
  userId: string;
  user: AuthUser;
  joinedAt: string;
  status: 'active' | 'completed' | 'disconnected';
  progress: number;
  score: number;
  rank: number;
  xpEarned: number;
  coinsEarned: number;
  completed: boolean;
  completionTime: string | null;
}

export interface BattleInvite {
  id: string;
  battleId: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
  acceptedAt: string | null;
}

export interface BattleResult {
  id: string;
  battleId: string;
  winnerId: string;
  runnerUpId: string | null;
  thirdPlaceId: string | null;
  completedAt: string;
  totalParticipants: number;
  averageScore: number;
}

export interface BattleProgress {
  id: string;
  battleId: string;
  userId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
  lastUpdated: string;
}

export interface BattleComment {
  id: string;
  battleId: string;
  userId: string;
  user: AuthUser;
  message: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  theme: string | null;
  status: 'upcoming' | 'active' | 'completed';
  coverImage: string | null;
  rewardPool: number;
}

export interface SeasonProgress {
  currentXP: number;
  currentRank: number;
  tier: string;
  completedChallenges: number;
}

export interface SeasonReward {
  rank: number;
  xp: number;
  coins: number;
  badge: string | null;
  title: string | null;
  exclusiveReward: string | null;
}

// ============================================
// LEADERBOARD
// ============================================

export interface LeaderboardEntry {
  id: string;
  userId: string;
  user: AuthUser;
  rank: number;
  xp: number;
  points: number;
  wins: number;
  losses: number;
  streak: number;
  workouts: number;
  calories: number;
  distance: number;
}

export type LeaderboardType = 'global' | 'friends' | 'weekly' | 'monthly' | 'season';

// ============================================
// XP / GAMIFICATION
// ============================================

export interface XPData {
  currentXP: number;
  currentLevel: number;
  totalXP: number;
  nextLevelXP: number;
  dailyXP: number;
  weeklyXP: number;
  monthlyXP: number;
  lifetimeXP: number;
}

export interface Achievement {
  id: string;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  coinReward: number;
  isUnlocked: boolean;
  progress: number;
  target: number;
  completedAt: string | null;
}

export interface Badge {
  id: string;
  badgeId: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string | null;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  target: number;
  unit: string;
  xpReward: number;
  coinReward: number;
  badgeReward: string | null;
  startDate: string;
  endDate: string;
  isDaily: boolean;
  isWeekly: boolean;
  isMonthly: boolean;
}

export interface DailyMission {
  id: string;
  missionDate: string;
  missions: Challenge[];
  completed: boolean;
  rewardClaimed: boolean;
}

export interface WeeklyMission {
  week: string;
  missions: Challenge[];
  completed: boolean;
  rewardClaimed: boolean;
}

export interface Title {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string | null;
  unlockRequirement: string | null;
}

export interface CoinBalance {
  balance: number;
  earned: number;
  spent: number;
}

// ============================================
// SOCIAL
// ============================================

export interface Post {
  id: string;
  uuid: string;
  userId: string;
  user: AuthUser;
  caption: string | null;
  content: string | null;
  images: string[];
  videos: string[];
  thumbnail: string | null;
  visibility: 'public' | 'private' | 'friends';
  location: string | null;
  hashtags: string[];
  mentions: string[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  savedCount: number;
  workoutId: string | null;
  mealId: string | null;
  battleId: string | null;
  isLiked: boolean;
  isSaved: boolean;
  isPinned: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  uuid: string;
  userId: string;
  user: AuthUser;
  media: string[];
  mediaType: 'image' | 'video';
  caption: string | null;
  background: string | null;
  views: number;
  expiresAt: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  uuid: string;
  postId: string;
  userId: string;
  user: AuthUser;
  parentCommentId: string | null;
  content: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friend: AuthUser;
  status: FriendRequestStatus;
  requestedAt: string;
  acceptedAt: string | null;
}

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';
export type FriendStatus = 'online' | 'offline' | 'busy' | 'away' | 'working_out' | 'sleeping';

export interface FriendRequest {
  id: string;
  senderId: string;
  sender: AuthUser;
  receiverId: string;
  status: FriendRequestStatus;
  message: string | null;
  createdAt: string;
  acceptedAt: string | null;
}

export interface Follower {
  userId: string;
  followerId: string;
  follower: AuthUser;
  followedAt: string;
}

// ============================================
// CHAT / MESSAGES
// ============================================

export interface Chat {
  id: string;
  uuid: string;
  type: 'private' | 'group';
  title: string | null;
  description: string | null;
  avatar: string | null;
  ownerId: string | null;
  participants: AuthUser[];
  lastMessage: Message | null;
  lastActivity: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  uuid: string;
  chatId: string;
  senderId: string;
  sender: AuthUser;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'voice' | 'document' | 'system';
  text: string | null;
  images: string[];
  videos: string[];
  audio: string | null;
  documents: string[];
  replyTo: string | null;
  isEdited: boolean;
  isDeleted: boolean;
  readBy: string[];
  deliveredTo: string[];
  sentAt: string;
  editedAt: string | null;
  deletedAt: string | null;
}

export interface TypingStatus {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

// ============================================
// NOTIFICATIONS
// ============================================

export type NotificationType =
  | 'like'
  | 'comment'
  | 'friend_request'
  | 'battle_invite'
  | 'battle_update'
  | 'achievement'
  | 'xp_gained'
  | 'level_up'
  | 'workout_reminder'
  | 'meal_reminder'
  | 'water_reminder'
  | 'message'
  | 'community'
  | 'system'
  | 'announcement';

export interface Notification {
  id: string;
  uuid: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  icon: string | null;
  image: string | null;
  deepLink: string | null;
  data: Record<string, unknown>;
  priority: 'low' | 'normal' | 'high';
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

// ============================================
// AI COACH
// ============================================

export interface AIConversation {
  id: string;
  uuid: string;
  userId: string;
  title: string;
  summary: string | null;
  conversationType: 'workout' | 'nutrition' | 'recovery' | 'motivation' | 'goal' | 'progress' | 'general';
  model: string;
  systemPrompt: string | null;
  lastMessage: AIMessage | null;
  totalMessages: number;
  tokensUsed: number;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  attachments: string[];
  metadata: Record<string, unknown>;
  tokens: number;
  responseTime: number;
  createdAt: string;
}

// ============================================
// HEALTH / WEARABLE
// ============================================

export interface HealthProvider {
  provider: 'apple_health' | 'health_connect' | 'fitbit' | 'garmin' | 'samsung_health';
  connected: boolean;
  syncEnabled: boolean;
  lastSync: string | null;
}

export interface HealthData {
  steps: number;
  heartRate: number | null;
  restingHeartRate: number | null;
  sleep: number | null;
  calories: number;
  distance: number;
  floors: number | null;
  oxygen: number | null;
  bloodPressure: { systolic: number; diastolic: number } | null;
  bodyTemperature: number | null;
  recordedAt: string;
}

// ============================================
// ANALYTICS / STATISTICS
// ============================================

export interface DashboardStatistics {
  currentLevel: number;
  currentXP: number;
  currentRank: number;
  battleWins: number;
  battleLosses: number;
  streak: number;
  calories: number;
  minutes: number;
  distance: number;
  completedWorkouts: number;
  completedMeals: number;
}

export interface WorkoutStatistics {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  totalDistance: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
  favoriteExercise: string;
}

// ============================================
// OFFLINE
// ============================================

export interface OfflineQueueItem {
  id: string;
  requestType: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  payload: unknown;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  queuedAt: string;
  processedAt: string | null;
}

export interface SyncRecord {
  id: string;
  userId: string;
  entityId: string;
  domain: string;
  action: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  clientTimestamp: string;
  serverTimestamp: string;
  version: number;
}

// ============================================
// SETTINGS
// ============================================

export interface NotificationPreferences {
  workout: boolean;
  nutrition: boolean;
  battle: boolean;
  social: boolean;
  friendRequests: boolean;
  messages: boolean;
  achievements: boolean;
  system: boolean;
  email: boolean;
  push: boolean;
  sound: boolean;
  vibration: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  postsVisibility: 'public' | 'private' | 'friends';
  storiesVisibility: 'public' | 'private' | 'friends';
  activityVisibility: 'public' | 'private' | 'friends';
  showOnlineStatus: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricLogin: boolean;
  activeSessions: DeviceInfo[];
  lastPasswordChange: string | null;
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: string;
  os: string;
  appVersion: string;
  lastLogin: string;
  isCurrent: boolean;
}

// ============================================
// COMMUNITY
// ============================================

export interface Community {
  id: string;
  uuid: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  avatar: string | null;
  ownerId: string;
  owner: AuthUser;
  visibility: 'public' | 'private';
  memberCount: number;
  createdAt: string;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  user: AuthUser;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

// ============================================
// ADMIN
// ============================================

export interface AdminUser {
  id: string;
  userId: string;
  user: AuthUser;
  role: 'admin' | 'moderator' | 'support';
  permissions: string[];
  lastLogin: string | null;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string | null;
  reportedPostId: string | null;
  reportedCommentId: string | null;
  reason: string;
  description: string | null;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface SystemLog {
  level: 'info' | 'warn' | 'error' | 'debug';
  module: string;
  message: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface FeatureFlag {
  feature: string;
  enabled: boolean;
  minimumVersion: string | null;
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  priority: 'low' | 'normal' | 'high';
  published: boolean;
  startDate: string | null;
  endDate: string | null;
}

// ============================================
// NUTRITION CALCULATIONS
// ============================================

export interface MacroCalculation {
  bmr: number;
  tdee: number;
  recommendedCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface BMICalculation {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  recommendations: string[];
}

export interface BMRCalculation {
  bmr: number;
  formula: 'mifflin_st_jeor' | 'harris_benedict';
  explanation: string;
}

export interface TDEEFactors {
  bmr: number;
  activityLevel: ActivityLevel;
  activityMultiplier: number;
  tdee: number;
}

// ============================================
// ENUMS
// ============================================

export const WorkoutTypes = ['strength', 'cardio', 'hybrid'] as const;
export type WorkoutType = typeof WorkoutTypes[number];

export const DifficultyLevels = ['beginner', 'intermediate', 'advanced'] as const;
export const FitnessLevels = ['beginner', 'intermediate', 'advanced', 'elite'] as const;
export const ActivityLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'] as const;
export const ThemeOptions = ['light', 'dark', 'system', 'amoled'] as const;
export const UnitOptions = ['metric', 'imperial'] as const;
export const MealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
export const BattleStatuses = ['pending', 'active', 'completed', 'cancelled'] as const;
export const NotificationTypes = [
  'like', 'comment', 'friend_request', 'battle_invite', 'battle_update',
  'achievement', 'xp_gained', 'level_up', 'workout_reminder', 'meal_reminder',
  'water_reminder', 'message', 'community', 'system', 'announcement',
] as const;
export const BodyRegions = ['upper_body', 'lower_body', 'core', 'full_body', 'cardio'] as const;

export const WorkoutGoals = ['strength', 'hypertrophy', 'endurance', 'fat_loss', 'general_fitness'] as const;
export const WorkoutCategories = [
  'strength', 'cardio', 'hiit', 'yoga', 'pilates', 'stretching',
  'calisthenics', 'powerlifting', 'crossfit', 'bodyweight', 'mobility',
] as const;
export const MovementTypes = ['compound', 'isolation', 'bodyweight'] as const;
export const ExerciseTypes = ['strength', 'cardio', 'flexibility', 'mobility', 'balance'] as const;
export const FitnessGoals = ['lose_fat', 'gain_muscle', 'maintain', 'improve_cardio', 'strength', 'athletic_performance'] as const;
