import { apiClient, ApiResponse } from './client';

export const socialApi = {
  getFeed: () =>
    apiClient.get<ApiResponse>('/social/feed'),

  createPost: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/social/posts', data),

  updatePost: (postId: string, data: Record<string, unknown>) =>
    apiClient.put<ApiResponse>(`/social/posts/${postId}`, data),

  deletePost: (postId: string) =>
    apiClient.delete<ApiResponse>(`/social/posts/${postId}`),

  likePost: (postId: string) =>
    apiClient.post<ApiResponse>(`/social/posts/${postId}/like`),

  createComment: (postId: string, data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>(`/social/posts/${postId}/comment`, data),

  getStories: () =>
    apiClient.get<ApiResponse>('/social/stories'),

  createStory: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/social/stories', data),

  getFriends: () =>
    apiClient.get<ApiResponse>('/social/friends'),

  getFriendRequests: () =>
    apiClient.get<ApiResponse>('/social/friend-requests'),

  sendFriendRequest: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/social/friend-requests', data),

  acceptFriendRequest: (requestId: string) =>
    apiClient.put<ApiResponse>(`/social/friend-requests/${requestId}/accept`),

  getMessages: (conversationId: string) =>
    apiClient.get<ApiResponse>(`/social/messages/${conversationId}`),

  sendMessage: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/social/messages', data),

  getCommunities: () =>
    apiClient.get<ApiResponse>('/social/communities'),

  createCommunity: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/social/communities', data),

  joinCommunity: (communityId: string) =>
    apiClient.post<ApiResponse>(`/social/communities/${communityId}/join`),

  getNotifications: () =>
    apiClient.get<ApiResponse>('/social/notifications'),

  markNotificationRead: (id: string) =>
    apiClient.patch<ApiResponse>(`/social/notifications/${id}/read`),
};
