import { apiClient, ApiResponse } from './client';

export const analyticsApi = {
  getWorkoutAnalytics: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse>('/analytics/workouts', { params }),

  getNutritionAnalytics: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse>('/analytics/nutrition', { params }),

  getHealthSummary: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse>('/analytics/health', { params }),

  getBattleStats: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse>('/analytics/battles', { params }),

  getAchievementStats: () =>
    apiClient.get<ApiResponse>('/analytics/achievements'),

  getDashboardSummary: () =>
    apiClient.get<ApiResponse>('/analytics/dashboard'),
};
