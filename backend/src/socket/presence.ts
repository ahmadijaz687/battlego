import { Server, Socket } from 'socket.io';
import { prisma } from '../services/database.js';
import type { AuthenticatedSocket } from './index.js';
import {
  updatePresence,
  removePresence,
  getPresence,
  getOnlineUsers,
  PresenceStatus,
  ActivityType,
} from './realtimePresence.js';
import { logger } from '../utils/logger.js';

interface FriendPresenceEntry {
  userId: string;
  username?: string;
  status: PresenceStatus;
  activity: ActivityType;
  lastSeen: number;
}

export function setupPresenceNamespace(io: Server): void {
  const presenceNamespace = io.of('/presence');

  presenceNamespace.use((socket, next) => {
    next();
  });

  presenceNamespace.on('connection', async (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const userId = authSocket.userId!;

    socket.join(`user:${userId}`);

    await updatePresence(userId, 'online', 'idle', authSocket.username, socket.id);

    presenceNamespace.emit('presence:online', { userId, username: authSocket.username });

    const friendIds = await getFriendIds(userId);
    const friendPresences = await getOnlineUsers(friendIds);

    const friendPresenceList: FriendPresenceEntry[] = [];
    for (const [, presence] of friendPresences) {
      friendPresenceList.push({
        userId: presence.userId,
        username: presence.username,
        status: presence.status,
        activity: presence.activity,
        lastSeen: presence.lastSeen,
      });
    }

    socket.emit('presence:friends', { friends: friendPresenceList });

    socket.on('presence:update', async (data: { status?: PresenceStatus; activity?: ActivityType }) => {
      try {
        const currentStatus = data.status || 'online';
        const currentActivity = data.activity || 'idle';
        await updatePresence(userId, currentStatus, currentActivity, authSocket.username, socket.id);

        for (const friendId of friendIds) {
          presenceNamespace.to(`user:${friendId}`).emit('presence:updated', {
            userId,
            username: authSocket.username,
            status: currentStatus,
            activity: currentActivity,
            lastSeen: Date.now(),
          });
        }
      } catch (error) {
        logger.error('[Presence] Update failed:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('presence:get', async (targetUserId: string) => {
      try {
        const presence = await getPresence(targetUserId);
        if (presence) {
          socket.emit('presence:user', {
            userId: targetUserId,
            status: presence.status,
            activity: presence.activity,
            lastSeen: presence.lastSeen,
          });
        } else {
          socket.emit('presence:user', {
            userId: targetUserId,
            status: 'offline',
            activity: 'idle',
            lastSeen: null,
          });
        }
      } catch (error) {
        logger.error('[Presence] Get failed:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('presence:subscribe', async (targetUserId: string) => {
      socket.join(`presence:watch:${targetUserId}`);
      socket.emit('presence:subscribed', { userId: targetUserId });

      const presence = await getPresence(targetUserId);
      if (presence) {
        socket.emit('presence:updated', {
          userId: targetUserId,
          username: presence.username,
          status: presence.status,
          activity: presence.activity,
          lastSeen: presence.lastSeen,
        });
      }
    });

    socket.on('presence:unsubscribe', (targetUserId: string) => {
      socket.leave(`presence:watch:${targetUserId}`);
      socket.emit('presence:unsubscribed', { userId: targetUserId });
    });

    socket.on('presence:setAway', async () => {
      try {
        await updatePresence(userId, 'away', 'idle', authSocket.username, socket.id);

        for (const friendId of friendIds) {
          presenceNamespace.to(`user:${friendId}`).emit('presence:updated', {
            userId,
            username: authSocket.username,
            status: 'away',
            activity: 'idle',
            lastSeen: Date.now(),
          });
        }
      } catch (error) {
        logger.error('[Presence] Set away failed:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('presence:setBusy', async (activity?: ActivityType) => {
      try {
        await updatePresence(userId, 'busy', activity || 'in_workout', authSocket.username, socket.id);

        for (const friendId of friendIds) {
          presenceNamespace.to(`user:${friendId}`).emit('presence:updated', {
            userId,
            username: authSocket.username,
            status: 'busy',
            activity: activity || 'in_workout',
            lastSeen: Date.now(),
          });
        }
      } catch (error) {
        logger.error('[Presence] Set busy failed:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('disconnect', async () => {
      try {
        const sockets = await presenceNamespace.in(`user:${userId}`).fetchSockets();
        if (sockets.length === 0) {
          await removePresence(userId);

          presenceNamespace.emit('presence:offline', { userId });

          for (const friendId of friendIds) {
            presenceNamespace.to(`user:${friendId}`).emit('presence:updated', {
              userId,
              username: authSocket.username,
              status: 'offline',
              activity: 'idle',
              lastSeen: Date.now(),
            });
          }
        }
      } catch (error) {
        logger.error('[Presence] Disconnect handler failed:', error instanceof Error ? error : new Error(String(error)));
      }

      logger.info(`[Presence] User ${userId} disconnected`);
    });
  });
}

async function getFriendIds(userId: string): Promise<string[]> {
  try {
    const friends = await prisma.friend.findMany({
      where: { userId },
      select: { friendId: true },
    });

    const reverseFriends = await prisma.friend.findMany({
      where: { friendId: userId },
      select: { userId: true },
    });

    const ids = new Set([
      ...friends.map((f) => f.friendId),
      ...reverseFriends.map((f) => f.userId),
    ]);

    return Array.from(ids);
  } catch {
    return [];
  }
}
