export interface BattleData {
  id: string;
  type: '1v1' | 'team' | 'tournament';
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  participants: BattleParticipantStats[];
  rounds: BattleRound[];
  startDate: string;
  endDate?: string;
  winner?: string;
  rules: Record<string, unknown>;
  stake?: number;
  createdAt: string;
}

export interface BattleRound {
  id: string;
  roundNumber: number;
  metric: string;
  scores: Record<string, number>;
  winner?: string;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface BattleParticipantStats {
  userId: string;
  userName: string;
  userAvatar: string | null;
  score: number;
  wins: number;
  streaks: number;
  metrics: Record<string, number>;
  joinedAt: string;
}
