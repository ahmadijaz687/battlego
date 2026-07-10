import { apiClient, ApiResponse } from './client';

export const workoutsApi = {
  getExercises: () =>
    apiClient.get<ApiResponse>('/workouts/exercises'),

  getTemplates: () =>
    apiClient.get<ApiResponse>('/workouts/templates'),

  getHistory: () =>
    apiClient.get<ApiResponse>('/workouts/history'),

  getRecords: () =>
    apiClient.get<ApiResponse>('/workouts/records'),

  getAnalytics: () =>
    apiClient.get<ApiResponse>('/workouts/analytics'),

  createWorkout: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/workouts', data),

  startWorkout: (workoutId: string) =>
    apiClient.post<ApiResponse>(`/workouts/${workoutId}/start`),

  completeSet: (workoutId: string, setId: string, data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>(`/workouts/${workoutId}/sets/${setId}/complete`, data),

  completeWorkout: (workoutId: string) =>
    apiClient.post<ApiResponse>(`/workouts/${workoutId}/complete`),
};
