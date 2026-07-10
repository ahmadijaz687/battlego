import { prisma } from '../services/database.js';
import type { MessageType, PostType } from '@prisma/client';
import { socialRepository } from '../repositories/index.js';

export async function getFeed(userId: string) {
  return socialRepository.getFeed(userId);
}

export async function createPost(userId: string, data: {
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  workoutId?: string;
  mealId?: string;
  type: string;
}) {
  const { userName, userAvatar, type, ...rest } = data;
  return prisma.post.create({
    data: {
      userId,
      userName,
      userAvatar,
      type: type as PostType,
      ...rest,
      likes: 0,
      comments: 0,
    },
  });
}

export async function getStories() {
  return prisma.story.findMany({
    where: { expiresAt: { gt: new Date() } },
    orderBy: { id: 'desc' },
  });
}

export async function createStory(userId: string, data: {
  userName: string;
  image?: string;
  videoUrl?: string;
  duration: number;
}) {
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

export async function getFriends(userId: string) {
  return prisma.friend.findMany({ where: { userId } });
}

export async function getFriendRequests(userId: string) {
  return prisma.friendRequest.findMany({
    where: { userId, status: 'pending' },
  });
}

export async function sendFriendRequest(userId: string, data: {
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
}) {
  return prisma.friendRequest.create({
    data: { userId, ...data, status: 'pending' },
  });
}

export async function listConversations(userId: string) {
  const memberships = await prisma.conversationMember.findMany({
    where: { userId },
    select: { conversationId: true },
  });

  const conversationIds = memberships.map((m) => m.conversationId);

  const conversations = await prisma.conversation.findMany({
    where: { id: { in: conversationIds } },
    orderBy: { lastMessageAt: 'desc' },
  });

  return conversations;
}

export async function sendMessageToConversation(userId: string, conversationId: string, data: {
  senderName: string;
  content: string;
  mediaUrl?: string;
  type?: string;
}) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { participantIds: true },
  });
  if (!conversation) throw new Error('Conversation not found');
  const participantIds = conversation.participantIds as string[];
  if (!participantIds.includes(userId)) throw new Error('Not a participant');

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        senderName: data.senderName,
        content: data.content,
        mediaUrl: data.mediaUrl,
        type: (data.type as MessageType) || 'text',
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date(), lastMessage: data.content },
    }),
  ]);

  return message;
}

export async function getMessages(userId: string, conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { participantIds: true },
  });
  if (!conversation) {
    throw new Error('Conversation not found');
  }
  const participantIds = conversation.participantIds as string[];
  if (!participantIds.includes(userId)) {
    throw new Error('Conversation not found');
  }
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { sentAt: 'desc' },
  });
}

export async function sendMessage(data: {
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  mediaUrl?: string;
  type: string;
}) {
  const { senderName, ...rest } = data;
  return prisma.message.create({ data: { ...rest, senderName, type: rest.type as MessageType } });
}

export async function getCommunities() {
  return prisma.community.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createCommunity(userId: string, data: {
  name: string;
  description: string;
  avatar?: string;
  isPrivate?: boolean;
  userName?: string;
}) {
  return prisma.community.create({
    data: {
      name: data.name,
      description: data.description,
      avatar: data.avatar,
      isPrivate: data.isPrivate || false,
      members: {
        create: { userId, userName: data.userName || 'User' },
      },
    },
  });
}

export async function getNotifications(userId: string) {
  return socialRepository.getUnreadNotifications(userId);
}

export async function markNotificationRead(userId: string, id: string) {
  const notification = await prisma.notification.findFirst({
    where: { id, userId },
  });
  if (!notification) {
    throw new Error('Notification not found');
  }
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
}

export async function acceptFriendRequest(userId: string, requestId: string) {
  const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });
  if (!request || request.userId !== userId) throw new Error('Friend request not found');

  await prisma.$transaction(async (tx) => {
    await tx.friendRequest.update({ where: { id: requestId }, data: { status: 'accepted' } });
    await tx.friend.upsert({
      where: { userId_friendId: { userId: request.fromUserId, friendId: request.userId } },
      update: {},
      create: {
        userId: request.fromUserId,
        friendId: request.userId,
        name: request.fromUserName,
        username: '',
        avatar: request.fromUserAvatar,
        status: 'online',
      },
    });
  });

  return { status: 'accepted' };
}

export async function declineFriendRequest(userId: string, requestId: string) {
  const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });
  if (!request || request.userId !== userId) throw new Error('Friend request not found');

  await prisma.friendRequest.update({ where: { id: requestId }, data: { status: 'declined' } });
  return { status: 'declined' };
}

export async function likePost(userId: string, postId: string) {
  const existing = await prisma.postLike.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  await prisma.$transaction(async (tx) => {
    if (existing) {
      await tx.postLike.delete({ where: { id: existing.id } });
      await tx.post.update({ where: { id: postId }, data: { likes: { decrement: 1 } } });
    } else {
      await tx.postLike.create({ data: { postId, userId } });
      await tx.post.update({ where: { id: postId }, data: { likes: { increment: 1 } } });
    }
  });

  return { liked: !existing };
}

export async function createComment(userId: string, postId: string, data: { content: string; userName: string; userAvatar?: string }) {
  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: { postId, userId, userName: data.userName, userAvatar: data.userAvatar, content: data.content },
    }),
    prisma.post.update({ where: { id: postId }, data: { comments: { increment: 1 } } }),
  ]);
  return comment;
}

export async function updatePost(userId: string, postId: string, data: Record<string, unknown>) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.userId !== userId) throw new Error('Post not found');
  return prisma.post.update({ where: { id: postId }, data });
}

export async function deletePost(userId: string, postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.userId !== userId) throw new Error('Post not found');
  await prisma.post.delete({ where: { id: postId } });
  return { deleted: true };
}

export async function deleteStory(userId: string, storyId: string) {
  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story || story.userId !== userId) throw new Error('Story not found');
  await prisma.story.delete({ where: { id: storyId } });
  return { deleted: true };
}

export async function joinCommunity(userId: string, communityId: string, userName: string) {
  await prisma.$transaction([
    prisma.communityMember.create({ data: { communityId, userId, userName } }),
    prisma.community.update({ where: { id: communityId }, data: { memberCount: { increment: 1 } } }),
  ]);
  return { joined: true };
}

export async function leaveCommunity(userId: string, communityId: string) {
  await prisma.$transaction([
    prisma.communityMember.deleteMany({ where: { communityId, userId } }),
    prisma.community.update({ where: { id: communityId }, data: { memberCount: { decrement: 1 } } }),
  ]);
  return { left: true };
}

export async function deleteNotification(userId: string, id: string) {
  const notification = await prisma.notification.findFirst({
    where: { id, userId },
  });
  if (!notification) {
    throw new Error('Notification not found');
  }
  await prisma.notification.delete({ where: { id } });
  return { deleted: true };
}
