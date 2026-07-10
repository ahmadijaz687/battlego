import { getDatabase, type DB } from '../database';
import {
  generateAIResponse as coachGenerateResponse,
  createConversation as coachCreateConversation,
  getConversations as coachGetConversations,
  deleteConversation as coachDeleteConversation,
  clearConversationMessages as coachClearMessages,
  storeMessage,
  ALL_PERSONALITIES,
  type CoachPersonalityId,
} from './aiCoachService';

function getDb(): DB {
  return getDatabase();
}

export interface LocalAIConversation {
  id: string;
  user_id: string;
  title: string;
  pinned: number;
  created_at: string;
  updated_at: string;
  messages: LocalAIMessage[];
}

export interface LocalAIMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking: number;
  timestamp: string;
}

export interface CoachPersonality {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  avatar: string;
}

export const COACH_PERSONALITIES: CoachPersonality[] = ALL_PERSONALITIES.map((p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  systemPrompt: `You are ${p.name}, a fitness coach for Fitness Battle. ${p.description}.`,
  avatar: p.avatar,
}));

export function getPersonalities(): CoachPersonality[] {
  return COACH_PERSONALITIES;
}

export function getConversations(userId: string): LocalAIConversation[] {
  return coachGetConversations(userId) as LocalAIConversation[];
}

export function getConversation(userId: string, conversationId: string): LocalAIConversation | null {
  const d = getDb();
  const conv = d.getFirstSync<LocalAIConversation>(
    'SELECT * FROM ai_conversations WHERE id = ? AND user_id = ?',
    [conversationId, userId]
  );
  if (!conv) return null;
  const messages = d.getAllSync<LocalAIMessage>(
    'SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY timestamp ASC',
    [conv.id]
  );
  return { ...conv, messages };
}

export function createConversation(userId: string, title?: string): LocalAIConversation {
  const conv = coachCreateConversation(userId, title);
  return { ...conv, messages: [] };
}

export function addMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): LocalAIMessage {
  return storeMessage(conversationId, role, content) as LocalAIMessage;
}

export function deleteConversation(userId: string, conversationId: string): void {
  coachDeleteConversation(userId, conversationId);
}

export function clearMessages(conversationId: string): void {
  coachClearMessages(conversationId);
}

export function generateAIResponse(
  userMessage: string,
  personalityId?: string,
  userId?: string,
  userName?: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
  settings?: { goal?: string; experienceLevel?: string }
): string {
  return coachGenerateResponse(
    userMessage,
    (personalityId as CoachPersonalityId) || 'evidence-hypertrophy',
    userId || 'local-user',
    userName || 'Athlete',
    conversationHistory,
    settings
  );
}
