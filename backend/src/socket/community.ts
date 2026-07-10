import { Server, Socket } from 'socket.io';
import { prisma } from '../services/database.js';
import type { AuthenticatedSocket } from './index.js';
import { logger } from '../utils/logger.js';

interface ChatMessageData {
  roomId: string;
  content: string;
}

interface PostData {
  roomId: string;
  postId: string;
  action: 'created' | 'updated' | 'deleted' | 'liked' | 'unliked';
  data?: Record<string, unknown>;
}

interface StoryData {
  storyId: string;
  action: 'created' | 'viewed' | 'expired' | 'deleted';
  data?: Record<string, unknown>;
}

interface ModerationData {
  roomId: string;
  action: 'user:muted' | 'user:banned' | 'message:deleted' | 'user:promoted' | 'user:demoted';
  targetUserId: string;
  reason?: string;
}

interface CommunityRoom {
  id: string;
  name: string;
  description?: string;
  isPrivate?: boolean;
  memberCount?: number;
}

export function setupCommunityNamespace(io: Server): void {
  const communityNamespace = io.of('/community');

  communityNamespace.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const userId = authSocket.userId!;

    socket.on('community:join', async (roomId: string) => {
      try {
        const community = await prisma.community.findUnique({ where: { id: roomId } });
        if (!community) {
          socket.emit('error:message', { message: 'Community room not found' });
          return;
        }

        if (community.isPrivate) {
          const member = await prisma.communityMember.findUnique({
            where: { communityId_userId: { communityId: roomId, userId } },
          });
          if (!member) {
            socket.emit('error:message', { message: 'Not a member of this private community' });
            return;
          }
        }

        socket.join(`community:${roomId}`);

        const socketsInRoom = await communityNamespace.in(`community:${roomId}`).fetchSockets();
        communityNamespace.to(`community:${roomId}`).emit('community:memberCount', {
          roomId,
          count: socketsInRoom.length,
        });

        communityNamespace.to(`community:${roomId}`).emit('community:userJoined', {
          roomId,
          userId,
          username: authSocket.username,
        });

        socket.emit('community:joined', { roomId });
      } catch (error) {
        logger.error('[Community] Failed to join room:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to join community room' });
      }
    });

    socket.on('community:leave', (roomId: string) => {
      socket.leave(`community:${roomId}`);
      communityNamespace.to(`community:${roomId}`).emit('community:userLeft', {
        roomId,
        userId,
        username: authSocket.username,
      });
    });

    socket.on('community:message', async (data: ChatMessageData) => {
      try {
        if (!data.roomId || !data.content?.trim()) {
          socket.emit('error:message', { message: 'Invalid message data' });
          return;
        }

        communityNamespace.to(`community:${data.roomId}`).emit('community:message', {
          id: `${userId}-${Date.now()}`,
          roomId: data.roomId,
          userId,
          username: authSocket.username,
          content: data.content,
          createdAt: new Date(),
        });
      } catch (error) {
        logger.error('[Community] Failed to send message:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to send message' });
      }
    });

    socket.on('community:typing:start', (roomId: string) => {
      socket.to(`community:${roomId}`).emit('community:typing', {
        roomId,
        userId,
        username: authSocket.username,
        isTyping: true,
      });
    });

    socket.on('community:typing:stop', (roomId: string) => {
      socket.to(`community:${roomId}`).emit('community:typing', {
        roomId,
        userId,
        username: authSocket.username,
        isTyping: false,
      });
    });

    socket.on('community:post', async (data: PostData) => {
      try {
        if (!data.roomId || !data.postId) return;

        communityNamespace.to(`community:${data.roomId}`).emit('community:postUpdate', {
          roomId: data.roomId,
          postId: data.postId,
          userId,
          action: data.action,
          data: data.data,
          timestamp: new Date(),
        });
      } catch (error) {
        logger.error('[Community] Post update failed:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('community:story', async (data: StoryData) => {
      try {
        communityNamespace.emit('community:storyUpdate', {
          storyId: data.storyId,
          userId,
          action: data.action,
          username: authSocket.username,
          data: data.data,
          timestamp: new Date(),
        });
      } catch (error) {
        logger.error('[Community] Story update failed:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('community:rooms', async () => {
      try {
        const communities = await prisma.community.findMany({
          where: { isPrivate: false },
        });

        const roomsWithCount: CommunityRoom[] = [];
        for (const c of communities) {
          const socketsInRoom = await communityNamespace.in(`community:${c.id}`).fetchSockets();
          roomsWithCount.push({
            id: c.id,
            name: c.name,
            description: c.description,
            isPrivate: c.isPrivate,
            memberCount: socketsInRoom.length,
          });
        }

        socket.emit('community:rooms', { rooms: roomsWithCount });
      } catch (error) {
        logger.error('[Community] Failed to list rooms:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to list community rooms' });
      }
    });

    socket.on('community:moderation', async (data: ModerationData) => {
      try {
        if (!data.roomId || !data.action || !data.targetUserId) return;

        communityNamespace.to(`community:${data.roomId}`).emit('community:moderation', {
          roomId: data.roomId,
          action: data.action,
          targetUserId: data.targetUserId,
          reason: data.reason,
          moderatorId: userId,
          timestamp: new Date(),
        });

        if (data.targetUserId !== userId) {
          communityNamespace.to(`user:${data.targetUserId}`).emit('community:moderation:notified', {
            roomId: data.roomId,
            action: data.action,
            reason: data.reason,
            moderatorId: userId,
          });
        }
      } catch (error) {
        logger.error('[Community] Moderation failed:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('disconnect', () => {
    });
  });
}
