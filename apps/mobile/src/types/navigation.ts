import { NavigatorScreenParams } from '@react-navigation/native';

// Root tab param list
export type MainTabParamList = {
  HomeTab: undefined;
  WorkoutTab: undefined;
  BattleTab: undefined;
  NutritionTab: undefined;
  SocialTab: undefined;
  AITab: undefined;
  ProfileTab: undefined;
};

// Home stack
export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  Achievements: undefined;
  Leaderboard: undefined;
  Analytics: undefined;
  Calendar: undefined;
  Search: undefined;
};

// Workout stack
export type WorkoutStackParamList = {
  WorkoutHome: undefined;
  WorkoutSession: { workoutId?: string };
  WorkoutTemplates: undefined;
  WorkoutBuilder: undefined;
  CreateWorkout: undefined;
  ExerciseLibrary: { muscleFilter?: string };
  ExerciseDetails: { exerciseId: string };
  PersonalRecords: undefined;
  WorkoutSummary: { workoutId: string };
  WorkoutDetails: { templateId: string };
  WorkoutHistory: undefined;
  WorkoutCategories: undefined;
  CategoryDetails: { categoryId: string };
  WorkoutPrograms: undefined;
  ProgramDetails: { programId: string };
  ProgramWeek: { programId: string; weekId: string };
  ProgramDay: { programId: string; weekId: string; dayId: string };
  WorkoutFavorites: undefined;
  WorkoutSchedules: undefined;
  WorkoutStatistics: undefined;
};

// Battle stack
export type BattleStackParamList = {
  Battle: undefined;
  BattleLobby: undefined;
  BattleSession: undefined;
  Leaderboard: undefined;
  BattlePass: undefined;
  BattleCreate: undefined;
  BattleDetails: { battleId: string };
  DiscoverBattles: undefined;
  BattleHistory: undefined;
  Season: undefined;
  Rewards: undefined;
  BattleProgress: { battleId: string };
  BattleResults: { battleId: string };
};

// Nutrition stack
export type NutritionStackParamList = {
  NutritionDashboard: undefined;
  FoodSearch: undefined;
  FoodDetails: { foodId: string };
  MealCreate: undefined;
  MealDetails: { mealId: string };
  MealHistory: undefined;
  WaterLog: undefined;
  RecipeLibrary: undefined;
  RecipeDetails: { recipeId: string };
  ShoppingList: undefined;
  WeightTracking: undefined;
  BodyMeasurements: undefined;
  SupplementTracker: undefined;
  NutritionGoals: undefined;
  NutritionAnalytics: undefined;
  MacroCalculator: undefined;
  BMICalculator: undefined;
  FavoriteFoods: undefined;
  FavoriteRecipes: undefined;
  MealPlanner: undefined;
};

// Social stack
export type SocialStackParamList = {
  Social: undefined;
  Stories: undefined;
  Friends: undefined;
  Messages: undefined;
  Communities: undefined;
  Notifications: undefined;
  Chat: { conversationId: string };
  CommunityDetails: { communityId: string };
  CreatePost: undefined;
  PostDetails: { postId: string };
  ActivityFeed: undefined;
  Trending: undefined;
};

// AI stack
export type AIStackParamList = {
  AI: undefined;
  AIChat: undefined;
  AIWorkoutGenerator: undefined;
  AINutritionPlanner: undefined;
  AISettings: undefined;
  AIBodyAnalysis: undefined;
  AIFoodAnalysis: undefined;
  AIProgressAnalysis: undefined;
  AIHistory: undefined;
  AIGoalPlanner: undefined;
};

// Profile stack
export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  SettingsAccount: undefined;
  SettingsTheme: undefined;
  SettingsLanguage: undefined;
  SettingsNotifications: undefined;
  SettingsPrivacy: undefined;
  SettingsSecurity: undefined;
  SettingsUnits: undefined;
  SettingsBackup: undefined;
  SettingsExport: undefined;
  SettingsAbout: undefined;
  SettingsSupport: undefined;
  EditProfile: undefined;
  Badges: undefined;
  Statistics: undefined;
  ProgressPhotos: undefined;
  SavedPosts: undefined;
  Following: { userId: string };
  Followers: { userId: string };
  Sleep: undefined;
  HRV: undefined;
  Mood: undefined;
  HealthIntegrations: undefined;
  Achievements: undefined;
  BattlePass: undefined;
  HealthSync: undefined;
};

// Auth stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  Onboarding: undefined;
};

// Admin stack
export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminUsers: undefined;
  AdminWorkouts: undefined;
  AdminExercises: undefined;
  AdminFoods: undefined;
  AdminBattles: undefined;
  AdminReports: undefined;
  AdminLogs: undefined;
  Calendar: undefined;
  Search: undefined;
};

