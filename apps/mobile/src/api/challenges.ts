import { apiClient, ApiResponse } from './client';

export const challengesApi = {
  getChallenges: () =>
    apiClient.get<ApiResponse>('/challenges'),

  getActiveChallenges: () =>
    apiClient.get<ApiResponse>('/challenges/active'),

  getMyChallenges: () =>
    apiClient.get<ApiResponse>('/challenges/mine'),

  getChallenge: (challengeId: string) =>
    apiClient.get<ApiResponse>(`/challenges/${challengeId}`),

  getChallengeLeaderboard: (challengeId: string) =>
    apiClient.get<ApiResponse>(`/challenges/${challengeId}/leaderboard`),

  createChallenge: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/challenges', data),

  joinChallenge: (challengeId: string) =>
    apiClient.post<ApiResponse>(`/challenges/${challengeId}/join`),
};
