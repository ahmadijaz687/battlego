export { validate } from '../middlewares/validation.js';

export {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateForgotPassword,
  validateResetPassword,
} from './auth.validator.js';

export {
  createWorkoutSchema,
  updateWorkoutSchema,
  completeSetSchema,
  workoutFiltersSchema,
  validateCreateWorkout,
  validateUpdateWorkout,
  validateCompleteSet,
  validateWorkoutFilters,
} from './workout.validator.js';

export {
  mealSchema,
  updateMealSchema,
  foodEntrySchema,
  waterLogSchema,
  weightLogSchema,
  measurementSchema,
  shoppingItemSchema,
  updateShoppingItemSchema,
  validateMeal,
  validateUpdateMeal,
  validateFoodEntry,
  validateWaterLog,
  validateWeightLog,
  validateMeasurement,
  validateShoppingItem,
  validateUpdateShoppingItem,
} from './nutrition.validator.js';

export {
  postSchema,
  updatePostSchema,
  storySchema,
  messageSchema,
  friendRequestSchema,
  communitySchema,
  joinCommunitySchema,
  validatePost,
  validateUpdatePost,
  validateStory,
  validateMessage,
  validateFriendRequest,
  validateCommunity,
  validateJoinCommunity,
} from './social.validator.js';

export {
  createBattleSchema,
  updateScoreSchema,
  validateCreateBattle,
  validateUpdateScore,
} from './battle.validator.js';

export {
  createChallengeSchema,
  validateCreateChallenge,
} from './challenge.validator.js';

export {
  sleepLogSchema,
  hrvLogSchema,
  moodLogSchema,
  validateSleepLog,
  validateHrvLog,
  validateMoodLog,
} from './health.validator.js';

export {
  createHabitSchema,
  updateHabitSchema,
  habitLogSchema,
  validateCreateHabit,
  validateUpdateHabit,
  validateHabitLog,
} from './habit.validator.js';

export {
  profileSchema,
  settingsSchema,
  profileDetailsSchema,
  onboardingSchema,
  validateProfile,
  validateSettings,
  validateProfileDetails,
  validateOnboarding,
} from './profile.validator.js';

export {
  paginationSchema,
  idParamSchema,
  dateRangeSchema,
  validatePagination,
  validateIdParam,
  validateDateRange,
} from './common.validator.js';
