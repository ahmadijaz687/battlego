import { prisma } from '../services/database.js';
import { aiRepository } from '../repositories/index.js';

export async function getConversations(userId: string) {
  return aiRepository.getConversationsByUserId(userId);
}

export async function getConversation(userId: string, conversationId: string) {
  return aiRepository.getConversationWithMessages(userId, conversationId);
}

export async function createConversation(userId: string, title: string) {
  return prisma.aIConversation.create({
    data: { userId, title, pinned: false },
  });
}

export async function addMessage(conversationId: string, role: 'user' | 'assistant', content: string) {
  return aiRepository.addMessage(conversationId, role, content);
}

export async function deleteConversation(userId: string, conversationId: string) {
  await prisma.$transaction(async (tx) => {
    const conversation = await tx.aIConversation.findFirst({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    await aiRepository.deleteConversationWithMessages(conversationId);
  });
}

export async function togglePin(userId: string, conversationId: string) {
  return prisma.$transaction(async (tx) => {
    const conversation = await tx.aIConversation.findFirst({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return tx.aIConversation.update({
      where: { id: conversationId },
      data: { pinned: !conversation.pinned },
    });
  });
}
