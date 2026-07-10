import { apiClient, ApiResponse } from './client';

export const seasonsApi = {
  getSeasons: () =>
    apiClient.get<ApiResponse>('/seasons'),

  getCurrentSeason: () =>
    apiClient.get<ApiResponse>('/seasons/current'),

  getSeasonById: (id: string) =>
    apiClient.get<ApiResponse>(`/seasons/${id}`),

  getSeasonProgress: () =>
    apiClient.get<ApiResponse>('/seasons/current/progress'),

  getSeasonRewards: () =>
    apiClient.get<ApiResponse>('/seasons/current/rewards'),

  claimReward: () =>
    apiClient.post<ApiResponse>('/seasons/current/rewards/claim'),
};
