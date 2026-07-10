import { create } from 'zustand';
import type { WorkoutRecommendation, NutritionRecommendation, RecoveryAnalysis, CoachPersonality } from '../types/ai';
import * as aiLocal from '../services/aiLocalService';
import { useAuthStore } from './authStore';

interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  thinking: boolean;
  timestamp: string;
}

interface AIConversation {
  id: string;
  title: string;
  pinned: boolean;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

interface AISettings {
  goal: string;
  trainingStyle: string;
  experienceLevel: string;
  units: string;
  language: string;
  responseLength: string;
  notifications: {
    workout: boolean;
    nutrition: boolean;
    hydration: boolean;
    recovery: boolean;
    motivation: boolean;
  };
}

interface AIState {
  conversations: AIConversation[];
  activeConversationId: string | null;
  settings: AISettings;
  personalities: CoachPersonality[];
  activePersonality: CoachPersonality | null;
  dailyRecommendation: WorkoutRecommendation | null;
  nutritionPlan: NutritionRecommendation | null;
  recoveryAnalysis: RecoveryAnalysis | null;
  isTyping: boolean;
  isLoadingPersonalities: boolean;
  error: string | null;
  setPersonality: (personality: CoachPersonality) => void;
  addMessage: (conversationId: string, message: AIMessage) => void;
  setActiveConversation: (id: string) => void;
  updateSettings: (settings: Partial<AISettings>) => void;
  setDailyRecommendation: (workout: WorkoutRecommendation) => void;
  setNutritionPlan: (plan: NutritionRecommendation) => void;
  setRecoveryAnalysis: (analysis: RecoveryAnalysis) => void;
  setPersonalities: (personalities: CoachPersonality[]) => void;
  setIsTyping: (isTyping: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: (conversationId: string) => void;
  fetchPersonalities: () => void;
  loadConversations: () => void;
  createConversation: (title?: string) => string | null;
  sendMessage: (content: string) => void;
  generateWorkout: (params: { type: string; duration: number }) => void;
  generateNutrition: (calories: number, macros: { protein: number; carbs: number; fat: number }) => void;
}

function mapToLocalConversation(c: aiLocal.LocalAIConversation): AIConversation {
  return {
    id: c.id,
    title: c.title,
    pinned: c.pinned === 1,
    messages: c.messages.map((m) => ({
      id: m.id,
      conversationId: m.conversation_id,
      role: m.role,
      content: m.content,
      thinking: m.thinking === 1,
      timestamp: m.timestamp,
    })),
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

export const useAIStore = create<AIState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  personalities: [],
  activePersonality: null,
  settings: {
    goal: 'general_fitness',
    trainingStyle: 'gym',
    experienceLevel: 'intermediate',
    units: 'imperial',
    language: 'en',
    responseLength: 'normal',
    notifications: {
      workout: true,
      nutrition: true,
      hydration: false,
      recovery: true,
      motivation: true,
    },
  },
  dailyRecommendation: null,
  nutritionPlan: null,
  recoveryAnalysis: null,
  isTyping: false,
  isLoadingPersonalities: false,
  error: null,

  setPersonality: (personality) => {
    set({ activePersonality: personality });
  },

  addMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      ),
    }));
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  updateSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings },
  })),

  setDailyRecommendation: (workout) => set({ dailyRecommendation: workout }),

  setNutritionPlan: (plan) => set({ nutritionPlan: plan }),

  setRecoveryAnalysis: (analysis) => set({ recoveryAnalysis: analysis }),

  setPersonalities: (personalities) => {
    set({ personalities });
    if (!get().activePersonality && personalities.length > 0) {
      set({ activePersonality: personalities[0] });
    }
  },

  setIsTyping: (isTyping) => set({ isTyping }),

  setError: (error) => set({ error }),

  clearMessages: (conversationId) => {
    try {
      aiLocal.clearMessages(conversationId);
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, messages: [] }
            : conv
        ),
      }));
    } catch (err) {
      set({ error: 'Failed to clear messages' });
    }
  },

  fetchPersonalities: () => {
    try {
      const personalities = aiLocal.getPersonalities();
      set({ personalities });
      if (!get().activePersonality && personalities.length > 0) {
        set({ activePersonality: personalities[0] });
      }
    } catch (err) {
      set({ error: 'Failed to load personalities' });
    }
  },

  loadConversations: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const convs = aiLocal.getConversations(userId);
      set({ conversations: convs.map(mapToLocalConversation) });
    } catch (err) {
      set({ error: 'Failed to load conversations' });
    }
  },

  createConversation: (title) => {
    const userId = getUserId();
    if (!userId) return null;
    try {
      const conv = aiLocal.createConversation(userId, title);
      const mapped = mapToLocalConversation(conv);
      set((state) => ({
        conversations: [mapped, ...state.conversations],
        activeConversationId: mapped.id,
      }));
      return mapped.id;
    } catch (err) {
      set({ error: 'Failed to create conversation' });
      return null;
    }
  },

  sendMessage: (content) => {
    const { activeConversationId, activePersonality, settings } = get();
    if (!activeConversationId) return;
    set({ isTyping: true, error: null });
    try {
      const userMsg = aiLocal.addMessage(activeConversationId, 'user', content);

      const assistantContent = aiLocal.generateAIResponse(
        content,
        activePersonality?.id,
        undefined,
        undefined,
        undefined,
        { goal: settings.goal, experienceLevel: settings.experienceLevel }
      );
      const assistantMsg = aiLocal.addMessage(activeConversationId, 'assistant', assistantContent);

      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  {
                    id: userMsg.id,
                    conversationId: userMsg.conversation_id,
                    role: userMsg.role,
                    content: userMsg.content,
                    thinking: userMsg.thinking === 1,
                    timestamp: userMsg.timestamp,
                  },
                  {
                    id: assistantMsg.id,
                    conversationId: assistantMsg.conversation_id,
                    role: assistantMsg.role,
                    content: assistantMsg.content,
                    thinking: assistantMsg.thinking === 1,
                    timestamp: assistantMsg.timestamp,
                  },
                ],
              }
            : conv
        ),
        isTyping: false,
      }));
    } catch {
      set({ isTyping: false, error: 'Failed to send message' });
    }
  },

  generateWorkout: (params) => {
    set({ error: null });
    try {
      const recommendation = {
        id: Date.now().toString(),
        name: `${params.type} Workout`,
        type: params.type,
        duration: params.duration,
        exercises: [],
        calories: 0,
        difficulty: 'intermediate' as const,
        equipment: [],
      } as WorkoutRecommendation;
      set({ dailyRecommendation: recommendation });
    } catch {
      set({ error: 'Failed to generate workout' });
    }
  },

  generateNutrition: (calories, macros) => {
    set({ error: null });
    try {
      const plan = {
        meals: [],
        dailyCalories: calories,
        macros,
      } as NutritionRecommendation;
      set({ nutritionPlan: plan });
    } catch {
      set({ error: 'Failed to generate nutrition plan' });
    }
  },
}));
