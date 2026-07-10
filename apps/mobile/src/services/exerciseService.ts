import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiResponse } from './apiClient';

export type Json = unknown;

export interface Exercise {
  id: string;
  name: string;
  category: string;
  primaryMuscle: Json;
  equipment: Json;
  difficulty: string;
  met: number;
  isBodyweight: boolean;
  caloriesPerMin: number | null;
}

export interface GetExercisesParams {
  q?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export function formatJsonField(value: Json): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(', ');
  }
  if (typeof value === 'object') {
    return Object.values(value)
      .map((v) => (typeof v === 'string' ? v : JSON.stringify(v)))
      .join(', ');
  }
  return String(value);
}

export async function getExercises(params: GetExercisesParams = {}): Promise<Exercise[]> {
  const { q, category, limit = 50, offset = 0 } = params;
  const response = await apiClient.get<ApiResponse<Exercise[]>>('/exercises', {
    params: { q, category, limit, offset },
  });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to load exercises');
  }
  return response.data.data;
}

export function useExerciseSearch(params: GetExercisesParams = {}) {
  return useQuery({
    queryKey: ['exercises-search', params],
    queryFn: () => getExercises(params),
    staleTime: 1000 * 60 * 5,
  });
}
