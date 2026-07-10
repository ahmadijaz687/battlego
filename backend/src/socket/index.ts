import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';
import { setupChatNamespace } from './chat.js';
import { setupBattleNamespace } from './battle.js';
import { setupWorkoutNamespace } from './workout.js';
import { setupNotificationNamespace } from './notifications.js';
import { setupLeaderboardNamespace } from './leaderboard.js';
import { setupPresenceNamespace } from './presence.js';
import { setupCommunityNamespace } from './community.js';
import { setupTypingNamespace } from './typing.js';
import { setupAiNamespace } from './ai.js';
import { updatePresence, removePresence } from './realtimePresence.js';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

let io: Server;

export function initializeSocket(server: HttpServer): Server {
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:8081', 'http://localhost:3000'];
  if (corsOrigins.includes('*')) {
    throw new Error('CORS_ORIGIN must not be "*" in production. Set explicit origins.');
  }

  io = new Server(server, {
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
    maxHttpBufferSize: 1e6,
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return next(new Error('JWT_SECRET is not configured'));
      }
      const decoded = jwt.verify(token as string, secret) as { id: string; email: string };
      (socket as AuthenticatedSocket).userId = decoded.id;
      (socket as AuthenticatedSocket).username = decoded.email.split('@')[0];
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const userId = authSocket.userId!;

    socket.join(`user:${userId}`);

    await updatePresence(userId, 'online', 'idle', authSocket.username, socket.id);

    socket.on('disconnect', async () => {
      try {
        const sockets = await io.in(`user:${userId}`).fetchSockets();
        if (sockets.length === 0) {
          await removePresence(userId);
        } else {
          await updatePresence(userId, 'online');
        }
      } catch {
        await updatePresence(userId, 'offline');
      }
    });

    socket.on('error', (error: Error) => {
      logger.error(`[Socket] Error for user ${userId}`, error);
    });
  });

  setupChatNamespace(io);
  setupBattleNamespace(io);
  setupWorkoutNamespace(io);
  setupNotificationNamespace(io);
  setupLeaderboardNamespace(io);
  setupPresenceNamespace(io);
  setupCommunityNamespace(io);
  setupTypingNamespace(io);
  setupAiNamespace(io);

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export const setupSocketIO = initializeSocket;

export { emitAIMessage } from './ai.js';
export { emitLeaderboardEntryUpdated } from './leaderboard.js';
export { emitBattleScoreUpdated } from './battle.js';
