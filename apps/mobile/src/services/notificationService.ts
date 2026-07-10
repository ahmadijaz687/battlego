import { apiClient, ApiResponse } from './apiClient';

export type PushPlatform = 'ios' | 'android' | 'web';

export async function registerPushToken(token: string, platform: PushPlatform): Promise<void> {
  const response = await apiClient.post<ApiResponse<void>>('/users/push-token', { token, platform });
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to register push token');
  }
}
