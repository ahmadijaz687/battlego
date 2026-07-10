import { Server, Socket } from 'socket.io';
import { prisma } from '../services/database.js';
import type { AuthenticatedSocket } from './index.js';
import { addMessage } from '../services/aiService.js';
import { processUserMessage } from '../services/orchestrator.js';
import type { CoachPersonalityId } from '../services/aiPersonality.js';
import { logger } from '../utils/logger.js';

interface AIStreamRequest {
  conversationId: string;
  content: string;
  personalityId?: CoachPersonalityId;
}

interface AIMessagePayload {
  id?: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

let aiIo: Server | null = null;

function getAiRoom(conversationId: string): string {
  return `ai:conversation:${conversationId}`;
}

export function setupAiNamespace(io: Server): void {
  aiIo = io;
  const aiNamespace = io.of('/ai');

  aiNamespace.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const userId = authSocket.userId!;

    socket.on('ai:subscribe', async (conversationId: string) => {
      try {
        if (!conversationId) {
          socket.emit('ai:error', { message: 'conversationId is required' });
          return;
        }

        const conversation = await prisma.aIConversation.findUnique({
          where: { id: conversationId },
        });

        if (!conversation || conversation.userId !== userId) {
          socket.emit('ai:error', { message: 'Conversation not found or not authorized' });
          return;
        }

        socket.join(getAiRoom(conversationId));
        socket.emit('ai:subscribed', { conversationId });
      } catch (error) {
        logger.error('[AI] Failed to subscribe:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('ai:error', { message: 'Failed to subscribe to conversation' });
      }
    });

    socket.on('ai:unsubscribe', (conversationId: string) => {
      socket.leave(getAiRoom(conversationId));
      socket.emit('ai:unsubscribed', { conversationId });
    });

    socket.on('ai:streamRequest', async (data: AIStreamRequest) => {
      try {
        const conversationId = data.conversationId;
        const content = data.content?.trim();

        if (!conversationId || !content) {
          socket.emit('ai:error', { message: 'conversationId and content are required' });
          return;
        }

        const conversation = await prisma.aIConversation.findUnique({
          where: { id: conversationId },
        });

        if (!conversation || conversation.userId !== userId) {
          socket.emit('ai:error', { message: 'Conversation not found or not authorized' });
          return;
        }

        const userMessage = await addMessage(conversationId, 'user', content);

        const room = getAiRoom(conversationId);
        aiNamespace.to(room).emit('ai:message', {
          id: userMessage.id,
          conversationId,
          role: 'user',
          content,
          timestamp: userMessage.timestamp?.toISOString(),
        });

        aiNamespace.to(room).emit('ai:streamStart', { conversationId });

        const result = await processUserMessage(
          userId,
          content,
          data.personalityId || 'evidence-hypertrophy',
          conversationId,
        );

        const reply = result.message;
        const assistantMessage = await addMessage(conversationId, 'assistant', reply);

        const tokens = reply.split(/(\s+)/);
        for (const token of tokens) {
          if (!token) continue;
          aiNamespace.to(room).emit('ai:token', {
            conversationId,
            token,
            messageId: assistantMessage.id,
          });
        }

        aiNamespace.to(room).emit('ai:streamEnd', {
          id: assistantMessage.id,
          conversationId,
          content: reply,
          timestamp: assistantMessage.timestamp?.toISOString(),
          intent: result.intent,
          suggestions: result.suggestions,
        });

        aiNamespace.to(room).emit('ai:message', {
          id: assistantMessage.id,
          conversationId,
          role: 'assistant',
          content: reply,
          timestamp: assistantMessage.timestamp?.toISOString(),
        });
      } catch (error) {
        logger.error('[AI] Failed to stream reply:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('ai:error', { message: 'Failed to generate AI reply' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`[AI] User ${userId} disconnected`);
    });
  });
}

export function emitAIMessage(conversationId: string, message: AIMessagePayload): void {
  if (!aiIo) return;
  aiIo.of('/ai').to(getAiRoom(conversationId)).emit('ai:message', message);
}
