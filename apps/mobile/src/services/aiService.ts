import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiResponse } from './apiClient';
import type { AIConversation, AIMessage, CoachPersonality, WorkoutRecommendation, NutritionRecommendation, RecoveryAnalysis } from '../types/ai';

export function useAIPersonalities() {
  return useQuery({
    queryKey: ['ai', 'personalities'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<CoachPersonality[]>>('/ai/personalities');
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useAIConversations() {
  return useQuery({
    queryKey: ['ai', 'conversations'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AIConversation[]>>('/ai/conversations');
      return response.data.data || [];
    },
  });
}

export function useAIConversation(conversationId: string) {
  return useQuery({
    queryKey: ['ai', 'conversations', conversationId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AIConversation>>(`/ai/conversations/${conversationId}`);
      return response.data.data;
    },
    enabled: !!conversationId,
  });
}

export function useAICreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title?: string) => {
      const response = await apiClient.post<ApiResponse<AIConversation>>('/ai/conversations', { title: title || 'New Conversation' });
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ai', 'conversations'] }),
  });
}

export function useAIAddMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, role, content }: { conversationId: string; role: 'user' | 'assistant'; content: string }) => {
      const response = await apiClient.post<ApiResponse<AIMessage>>(`/ai/conversations/${conversationId}/messages`, { role, content });
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'conversations', variables.conversationId] });
    },
  });
}

export function useAIChatReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const response = await apiClient.post<ApiResponse<{ userMessage: AIMessage; assistantMessage: AIMessage }>>('/ai/chat', { conversationId, content });
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'conversations', variables.conversationId] });
    },
  });
}

export function useAIDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      await apiClient.delete(`/ai/conversations/${conversationId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ai', 'conversations'] }),
  });
}

export function useGenerateWorkoutPlan() {
  return useMutation({
    mutationFn: async (params: { level?: number; goal?: string; equipment?: string[]; injuries?: string[] }) => {
      const response = await apiClient.post<ApiResponse<WorkoutRecommendation>>('/ai/workout', params);
      return response.data.data;
    },
  });
}

export function useGenerateNutritionPlan() {
  return useMutation({
    mutationFn: async (params: { calories: number; macros?: { protein: number; carbs: number; fat: number } }) => {
      const response = await apiClient.post<ApiResponse<NutritionRecommendation>>('/ai/nutrition', params);
      return response.data.data;
    },
  });
}

export function useGetRecoveryRecommendations() {
  return useMutation({
    mutationFn: async (params: { lastWorkout?: string; sleepHours?: number; stressLevel?: number }) => {
      const response = await apiClient.post<ApiResponse<RecoveryAnalysis>>('/ai/recovery', params);
      return response.data.data;
    },
  });
}

export function useProactiveCoaching() {
  return useQuery({
    queryKey: ['ai', 'proactive'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<unknown>>('/ai/proactive');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
