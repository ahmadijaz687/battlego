/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../services/database.js';
export async function getFeed(userId) {
    return prisma.post.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
export async function createPost(userId, data) {
    return prisma.post.create({
        data: {
            userId,
            userName: data.userName,
            userAvatar: data.userAvatar,
            content: data.content,
            images: data.images,
            workoutId: data.workoutId,
            mealId: data.mealId,
            type: data.type,
        },
    });
}
export async function getStories() {
    return prisma.story.findMany({
        where: { expiresAt: { gt: new Date() } },
        orderBy: { id: 'desc' },
    });
}
export async function createStory(userId, data) {
    return prisma.story.create({
        data: {
            userId,
            userName: data.userName,
            image: data.image,
            videoUrl: data.videoUrl,
            duration: data.duration,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    });
}
export async function getFriends(userId) {
    return prisma.friend.findMany({
        where: { userId },
    });
}
export async function getFriendRequests(userId) {
    return prisma.friendRequest.findMany({
        where: { userId, status: 'pending' },
    });
}
export async function sendFriendRequest(userId, data) {
    return prisma.friendRequest.create({
        data: {
            userId,
            fromUserId: data.fromUserId,
            fromUserName: data.fromUserName,
            fromUserAvatar: data.fromUserAvatar,
            status: 'pending',
        },
    });
}
export async function getMessages(conversationId) {
    return prisma.message.findMany({
        where: { conversationId },
        orderBy: { sentAt: 'desc' },
    });
}
export async function sendMessage(data) {
    return prisma.message.create({
        data: {
            conversationId: data.conversationId,
            senderId: data.senderId,
            senderName: data.senderName,
            content: data.content,
            mediaUrl: data.mediaUrl,
            type: data.type,
        },
    });
}
export async function getCommunities() {
    return prisma.community.findMany({
        orderBy: { createdAt: 'desc' },
    });
}
export async function createCommunity(userId, data) {
    return prisma.community.create({
        data: {
            name: data.name,
            description: data.description,
            avatar: data.avatar,
            isPrivate: data.isPrivate || false,
            members: {
                create: {
                    userId,
                    userName: data.userName,
                },
            },
        },
    });
}
export async function getNotifications(userId) {
    return prisma.notification.findMany({
        where: { userId, read: false },
        orderBy: { createdAt: 'desc' },
    });
}
export async function markNotificationRead(id) {
    return prisma.notification.update({
        where: { id },
        data: { read: true },
    });
}
