import { create } from 'zustand';
import { Battle, BattleParticipant, BattleProgress, BattleResult, LeaderboardEntry, Season, Challenge } from '../types/battle';
import * as battleService from '../services/battleService';
import { useAuthStore } from './authStore';

interface BattleState {
  battles: Battle[];
  activeBattle: Battle | null;
  currentBattle: Battle | null;
  participants: BattleParticipant[];
  progress: BattleProgress | null;
  leaderboard: LeaderboardEntry[];
  currentSeason: Season | null;
  challenges: Challenge[];
  battleHistory: BattleResult[];
  isLoading: boolean;
  error: string | null;
  setBattles: (battles: Battle[]) => void;
  setActiveBattle: (battle: Battle | null) => void;
  setParticipants: (participants: BattleParticipant[]) => void;
  setProgress: (progress: BattleProgress | null) => void;
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  setCurrentSeason: (season: Season | null) => void;
  setChallenges: (challenges: Challenge[]) => void;
  setBattleHistory: (history: BattleResult[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  joinBattle: (battleId: string) => void;
  leaveBattle: (battleId: string) => void;
  updateProgress: (battleId: string, progress: Partial<BattleProgress>) => void;
  loadBattles: () => void;
  loadActiveBattles: () => void;
  loadLeaderboard: () => void;
  loadBattleDetail: (battleId: string) => void;
  fetchBattles: () => void;
  fetchBattleDetails: (battleId: string) => void;
  acceptBattle: (battleId: string) => void;
  updateBattleScore: (battleId: string, score: number) => void;
}

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

function mapBattleRowToBattle(row: any): Battle {
  return {
    id: row.id,
    uuid: row.id,
    title: row.type || 'Battle',
    description: '',
    creatorId: row.creator_id,
    categoryId: '',
    status: row.status,
    visibility: 'public',
    difficulty: 'intermediate',
    goal: row.battle_mode || '',
    targetValue: row.target ?? 0,
    unit: row.metric || '',
    startDate: row.start_time ?? '',
    endDate: row.end_time ?? '',
    duration: 0,
    maxParticipants: 2,
    currentParticipants: row.opponent_id ? 2 : 1,
    entryFee: 0,
    rewardXP: 0,
    rewardCoins: 0,
    rewardBadge: '',
    winnerId: row.winner_id,
    coverImage: '',
    createdAt: row.created_at,
  };
}

export const useBattleStore = create<BattleState>((set, get) => ({
  battles: [],
  activeBattle: null,
  currentBattle: null,
  participants: [],
  progress: null,
  leaderboard: [],
  currentSeason: null,
  challenges: [],
  battleHistory: [],
  isLoading: false,
  error: null,

  setBattles: (battles) => set({ battles }),
  setActiveBattle: (battle) => set({ activeBattle: battle }),
  setParticipants: (participants) => set({ participants }),
  setProgress: (progress) => set({ progress }),
  setLeaderboard: (entries) => set({ leaderboard: entries }),
  setCurrentSeason: (season) => set({ currentSeason: season }),
  setChallenges: (challenges) => set({ challenges }),
  setBattleHistory: (history) => set({ battleHistory: history }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  joinBattle: (battleId) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      battleService.joinBattle(userId, battleId);
      const { battles } = get();
      set({
        battles: battles.map((b) =>
          b.id === battleId ? { ...b, currentParticipants: b.currentParticipants + 1 } : b
        ),
      });
    } catch (err) {
      set({ error: 'Failed to join battle' });
    }
  },

  leaveBattle: (battleId) => {
    const { battles } = get();
    set({
      battles: battles.map((b) =>
        b.id === battleId ? { ...b, currentParticipants: Math.max(0, b.currentParticipants - 1) } : b
      ),
    });
  },

  updateProgress: (battleId, progressUpdate) => {
    const { progress } = get();
    if (progress && progress.battleId === battleId) {
      set({ progress: { ...progress, ...progressUpdate } });
    }
  },

  loadBattles: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const rows = battleService.getBattles(userId);
      set({ battles: rows.map(mapBattleRowToBattle), isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load battles' });
    }
  },

  loadActiveBattles: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const rows = battleService.getActiveBattles(userId);
      set({ battles: rows.map(mapBattleRowToBattle), isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load active battles' });
    }
  },

  loadLeaderboard: () => {
    try {
      set({ isLoading: true, error: null });
      const entries = battleService.getLeaderboard();
      const mapped: LeaderboardEntry[] = entries.map((e) => ({
        id: e.userId,
        userId: e.userId,
        username: e.name,
        avatar: e.avatar ?? '',
        rank: e.rank,
        xp: e.xp,
        points: e.score,
        wins: 0,
        losses: 0,
        streak: 0,
        level: e.level,
        title: '',
      }));
      set({ leaderboard: mapped, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load leaderboard' });
    }
  },

  loadBattleDetail: (battleId) => {
    try {
      set({ isLoading: true, error: null });
      const detail = battleService.getBattleById(battleId);
      if (detail) {
        set({
          activeBattle: {
            id: detail.id,
            uuid: detail.id,
            title: detail.type || 'Battle',
            description: '',
            creatorId: detail.createdBy,
            categoryId: '',
            status: detail.status,
            visibility: 'public',
            difficulty: 'intermediate',
            goal: detail.mode || '',
            targetValue: detail.target ?? 0,
            unit: '',
            startDate: detail.startDate ?? '',
            endDate: detail.endDate ?? '',
            duration: 0,
            maxParticipants: 2,
            currentParticipants: detail.participants.length,
            entryFee: 0,
            rewardXP: 0,
            rewardCoins: 0,
            rewardBadge: '',
            winnerId: null,
            coverImage: '',
            createdAt: detail.startDate ?? '',
          },
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load battle detail' });
    }
  },

  fetchBattles: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const rows = battleService.getBattles(userId);
      set({ battles: rows.map(mapBattleRowToBattle), isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load battles' });
    }
  },

  fetchBattleDetails: (battleId) => {
    const state = get();
    state.loadBattleDetail(battleId);
  },

  acceptBattle: (battleId) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      battleService.joinBattle(userId, battleId);
      get().fetchBattles();
    } catch (err) {
      set({ error: 'Failed to accept battle' });
    }
  },

  updateBattleScore: (battleId, score) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      battleService.updateBattleProgress(userId, battleId, score);
      get().fetchBattles();
    } catch (err) {
      set({ error: 'Failed to update battle score' });
    }
  },
}));
