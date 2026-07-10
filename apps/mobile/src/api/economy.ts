import { apiClient, ApiResponse } from './client';

export const economyApi = {
  getCoins: () =>
    apiClient.get<ApiResponse>('/economy/coins'),

  getCoinHistory: (page?: number) =>
    apiClient.get<ApiResponse>('/economy/coins/history', { params: { page } }),

  getTitles: () =>
    apiClient.get<ApiResponse>('/economy/titles'),

  equipTitle: (id: string) =>
    apiClient.post<ApiResponse>(`/economy/titles/${id}/equip`),
};
