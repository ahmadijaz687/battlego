export interface CreateChallengeDTO {
  name: string;
  description: string;
  type: string;
  goal: Record<string, unknown>;
  reward?: Record<string, unknown>;
  startDate: string;
  endDate: string;
}

export interface ChallengeFilters {
  status?: 'active' | 'upcoming' | 'completed';
  type?: string;
  page?: number;
  limit?: number;
}
