import { apiClient, ApiResponse } from './client';

export const battleApi = {
  getBattles: () =>
    apiClient.get<ApiResponse>('/battles'),

  getBattleById: (id: string) =>
    apiClient.get<ApiResponse>(`/battles/${id}`),

  createBattle: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/battles', data),

  acceptBattle: (battleId: string) =>
    apiClient.post<ApiResponse>(`/battles/${battleId}/accept`),

  startBattle: (battleId: string) =>
    apiClient.post<ApiResponse>(`/battles/${battleId}/start`),

  leaveBattle: (battleId: string) =>
    apiClient.post<ApiResponse>(`/battles/${battleId}/leave`),

  updateScore: (battleId: string, score: number) =>
    apiClient.post<ApiResponse>(`/battles/${battleId}/score`, { score }),

  completeBattle: (battleId: string) =>
    apiClient.post<ApiResponse>(`/battles/${battleId}/complete`),

  inviteUser: (battleId: string, receiverId: string) =>
    apiClient.post<ApiResponse>(`/battles/${battleId}/invite`, { receiverId }),

  getLeaderboard: () =>
    apiClient.get<ApiResponse>('/battles/leaderboard'),

  getParticipants: (battleId: string) =>
    apiClient.get<ApiResponse>(`/battles/${battleId}/participants`),

  getProgress: (battleId: string) =>
    apiClient.get<ApiResponse>(`/battles/${battleId}/progress`),

  updateProgress: (battleId: string, currentValue: number) =>
    apiClient.post<ApiResponse>(`/battles/${battleId}/progress`, { currentValue }),

  getHistory: () =>
    apiClient.get<ApiResponse>('/battles/history'),

  getHistoryById: (id: string) =>
    apiClient.get<ApiResponse>(`/battles/history/${id}`),

  getResults: (battleId: string) =>
    apiClient.get<ApiResponse>(`/battles/${battleId}/results`),

  getComments: (battleId: string) =>
    apiClient.get<ApiResponse>(`/battles/${battleId}/comments`),

  createComment: (battleId: string, message: string) =>
    apiClient.post<ApiResponse>(`/battles/${battleId}/comments`, { message }),

  updateComment: (battleId: string, commentId: string, message: string) =>
    apiClient.put<ApiResponse>(`/battles/${battleId}/comments/${commentId}`, { message }),

  deleteComment: (battleId: string, commentId: string) =>
    apiClient.delete<ApiResponse>(`/battles/${battleId}/comments/${commentId}`),

  addReaction: (battleId: string, reaction: string) =>
    apiClient.post<ApiResponse>(`/battles/${battleId}/react`, { reaction }),

  removeReaction: (battleId: string) =>
    apiClient.delete<ApiResponse>(`/battles/${battleId}/react`),
};