// Union of all screen names across all stacks (for cross-stack navigation)
export type AllScreenNames = keyof HomeStackParamList | keyof WorkoutStackParamList | keyof BattleStackParamList | keyof NutritionStackParamList | keyof SocialStackParamList | keyof AIStackParamList | keyof ProfileStackParamList | keyof AuthStackParamList | keyof AdminStackParamList;

// Root stack (top-level)
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Onboarding: undefined;
  Admin: NavigatorScreenParams<AdminStackParamList>;
  // Flat screen names for cross-stack navigation (used by screens calling navigate() directly)
  Home: undefined;
  Notifications: undefined;
  Achievements: undefined;
  Leaderboard: undefined;
  Analytics: undefined;
  WorkoutHome: undefined;
  WorkoutSession: { workoutId?: string };
  WorkoutTemplates: undefined;
  WorkoutBuilder: undefined;
  CreateWorkout: undefined;
  ExerciseLibrary: { muscleFilter?: string };
  ExerciseDetails: { exerciseId: string };
  PersonalRecords: undefined;
  WorkoutSummary: { workoutId: string };
  WorkoutDetails: { templateId: string };
  WorkoutHistory: undefined;
  WorkoutCategories: undefined;
  CategoryDetails: { categoryId: string };
  WorkoutPrograms: undefined;
  ProgramDetails: { programId: string };
  ProgramWeek: { programId: string; weekId: string };
  ProgramDay: { programId: string; weekId: string; dayId: string };
  WorkoutFavorites: undefined;
  WorkoutSchedules: undefined;
  WorkoutStatistics: undefined;
  Battle: undefined;
  BattleLobby: undefined;
  BattleSession: undefined;
  BattlePass: undefined;
  BattleCreate: undefined;
  BattleDetails: { battleId: string };
  DiscoverBattles: undefined;
  BattleHistory: undefined;
  Season: undefined;
  Rewards: undefined;
  BattleProgress: { battleId: string };
  BattleResults: { battleId: string };
  NutritionDashboard: undefined;
  FoodSearch: undefined;
  FoodDetails: { foodId: string };
  MealCreate: undefined;
  MealDetails: { mealId: string };
  MealHistory: undefined;
  WaterLog: undefined;
  RecipeLibrary: undefined;
  RecipeDetails: { recipeId: string };
  ShoppingList: undefined;
  WeightTracking: undefined;
  BodyMeasurements: undefined;
  SupplementTracker: undefined;
  NutritionGoals: undefined;
  NutritionAnalytics: undefined;
  MacroCalculator: undefined;
  BMICalculator: undefined;
  FavoriteFoods: undefined;
  FavoriteRecipes: undefined;
  MealPlanner: undefined;
  Social: undefined;
  Stories: undefined;
  Friends: undefined;
  Messages: undefined;
  Communities: undefined;
  Chat: { conversationId: string };
  CommunityDetails: { communityId: string };
  CreatePost: undefined;
  PostDetails: { postId: string };
  ActivityFeed: undefined;
  Trending: undefined;
  AI: undefined;
  AIChat: undefined;
  AIWorkoutGenerator: undefined;
  AINutritionPlanner: undefined;
  AISettings: undefined;
  AIBodyAnalysis: undefined;
  AIFoodAnalysis: undefined;
  AIProgressAnalysis: undefined;
  AIHistory: undefined;
  AIGoalPlanner: undefined;
  Profile: undefined;
  Settings: undefined;
  SettingsAccount: undefined;
  SettingsTheme: undefined;
  SettingsLanguage: undefined;
  SettingsNotifications: undefined;
  SettingsPrivacy: undefined;
  SettingsSecurity: undefined;
  SettingsUnits: undefined;
  SettingsBackup: undefined;
  SettingsExport: undefined;
  SettingsAbout: undefined;
  SettingsSupport: undefined;
  EditProfile: undefined;
  Badges: undefined;
  Statistics: undefined;
  ProgressPhotos: undefined;
  SavedPosts: undefined;
  Following: { userId: string };
  Followers: { userId: string };
  Sleep: undefined;
  HRV: undefined;
  Mood: undefined;
  HealthIntegrations: undefined;
  HealthSync: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  AdminDashboard: undefined;
  AdminUsers: undefined;
  AdminWorkouts: undefined;
  AdminExercises: undefined;
  AdminFoods: undefined;
  AdminBattles: undefined;
  AdminReports: undefined;
  AdminLogs: undefined;
  Calendar: undefined;
  Search: undefined;
};
