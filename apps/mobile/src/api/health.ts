import { apiClient, ApiResponse } from './client';

export const healthApi = {
  getSleepLogs: (days?: number) =>
    apiClient.get<ApiResponse>('/health/sleep', { params: { days } }),

  logSleep: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/health/sleep', data),

  getHRVLogs: (days?: number) =>
    apiClient.get<ApiResponse>('/health/hrv', { params: { days } }),

  logHRV: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/health/hrv', data),

  getMoodLogs: (days?: number) =>
    apiClient.get<ApiResponse>('/health/mood', { params: { days } }),

  logMood: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/health/mood', data),

  getHealthSummary: () =>
    apiClient.get<ApiResponse>('/health/summary'),
};
