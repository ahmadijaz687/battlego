import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class NotificationRepository extends BaseRepository<any, any, any> {
  constructor() {
    super(prisma.notification, 'notification');
  }

  async findByUserId(userId: string, params?: { skip?: number; take?: number; unreadOnly?: boolean }) {
    const where: Record<string, unknown> = { userId };
    if (params?.unreadOnly) where.read = false;

    return prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: params?.skip || 0,
      take: params?.take || 50,
    });
  }

  async create(data: {
    userId: string;
    type: string;
    title: string;
    content: string;
    relatedId?: string;
  }) {
    return prisma.notification.create({ data: data as never });
  }

  async markRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    });
  }

  async deleteOldNotifications(before: Date) {
    await prisma.notification.deleteMany({
      where: { createdAt: { lt: before } },
    });
  }

  async registerToken(userId: string, token: string) {
    const existing = await prisma.userDevice.findFirst({ where: { deviceToken: token } });
    if (existing) return existing;

    return prisma.userDevice.create({
      data: { userId, deviceToken: token, platform: 'unknown' },
    });
  }

  async unregisterToken(token: string) {
    await prisma.userDevice.deleteMany({ where: { deviceToken: token } });
  }
}

export const notificationRepository = new NotificationRepository();
