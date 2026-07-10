import { apiClient, ApiResponse } from './client';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string; user: any }>>('/auth/login', { email, password }),

  register: (email: string, password: string, name: string) =>
    apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string; user: any }>>('/auth/register', { email, password, name }),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken }),

  logout: () => apiClient.post('/auth/logout'),
};
