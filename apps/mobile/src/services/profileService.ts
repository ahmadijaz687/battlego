import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiResponse } from './apiClient';

export interface UserProfile {
  id: string;
  userId: string;
  bio: string | null;
  dateOfBirth: string | null;
  height: number | null;
  heightUnit: string;
  goal: string | null;
  experience: string;
  fitnessLevel: string;
  activityLevel: string;
  equipment: string[];
  injuries: string[];
  preferences: Record<string, unknown>;
  onboardingComplete: boolean;
}

export interface OnboardingStatus {
  onboardingComplete: boolean;
}

export function useProfileDetails() {
  return useQuery({
    queryKey: ['profile', 'details'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<UserProfile>>('/profile/details');
      return response.data.data;
    },
  });
}

export function useUpdateProfileDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await apiClient.put<ApiResponse<UserProfile>>('/profile/details', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'details'] });
    },
  });
}

export function useOnboardingStatus() {
  return useQuery({
    queryKey: ['profile', 'onboarding'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<OnboardingStatus>>('/profile/onboarding/status');
      return response.data.data;
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      goal: string;
      experience: string;
      fitnessLevel: string;
      activityLevel: string;
      equipment: string[];
      injuries: string[];
    }) => {
      const response = await apiClient.post<ApiResponse<UserProfile>>('/profile/onboarding', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
