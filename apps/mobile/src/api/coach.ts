import { apiClient, ApiResponse } from './client';

export const coachApi = {
  getPersonalities: () =>
    apiClient.get<ApiResponse>('/ai/personalities'),

  getConversations: () =>
    apiClient.get<ApiResponse>('/ai/conversations'),

  getConversation: (id: string) =>
    apiClient.get<ApiResponse>(`/ai/conversations/${id}`),

  createConversation: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/ai/conversations', data),

  addMessage: (conversationId: string, data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>(`/ai/conversations/${conversationId}/messages`, data),

  deleteConversation: (id: string) =>
    apiClient.delete<ApiResponse>(`/ai/conversations/${id}`),

  generateWorkoutPlan: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/ai/workout', data),

  getRecoveryRecommendations: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/ai/recovery', data),

  getProactiveCoaching: () =>
    apiClient.get<ApiResponse>('/ai/proactive'),
};
