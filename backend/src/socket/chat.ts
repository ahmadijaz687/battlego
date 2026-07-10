import { Server, Socket } from 'socket.io';
import { prisma } from '../services/database.js';
import type { AuthenticatedSocket } from './index.js';
import { logger } from '../utils/logger.js';

interface SendMessageData {
  conversationId: string;
  content: string;
  type?: 'text' | 'image' | 'voice';
}

export function setupChatNamespace(io: Server): void {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const userId = authSocket.userId!;

    socket.on('join:conversation', async (conversationId: string) => {
      try {
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { members: true },
        });

        if (!conversation) {
          socket.emit('error:message', { message: 'Conversation not found' });
          return;
        }

        const isMember = conversation.members.some((m) => m.userId === userId);
        if (!isMember) {
          socket.emit('error:message', { message: 'Not a member of this conversation' });
          return;
        }

        socket.join(`conversation:${conversationId}`);
        socket.emit('conversation:joined', { conversationId });

        chatNamespace.to(`conversation:${conversationId}`).emit('user:online', {
          conversationId,
          userId,
        });
      } catch (error) {
        logger.error('[Chat] Failed to join conversation:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to join conversation' });
      }
    });

    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      chatNamespace.to(`conversation:${conversationId}`).emit('user:offline', {
        conversationId,
        userId,
      });
    });

    socket.on('send:message', async (data: SendMessageData) => {
      try {
        if (!data.conversationId || !data.content?.trim()) {
          socket.emit('error:message', { message: 'Invalid message data' });
          return;
        }

        const conversation = await prisma.conversation.findUnique({
          where: { id: data.conversationId },
          include: { members: true },
        });

        if (!conversation) {
          socket.emit('error:message', { message: 'Conversation not found' });
          return;
        }

        const isMember = conversation.members.some((m) => m.userId === userId);
        if (!isMember) {
          socket.emit('error:message', { message: 'Not a member of this conversation' });
          return;
        }

        const msgType = data.type || 'text';

        const saved = await prisma.message.create({
          data: {
            conversationId: data.conversationId,
            senderId: userId,
            senderName: authSocket.username || 'Unknown',
            content: data.content,
            type: msgType as 'text' | 'image' | 'voice',
          },
        });

        await prisma.conversation.update({
          where: { id: data.conversationId },
          data: {
            lastMessage: data.content.substring(0, 200),
            lastMessageAt: new Date(),
          },
        });

        chatNamespace.to(`conversation:${data.conversationId}`).emit('message:new', saved);

        conversation.members
          .filter((m) => m.userId !== userId)
          .forEach((m) => {
            chatNamespace.to(`user:${m.userId}`).emit('message:notification', {
              conversationId: data.conversationId,
              messageId: saved.id,
              senderId: userId,
              senderName: authSocket.username || 'Unknown',
              preview: data.content.substring(0, 100),
            });
          });
      } catch (error) {
        logger.error('[Chat] Failed to send message:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to send message' });
      }
    });

    socket.on('typing:start', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('typing:update', {
        conversationId,
        userId,
        username: authSocket.username,
        isTyping: true,
      });
    });

    socket.on('typing:stop', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('typing:update', {
        conversationId,
        userId,
        username: authSocket.username,
        isTyping: false,
      });
    });

    socket.on('message:read', async (data: { conversationId: string; messageId: string }) => {
      try {
        if (!data.messageId || !data.conversationId) return;

        await prisma.message.update({
          where: { id: data.messageId },
          data: { readAt: new Date() },
        });

        chatNamespace.to(`conversation:${data.conversationId}`).emit('message:readReceipt', {
          conversationId: data.conversationId,
          messageId: data.messageId,
          userId,
          readAt: new Date(),
        });
      } catch (error) {
        logger.error('[Chat] Failed to mark message as read:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('conversation:markRead', async (conversationId: string) => {
      try {
        await prisma.message.updateMany({
          where: {
            conversationId,
            senderId: { not: userId },
            readAt: null,
          },
          data: { readAt: new Date() },
        });

        chatNamespace.to(`conversation:${conversationId}`).emit('conversation:read', {
          conversationId,
          userId,
          readAt: new Date(),
        });
      } catch (error) {
        logger.error('[Chat] Failed to mark conversation as read:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('conversation:list', async () => {
      try {
        const memberEntries = await prisma.conversationMember.findMany({
          where: { userId },
          include: {
            conversation: {
              include: { members: true },
            },
          },
          orderBy: { conversation: { lastMessageAt: 'desc' } },
        });

        const conversations = memberEntries.map((m) => m.conversation);
        socket.emit('conversation:list', { conversations });
      } catch (error) {
        logger.error('[Chat] Failed to fetch conversation list:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to fetch conversations' });
      }
    });

    socket.on('disconnect', () => {
    });
  });
}
