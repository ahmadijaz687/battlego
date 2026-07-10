import { prisma } from '../services/database.js';
export async function getConversations(userId) {
    return prisma.aIConversation.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
    });
}
export async function getConversation(userId, conversationId) {
    return prisma.aIConversation.findFirst({
        where: { id: conversationId, userId },
        include: {
            messages: {
                orderBy: { timestamp: 'desc' },
            },
        },
    });
}
export async function createConversation(userId, title) {
    return prisma.aIConversation.create({
        data: {
            userId,
            title,
            pinned: false,
        },
    });
}
export async function addMessage(conversationId, role, content) {
    const message = await prisma.aIMessage.create({
        data: {
            conversationId,
            role,
            content,
        },
    });
    await prisma.aIConversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    });
    return message;
}
export async function deleteConversation(userId, conversationId) {
    const conversation = await prisma.aIConversation.findFirst({
        where: { id: conversationId, userId },
    });
    if (!conversation) {
        throw new Error('Conversation not found');
    }
    await prisma.aIMessage.deleteMany({
        where: { conversationId },
    });
    await prisma.aIConversation.delete({
        where: { id: conversationId },
    });
}
export async function togglePin(userId, conversationId) {
    const conversation = await prisma.aIConversation.findFirst({
        where: { id: conversationId, userId },
    });
    if (!conversation) {
        throw new Error('Conversation not found');
    }
    return prisma.aIConversation.update({
        where: { id: conversationId },
        data: { pinned: !conversation.pinned },
    });
}
