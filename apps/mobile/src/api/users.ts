import { apiClient, ApiResponse } from './client';

export const usersApi = {
  search: (keyword: string) =>
    apiClient.get<ApiResponse>('/users/search', { params: { keyword } }),

  getUser: (id: string) =>
    apiClient.get<ApiResponse>(`/users/${id}`),

  getUserProfile: (id: string) =>
    apiClient.get<ApiResponse>(`/users/${id}/profile`),

  getUserStatistics: (id: string) =>
    apiClient.get<ApiResponse>(`/users/${id}/statistics`),

  getUserAchievements: (id: string) =>
    apiClient.get<ApiResponse>(`/users/${id}/achievements`),

  getUserBadges: (id: string) =>
    apiClient.get<ApiResponse>(`/users/${id}/badges`),

  getUserWorkouts: (id: string) =>
    apiClient.get<ApiResponse>(`/users/${id}/workouts`),

  getUserBattles: (id: string) =>
    apiClient.get<ApiResponse>(`/users/${id}/battles`),

  getFollowers: (id: string) =>
    apiClient.get<ApiResponse>(`/users/${id}/followers`),

  getFollowing: (id: string) =>
    apiClient.get<ApiResponse>(`/users/${id}/following`),

  follow: (id: string) =>
    apiClient.post<ApiResponse>(`/users/${id}/follow`),

  unfollow: (id: string) =>
    apiClient.delete<ApiResponse>(`/users/${id}/follow`),

  block: (id: string) =>
    apiClient.post<ApiResponse>(`/users/${id}/block`),

  unblock: (id: string) =>
    apiClient.delete<ApiResponse>(`/users/${id}/block`),

  report: (id: string, reason: string) =>
    apiClient.post<ApiResponse>(`/users/${id}/report`, { reason }),
};
