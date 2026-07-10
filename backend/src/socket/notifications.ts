import { Server, Socket } from 'socket.io';
import { prisma } from '../services/database.js';
import type { AuthenticatedSocket } from './index.js';
import { logger } from '../utils/logger.js';

interface SendNotificationData {
  toUserId: string;
  type: string;
  title: string;
  content: string;
  relatedId?: string;
}

interface NotificationPreferences {
  push?: boolean;
  email?: boolean;
  sms?: boolean;
}

export function setupNotificationNamespace(io: Server): void {
  const notificationNamespace = io.of('/notifications');

  notificationNamespace.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const userId = authSocket.userId!;

    socket.join(`user:${userId}`);

    socket.emit('notifications:connected', { userId });

    socket.on('notifications:list', async (data?: { unreadOnly?: boolean; skip?: number; take?: number }) => {
      try {
        const where: Record<string, unknown> = { userId };
        if (data?.unreadOnly) where.read = false;

        const [notifications, unreadCount] = await Promise.all([
          prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: data?.skip || 0,
            take: data?.take || 50,
          }),
          prisma.notification.count({
            where: { userId, read: false },
          }),
        ]);

        socket.emit('notifications:list', { notifications, unreadCount });
      } catch (error) {
        logger.error('[Notifications] Failed to list:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to fetch notifications' });
      }
    });

    socket.on('notification:read', async (notificationId: string) => {
      try {
        if (!notificationId) return;

        const notification = await prisma.notification.findUnique({
          where: { id: notificationId },
        });

        if (!notification || notification.userId !== userId) {
          socket.emit('error:message', { message: 'Notification not found' });
          return;
        }

        await prisma.notification.update({
          where: { id: notificationId },
          data: { read: true },
        });

        socket.emit('notification:read', { notificationId });

        const unreadCount = await prisma.notification.count({
          where: { userId, read: false },
        });

        notificationNamespace.to(`user:${userId}`).emit('notifications:unreadCount', {
          userId,
          unreadCount,
        });
      } catch (error) {
        logger.error('[Notifications] Failed to mark read:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('notifications:markAllRead', async () => {
      try {
        await prisma.notification.updateMany({
          where: { userId, read: false },
          data: { read: true },
        });

        socket.emit('notifications:allRead');
        notificationNamespace.to(`user:${userId}`).emit('notifications:unreadCount', {
          userId,
          unreadCount: 0,
        });
      } catch (error) {
        logger.error('[Notifications] Failed to mark all read:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('notifications:send', async (data: SendNotificationData) => {
      try {
        if (!data.toUserId || !data.title || !data.content) {
          socket.emit('error:message', { message: 'Invalid notification data' });
          return;
        }

        const notificationType = data.type as 'like' | 'comment' | 'friend_request' | 'battle_invite' | 'community' | 'story_reaction' | 'message';

        const notification = await prisma.notification.create({
          data: {
            userId: data.toUserId,
            type: notificationType,
            title: data.title,
            content: data.content,
            relatedId: data.relatedId,
          },
        });

        notificationNamespace.to(`user:${data.toUserId}`).emit('notification:new', {
          ...notification,
          senderId: userId,
          senderName: authSocket.username,
        });

        const unreadCount = await prisma.notification.count({
          where: { userId: data.toUserId, read: false },
        });

        notificationNamespace.to(`user:${data.toUserId}`).emit('notifications:unreadCount', {
          userId: data.toUserId,
          unreadCount,
        });
      } catch (error) {
        logger.error('[Notifications] Failed to send:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to send notification' });
      }
    });

    socket.on('notifications:preferences', async (prefs: NotificationPreferences) => {
      try {
        await prisma.userSettings.upsert({
          where: { userId },
          update: { notifications: prefs as never },
          create: { userId, notifications: prefs as never },
        });

        socket.emit('notifications:preferences', { saved: true });
      } catch (error) {
        logger.error('[Notifications] Failed to save preferences:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to save preferences' });
      }
    });

    socket.on('notifications:registerToken', async (data: { token: string; platform?: string }) => {
      try {
        if (!data.token) return;

        const existing = await prisma.userDevice.findFirst({
          where: { deviceToken: data.token },
        });

        if (!existing) {
          await prisma.userDevice.create({
            data: {
              userId,
              deviceToken: data.token,
              platform: data.platform || 'unknown',
            },
          });
        }

        socket.emit('notifications:tokenRegistered', { token: data.token });
      } catch (error) {
        logger.error('[Notifications] Failed to register token:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('notifications:unregisterToken', async (token: string) => {
      try {
        if (!token) return;
        await prisma.userDevice.deleteMany({ where: { deviceToken: token } });
        socket.emit('notifications:tokenUnregistered', { token });
      } catch (error) {
        logger.error('[Notifications] Failed to unregister token:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('disconnect', () => {
    });
  });
}
