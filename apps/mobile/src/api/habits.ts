import { apiClient, ApiResponse } from './client';

export const habitsApi = {
  getHabits: () =>
    apiClient.get<ApiResponse>('/habits'),

  getActiveHabits: () =>
    apiClient.get<ApiResponse>('/habits/active'),

  getHabitStats: () =>
    apiClient.get<ApiResponse>('/habits/stats'),

  createHabit: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/habits', data),

  updateHabit: (habitId: string, data: Record<string, unknown>) =>
    apiClient.put<ApiResponse>(`/habits/${habitId}`, data),

  deleteHabit: (habitId: string) =>
    apiClient.delete<ApiResponse>(`/habits/${habitId}`),

  logHabit: (habitId: string, data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>(`/habits/${habitId}/log`, data),

  getHabitLogs: (habitId: string, params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse>(`/habits/${habitId}/logs`, { params }),
};
