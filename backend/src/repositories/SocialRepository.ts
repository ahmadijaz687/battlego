import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class SocialRepository extends BaseRepository<any, any, any> {
  constructor() {
    super(prisma.post, 'post');
  }

  async getFeed(userId: string, limit = 20, offset = 0) {
    const friendIds = await prisma.friend.findMany({
      where: { userId },
      select: { friendId: true },
    });

    const userIds = [userId, ...friendIds.map((f) => f.friendId)];

    return prisma.post.findMany({
      where: { userId: { in: userIds } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getConversationWithMessages(conversationId: string) {
    const [conversation, messages] = await Promise.all([
      prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { members: true },
      }),
      prisma.message.findMany({
        where: { conversationId },
        orderBy: { sentAt: 'asc' },
      }),
    ]);
    if (!conversation) return null;
    return { ...conversation, messages };
  }

  async createConversation(participantIds: string[], participantNames: string[]) {
    return prisma.conversation.create({
      data: {
        participantIds,
        participantNames,
        members: {
          create: participantIds.map((id, i) => ({
            userId: id,
            userName: participantNames[i],
          })),
        },
      },
    });
  }

  async getUnreadNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAllNotificationsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}

export const socialRepository = new SocialRepository();
