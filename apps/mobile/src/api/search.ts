import { apiClient, ApiResponse } from './client';

export const searchApi = {
  posts: (keyword: string) =>
    apiClient.get<ApiResponse>('/search/posts', { params: { keyword } }),

  users: (keyword: string) =>
    apiClient.get<ApiResponse>('/search/users', { params: { keyword } }),

  workouts: (keyword: string) =>
    apiClient.get<ApiResponse>('/search/workouts', { params: { keyword } }),

  exercises: (keyword: string) =>
    apiClient.get<ApiResponse>('/search/exercises', { params: { keyword } }),

  foods: (keyword: string) =>
    apiClient.get<ApiResponse>('/search/foods', { params: { keyword } }),

  battles: (keyword: string) =>
    apiClient.get<ApiResponse>('/search/battles', { params: { keyword } }),

  messages: (keyword: string) =>
    apiClient.get<ApiResponse>('/search/messages', { params: { keyword } }),

  communities: (keyword: string) =>
    apiClient.get<ApiResponse>('/search/communities', { params: { keyword } }),
};
