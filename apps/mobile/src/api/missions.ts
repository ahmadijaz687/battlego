import { apiClient, ApiResponse } from './client';

export const missionsApi = {
  getDaily: () =>
    apiClient.get<ApiResponse>('/missions/daily'),

  claimDaily: (id: string) =>
    apiClient.post<ApiResponse>(`/missions/daily/${id}/claim`),

  getWeekly: () =>
    apiClient.get<ApiResponse>('/missions/weekly'),

  claimWeekly: (id: string) =>
    apiClient.post<ApiResponse>(`/missions/weekly/${id}/claim`),

  getMonthly: () =>
    apiClient.get<ApiResponse>('/missions/monthly'),

  claimMonthly: (id: string) =>
    apiClient.post<ApiResponse>(`/missions/monthly/${id}/claim`),
};
