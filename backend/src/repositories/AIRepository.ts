import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class AIRepository extends BaseRepository<any, any, any> {
  constructor() {
    super(prisma.aIConversation, 'aiConversation');
  }

  async getConversationsByUserId(userId: string) {
    return prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
          take: 1,
        },
      },
    });
  }

  async getConversationWithMessages(userId: string, conversationId: string) {
    return prisma.aIConversation.findFirst({
      where: { id: conversationId, userId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });
  }

  async addMessage(conversationId: string, role: 'user' | 'assistant', content: string) {
    return prisma.$transaction(async (tx) => {
      const message = await tx.aIMessage.create({
        data: { conversationId, role, content },
      });

      await tx.aIConversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return message;
    });
  }

  async deleteConversationWithMessages(conversationId: string) {
    await prisma.$transaction(async (tx) => {
      await tx.aIMessage.deleteMany({ where: { conversationId } });
      await tx.aIConversation.delete({ where: { id: conversationId } });
    });
  }
}

export const aiRepository = new AIRepository();
