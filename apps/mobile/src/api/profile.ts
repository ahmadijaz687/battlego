import { apiClient, ApiResponse } from './client';

export const profileApi = {
  getProfile: () =>
    apiClient.get<ApiResponse>('/profile'),

  updateProfile: (data: Record<string, unknown>) =>
    apiClient.put<ApiResponse>('/profile', data),

  getSettings: () =>
    apiClient.get<ApiResponse>('/profile/settings'),

  updateSettings: (data: Record<string, unknown>) =>
    apiClient.put<ApiResponse>('/profile/settings', data),

  getProfileDetails: () =>
    apiClient.get<ApiResponse>('/profile/details'),

  updateProfileDetails: (data: Record<string, unknown>) =>
    apiClient.put<ApiResponse>('/profile/details', data),

  completeOnboarding: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/profile/onboarding', data),

  getOnboardingStatus: () =>
    apiClient.get<ApiResponse>('/profile/onboarding/status'),
};
