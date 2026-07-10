import { apiClient, ApiResponse } from './client';

export const systemApi = {
  getStatus: () =>
    apiClient.get<ApiResponse>('/system/status'),

  getHealth: () =>
    apiClient.get<ApiResponse>('/system/health'),

  getVersion: () =>
    apiClient.get<ApiResponse>('/system/version'),

  getConfig: () =>
    apiClient.get<ApiResponse>('/system/config'),

  getFeatures: () =>
    apiClient.get<ApiResponse>('/system/features'),
};
