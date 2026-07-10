import { apiClient, ApiResponse } from './client';

export const gamificationApi = {
  getAchievements: () =>
    apiClient.get<ApiResponse>('/gamification/achievements'),

  getMyAchievements: () =>
    apiClient.get<ApiResponse>('/gamification/achievements/mine'),

  unlockAchievement: (name: string) =>
    apiClient.post<ApiResponse>(`/gamification/achievements/${name}/unlock`),

  getLevel: () =>
    apiClient.get<ApiResponse>('/gamification/level'),

  getLeaderboard: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse>('/gamification/leaderboard', { params }),

  getActiveSeason: () =>
    apiClient.get<ApiResponse>('/gamification/seasons/active'),

  getSeasons: () =>
    apiClient.get<ApiResponse>('/gamification/seasons'),

  getBattlePass: () =>
    apiClient.get<ApiResponse>('/gamification/battle-pass'),

  claimBattlePassReward: () =>
    apiClient.post<ApiResponse>('/gamification/battle-pass/claim'),

  upgradeBattlePass: () =>
    apiClient.post<ApiResponse>('/gamification/battle-pass/upgrade'),
};
