export interface CreateBattleDTO {
  type: string;
  opponentId: string;
}

export interface UpdateBattleScoreDTO {
  score: number;
}

export interface BattleFilters {
  status?: 'pending' | 'active' | 'completed';
  page?: number;
  limit?: number;
}
