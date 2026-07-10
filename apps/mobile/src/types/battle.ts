export interface Battle {
  id: string;
  uuid: string;
  title: string;
  description: string;
  creatorId: string;
  categoryId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  visibility: 'public' | 'private' | 'friends';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  rewardXP: number;
  rewardCoins: number;
  rewardBadge: string;
  winnerId: string | null;
  coverImage: string;
  createdAt: string;
}

export interface BattleParticipant {
  id: string;
  battleId: string;
  userId: string;
  username: string;
  avatar: string;
  joinedAt: string;
  status: 'ready' | 'active' | 'completed' | 'disconnected';
  progress: number;
  score: number;
  rank: number;
  xpEarned: number;
  coinsEarned: number;
}

export interface BattleProgress {
  battleId: string;
  userId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
  lastUpdated: string;
}

export interface BattleResult {
  id: string;
  battleId: string;
  winnerId: string;
  runnerUpId: string;
  thirdPlaceId: string;
  completedAt: string;
  totalParticipants: number;
  averageScore: number;
  rewards: {
    xp: number;
    coins: number;
    badge: string;
    title: string;
  };
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  rank: number;
  xp: number;
  points: number;
  wins: number;
  losses: number;
  streak: number;
  level: number;
  title: string;
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  theme: string;
  status: 'upcoming' | 'active' | 'ended';
  coverImage: string;
  rewardPool: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  target: number;
  unit: string;
  xpReward: number;
  coinReward: number;
  progress: number;
  completed: boolean;
  startDate: string;
  endDate: string;
  isDaily: boolean;
  isWeekly: boolean;
  isMonthly: boolean;
}

export interface BattleInvite {
  id: string;
  battleId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
}

export interface BattleComment {
  id: string;
  battleId: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  likes: number;
  createdAt: string;
}

export interface SeasonReward {
  id: string;
  seasonId: string;
  rank: number;
  xp: number;
  coins: number;
  badge: string;
  title: string;
  exclusiveReward: string;
}

export interface BattleDetailParticipant {
  user: { id: string; name: string; avatar?: string | null };
  progressValue: number;
  isWinner: boolean;
  joinedAt: string;
}

export interface BattleStanding {
  userId: string;
  name: string;
  progressValue: number;
  rank: number;
  isWinner: boolean;
}

export interface BattleDetail {
  id: string;
  title?: string;
  description?: string;
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
  goal?: string;
  targetValue?: number;
  unit?: string;
  startDate?: string;
  endDate?: string;
  inviteCode?: string;
  participants: BattleDetailParticipant[];
  standings: BattleStanding[];
}
