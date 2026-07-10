export type {
  RegisterDTO,
  LoginDTO,
  RefreshTokenDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from './auth.dto.js';

export type {
  CreateWorkoutDTO,
  UpdateWorkoutDTO,
  CreateWorkoutSetDTO,
  CompleteWorkoutDTO,
  WorkoutFilters,
} from './workout.dto.js';

export type {
  CreateMealDTO,
  UpdateMealDTO,
  CreateFoodEntryDTO,
  WaterLogDTO,
  WeightLogDTO,
  BodyMeasurementDTO,
  ShoppingListItemDTO,
} from './nutrition.dto.js';

export type {
  CreatePostDTO,
  UpdatePostDTO,
  CreateStoryDTO,
  SendMessageDTO,
  FriendRequestDTO,
  CreateCommunityDTO,
} from './social.dto.js';

export type {
  CreateBattleDTO,
  UpdateBattleScoreDTO,
  BattleFilters,
} from './battle.dto.js';

export type {
  CreateChallengeDTO,
  ChallengeFilters,
} from './challenge.dto.js';

export type { ClaimRewardDTO } from './gamification.dto.js';

export type {
  SleepLogDTO,
  HRVLogDTO,
  MoodLogDTO,
} from './health.dto.js';

export type {
  CreateHabitDTO,
  UpdateHabitDTO,
  HabitLogDTO,
} from './habit.dto.js';

export type {
  UpdateProfileDTO,
  UpdateSettingsDTO,
} from './profile.dto.js';
