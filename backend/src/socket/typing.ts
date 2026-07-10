import { Server, Socket } from 'socket.io';
import type { AuthenticatedSocket } from './index.js';
import { logger } from '../utils/logger.js';

type TypingContext = 'chat' | 'community' | 'battle';

interface TypingStartData {
  context: TypingContext;
  roomId: string;
  conversationId?: string;
}

interface TypingStopData {
  context: TypingContext;
  roomId: string;
}

const RATE_LIMIT_WINDOW = 2000;
const RATE_LIMIT_MAX = 10;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

const TYPING_TIMEOUT = 3000;
const typingTimeouts = new Map<string, NodeJS.Timeout>();

export function setupTypingNamespace(io: Server): void {
  const typingNamespace = io.of('/typing');

  typingNamespace.use((socket, next) => {
    next();
  });

  typingNamespace.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const userId = authSocket.userId!;

    socket.on('typing:start', (data: TypingStartData) => {
      try {
        if (!data.context || !data.roomId) {
          socket.emit('error:message', { message: 'Invalid typing data' });
          return;
        }

        const rateLimitKey = `${userId}:${data.context}:start`;
        if (!checkRateLimit(rateLimitKey)) return;

        const targetRoom = getTargetRoom(data.context, data.roomId);

        socket.to(targetRoom).emit('typing:update', {
          context: data.context,
          roomId: data.roomId,
          userId,
          username: authSocket.username,
          isTyping: true,
          conversationId: data.conversationId,
        });

        const timeoutKey = `${userId}:${data.context}:${data.roomId}`;
        const existing = typingTimeouts.get(timeoutKey);
        if (existing) clearTimeout(existing);

        const timeout = setTimeout(() => {
          socket.to(targetRoom).emit('typing:update', {
            context: data.context,
            roomId: data.roomId,
            userId,
            username: authSocket.username,
            isTyping: false,
            conversationId: data.conversationId,
          });
          typingTimeouts.delete(timeoutKey);
        }, TYPING_TIMEOUT);

        typingTimeouts.set(timeoutKey, timeout);
      } catch (error) {
        logger.error('[Typing] Start failed:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('typing:stop', (data: TypingStopData) => {
      try {
        if (!data.context || !data.roomId) return;

        const rateLimitKey = `${userId}:${data.context}:stop`;
        if (!checkRateLimit(rateLimitKey)) return;

        const targetRoom = getTargetRoom(data.context, data.roomId);

        socket.to(targetRoom).emit('typing:update', {
          context: data.context,
          roomId: data.roomId,
          userId,
          username: authSocket.username,
          isTyping: false,
        });

        const timeoutKey = `${userId}:${data.context}:${data.roomId}`;
        const existing = typingTimeouts.get(timeoutKey);
        if (existing) {
          clearTimeout(existing);
          typingTimeouts.delete(timeoutKey);
        }
      } catch (error) {
        logger.error('[Typing] Stop failed:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('typing:batch', (events: Array<TypingStartData | TypingStopData>) => {
      try {
        if (!Array.isArray(events)) return;

        const rateLimitKey = `${userId}:batch`;
        if (!checkRateLimit(rateLimitKey)) return;

        for (const event of events) {
          if (!event.context || !event.roomId) continue;
          const targetRoom = getTargetRoom(event.context, event.roomId);
          socket.to(targetRoom).emit('typing:update', {
            context: event.context,
            roomId: event.roomId,
            userId,
            username: authSocket.username,
            isTyping: 'conversationId' in event,
          });
        }
      } catch (error) {
        logger.error('[Typing] Batch failed:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('disconnect', () => {
      for (const [key, timeout] of typingTimeouts.entries()) {
        if (key.startsWith(`${userId}:`)) {
          clearTimeout(timeout);
          typingTimeouts.delete(key);
        }
      }
      logger.info(`[Typing] User ${userId} disconnected`);
    });
  });
}

function getTargetRoom(context: TypingContext, roomId: string): string {
  switch (context) {
    case 'chat':
      return `conversation:${roomId}`;
    case 'community':
      return `community:${roomId}`;
    case 'battle':
      return `battle:${roomId}`;
    default:
      return roomId;
  }
}

export function cleanupTypingRateLimits(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

setInterval(cleanupTypingRateLimits, 30000);
