export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  criteria: Record<string, unknown>;
  isSecret: boolean;
}

export interface UserLevel {
  userId: string;
  level: number;
  xp: number;
  totalXp: number;
  xpToNextLevel: number;
  progress: number;
}

export interface BattlePass {
  id: string;
  seasonId: string;
  seasonName: string;
  tier: number;
  xp: number;
  premium: boolean;
  claimed: string[];
  totalTiers: number;
  xpPerTier: number;
  currentTierProgress: number;
  xpToNextTier: number;
}

export interface Season {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  startDate: string;
  endDate: string;
  rewards?: Record<string, unknown>;
}
