// Re-export all stores for backward compatibility
export { useWorkoutStore } from '../store/workoutStore';
export { useBattleStore } from '../store/battleStore';
export { useNutritionStore } from '../store/nutritionStore';
export { useSocialStore } from '../store/socialStore';
export { useNotificationStore } from '../store/notificationStore';
export { useGamificationStore } from '../store/gamificationStore';
export { useHealthStore } from '../store/healthStore';
export { useHabitStore } from '../store/habitStore';
export { useProfileStore } from '../store/profileStore';
export { useAIStore } from '../store/aiStore';
export { useAuthStore } from '../store/authStore';
export { useSettingsStore } from '../store/settingsStore';

// Legacy hooks that screens may still import
export { useNetworkStatus } from './useNetworkStatus';
export { useLogin, useRegister, useLogout, useCurrentUser } from './useAuth';
