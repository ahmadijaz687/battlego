import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { randomUUID } from 'expo-crypto';
import { getDatabase, type DB } from '../database';
import { useAuthStore } from '../store/authStore';
import type {
  Post,
  Story,
  Friend,
  FriendRequest,
  Message,
  Conversation,
  Community,
  Notification,
} from '../types/social';

function getDb(): DB {
  return getDatabase();
}

function currentUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

function nowISO(): string {
  return new Date().toISOString();
}

function expiryISO(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

const QUERY_KEYS = {
  feed: ['social', 'feed'],
  stories: ['social', 'stories'],
  friends: ['social', 'friends'],
  friendRequests: ['social', 'friend-requests'],
  notifications: ['social', 'notifications'],
  conversations: ['social', 'conversations'],
  messages: (id: string) => ['social', 'messages', id],
  communities: ['social', 'communities'],
  communityMembers: (id: string) => ['social', 'community-members', id],
  communityPosts: (id: string) => ['social', 'community-posts', id],
  postComments: (id: string) => ['social', 'post-comments', id],
  userProfile: (id: string) => ['social', 'user-profile', id],
  userPosts: (id: string) => ['social', 'user-posts', id],
  userAchievements: (id: string) => ['social', 'user-achievements', id],
  searchUsers: (q: string) => ['social', 'search-users', q],
  unreadCount: ['social', 'unread-count'],
} as const;

// ────────────────────────────────────────────
// FEED / POSTS
// ────────────────────────────────────────────

function dbRowToPost(r: any): Post {
  return {
    id: r.id,
    userId: r.user_id,
    userName: r.user_name,
    userAvatar: r.user_avatar,
    content: r.content,
    images: r.images ? JSON.parse(r.images) : undefined,
    workoutId: r.workout_id,
    mealId: r.meal_id,
    likes: r.likes,
    comments: r.comments,
    shares: r.shares,
    saves: r.saves,
    type: r.type,
    createdAt: r.created_at,
  };
}

function getFeedPosts(userId: string): Post[] {
  const d = getDb();
  const friendIds = d
    .getAllSync<{ friend_id: string }>(
      'SELECT friend_id FROM friends WHERE user_id = ?',
      [userId]
    )
    .map((r) => r.friend_id);

  const placeholders = friendIds.length > 0 ? friendIds.map(() => '?').join(',') : 'NULL';
  const rows = d.getAllSync<any>(
    `SELECT * FROM posts
     WHERE user_id IN (${placeholders}) OR user_id = ?
     ORDER BY created_at DESC
     LIMIT 50`,
    [...friendIds, userId]
  );
  return rows.map(dbRowToPost);
}

function getPostDetail(postId: string): Post | null {
  const r = getDb().getFirstSync<any>('SELECT * FROM posts WHERE id = ?', [postId]);
  return r ? dbRowToPost(r) : null;
}

function getPostComments(postId: string) {
  return getDb().getAllSync<{
    id: string;
    post_id: string;
    user_id: string;
    user_name: string;
    user_avatar: string | null;
    content: string;
    created_at: string;
  }>(
    'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC',
    [postId]
  );
}

function createPost(
  userId: string,
  data: {
    content: string;
    type: string;
    images?: string[];
    workoutId?: string;
    mealId?: string;
  }
): Post {
  const d = getDb();
  const user = d.getFirstSync<{ name: string; avatar: string | null }>(
    'SELECT name, avatar FROM users WHERE id = ?',
    [userId]
  );
  const id = randomUUID();
  d.runSync(
    `INSERT INTO posts (id, user_id, user_name, user_avatar, content, images, workout_id, meal_id, likes, comments, shares, saves, type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, ?)`,
    [
      id,
      userId,
      user?.name ?? 'User',
      user?.avatar ?? null,
      data.content,
      data.images ? JSON.stringify(data.images) : null,
      data.workoutId ?? null,
      data.mealId ?? null,
      data.type,
    ]
  );
  const r = d.getFirstSync<any>('SELECT * FROM posts WHERE id = ?', [id]);
  return dbRowToPost(r!);
}

function deletePost(userId: string, postId: string): boolean {
  const d = getDb();
  const post = d.getFirstSync<{ user_id: string }>('SELECT user_id FROM posts WHERE id = ?', [postId]);
  if (!post || post.user_id !== userId) return false;
  d.runSync('DELETE FROM posts WHERE id = ?', [postId]);
  return true;
}

// ────────────────────────────────────────────
// POST LIKES
// ────────────────────────────────────────────

function toggleLike(userId: string, postId: string): { liked: boolean; likeCount: number } {
  const d = getDb();
  const existing = d.getFirstSync<{ id: string }>(
    'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
    [postId, userId]
  );

  if (existing) {
    d.withTransactionSync(() => {
      d.runSync('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
      d.runSync('UPDATE posts SET likes = MAX(0, likes - 1) WHERE id = ?', [postId]);
    });
  } else {
    d.withTransactionSync(() => {
      d.runSync(
        'INSERT INTO post_likes (id, post_id, user_id) VALUES (?, ?, ?)',
        [randomUUID(), postId, userId]
      );
      d.runSync('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId]);
    });
  }

  const post = d.getFirstSync<{ likes: number }>('SELECT likes FROM posts WHERE id = ?', [postId]);
  return { liked: !existing, likeCount: post?.likes ?? 0 };
}

function hasUserLikedPost(userId: string, postId: string): boolean {
  return !!getDb().getFirstSync<{ id: string }>(
    'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
    [postId, userId]
  );
}

// ────────────────────────────────────────────
// POST COMMENTS
// ────────────────────────────────────────────

function addComment(
  userId: string,
  postId: string,
  content: string
) {
  const d = getDb();
  const user = d.getFirstSync<{ name: string; avatar: string | null }>(
    'SELECT name, avatar FROM users WHERE id = ?',
    [userId]
  );
  const id = randomUUID();
  d.withTransactionSync(() => {
    d.runSync(
      'INSERT INTO comments (id, post_id, user_id, user_name, user_avatar, content) VALUES (?, ?, ?, ?, ?, ?)',
      [id, postId, userId, user?.name ?? 'User', user?.avatar ?? null, content]
    );
    d.runSync('UPDATE posts SET comments = comments + 1 WHERE id = ?', [postId]);
  });
  return d.getFirstSync<any>('SELECT * FROM comments WHERE id = ?', [id]);
}

// ────────────────────────────────────────────
// STORIES
// ────────────────────────────────────────────

function dbRowToStory(r: any): Story {
  return {
    id: r.id,
    userId: r.user_id,
    userName: r.user_name,
    image: r.image,
    videoUrl: r.video_url,
    viewed: r.viewed === 1,
    duration: r.duration,
    expiresAt: r.expires_at,
  };
}

function getActiveStories(): Story[] {
  const d = getDb();
  const now = nowISO();
  const rows = d.getAllSync<any>(
    'SELECT * FROM stories WHERE expires_at > ? ORDER BY created_at DESC',
    [now]
  );
  return rows.map(dbRowToStory);
}

function createStory(
  userId: string,
  data: { image?: string; videoUrl?: string; text?: string; workoutRef?: string }
): Story {
  const d = getDb();
  const user = d.getFirstSync<{ name: string }>('SELECT name FROM users WHERE id = ?', [userId]);
  const id = randomUUID();
  d.runSync(
    `INSERT INTO stories (id, user_id, user_name, image, video_url, viewed, duration, expires_at)
     VALUES (?, ?, ?, ?, ?, 0, 5, ?)`,
    [
      id,
      userId,
      user?.name ?? 'User',
      data.image ?? null,
      data.videoUrl ?? null,
      expiryISO(24),
    ]
  );
  const r = d.getFirstSync<any>('SELECT * FROM stories WHERE id = ?', [id]);
  return dbRowToStory(r!);
}

function viewStory(userId: string, storyId: string): void {
  const d = getDb();
  d.runSync(
    'UPDATE stories SET viewed = 1 WHERE id = ?',
    [storyId]
  );
}

function getStoryViewsCount(storyId: string): number {
  const r = getDb().getFirstSync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM story_views WHERE story_id = ?',
    [storyId]
  );
  return r?.cnt ?? 0;
}

function deleteExpiredStories(): number {
  const d = getDb();
  const now = nowISO();
  const before = d.getFirstSync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM stories WHERE expires_at <= ?',
    [now]
  );
  d.runSync('DELETE FROM stories WHERE expires_at <= ?', [now]);
  return before?.cnt ?? 0;
}

// ────────────────────────────────────────────
// FRIENDS
// ────────────────────────────────────────────

function dbRowToFriend(r: any): Friend {
  return {
    id: r.id,
    userId: r.user_id,
    friendId: r.friend_id,
    name: r.name,
    username: r.username,
    avatar: r.avatar,
    status: r.status,
    lastSeen: r.last_seen,
  };
}

function getFriends(userId: string): Friend[] {
  const rows = getDb().getAllSync<any>(
    'SELECT * FROM friends WHERE user_id = ? ORDER BY name ASC',
    [userId]
  );
  return rows.map(dbRowToFriend);
}

function getFriendRequests(userId: string): FriendRequest[] {
  const rows = getDb().getAllSync<any>(
    `SELECT * FROM friend_requests
     WHERE user_id = ? AND status = 'pending'
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    fromUserId: r.from_user_id,
    fromUserName: r.from_user_name,
    fromUserAvatar: r.from_user_avatar,
    status: r.status,
    createdAt: r.created_at,
  }));
}

function sendFriendRequest(
  fromUserId: string,
  toUserId: string
): { success: boolean; error?: string } {
  const d = getDb();

  if (fromUserId === toUserId) {
    return { success: false, error: 'Cannot friend yourself' };
  }

  const existing = d.getFirstSync<{ id: string }>(
    `SELECT id FROM friend_requests
     WHERE user_id = ? AND from_user_id = ? AND status = 'pending'`,
    [toUserId, fromUserId]
  );
  if (existing) {
    return { success: false, error: 'Request already pending' };
  }

  const alreadyFriend = d.getFirstSync<{ id: string }>(
    'SELECT id FROM friends WHERE user_id = ? AND friend_id = ?',
    [fromUserId, toUserId]
  );
  if (alreadyFriend) {
    return { success: false, error: 'Already friends' };
  }

  const fromUser = d.getFirstSync<{ name: string; avatar: string | null }>(
    'SELECT name, avatar FROM users WHERE id = ?',
    [fromUserId]
  );

  d.runSync(
    `INSERT INTO friend_requests (id, user_id, from_user_id, from_user_name, from_user_avatar, status)
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [
      randomUUID(),
      toUserId,
      fromUserId,
      fromUser?.name ?? 'User',
      fromUser?.avatar ?? null,
    ]
  );

  createNotificationInternal(toUserId, 'friend_request', 'New Friend Request',
    `${fromUser?.name ?? 'Someone'} sent you a friend request`, fromUserId);

  return { success: true };
}

function acceptFriendRequest(requestId: string): { success: boolean; error?: string } {
  const d = getDb();
  const request = d.getFirstSync<any>(
    'SELECT * FROM friend_requests WHERE id = ?',
    [requestId]
  );
  if (!request) return { success: false, error: 'Request not found' };

  const fromUser = d.getFirstSync<{ name: string; username: string; avatar: string | null }>(
    'SELECT name, username, avatar FROM users WHERE id = ?',
    [request.from_user_id]
  );
  const toUser = d.getFirstSync<{ name: string; username: string; avatar: string | null }>(
    'SELECT name, username, avatar FROM users WHERE id = ?',
    [request.user_id]
  );

  d.withTransactionSync(() => {
    d.runSync(
      "UPDATE friend_requests SET status = 'accepted' WHERE id = ?",
      [requestId]
    );

    if (fromUser) {
      d.runSync(
        `INSERT OR IGNORE INTO friends (id, user_id, friend_id, name, username, avatar, status, last_seen)
         VALUES (?, ?, ?, ?, ?, ?, 'offline', ?)`,
        [randomUUID(), request.user_id, request.from_user_id, fromUser.name, fromUser.username, fromUser.avatar, nowISO()]
      );
    }
    if (toUser) {
      d.runSync(
        `INSERT OR IGNORE INTO friends (id, user_id, friend_id, name, username, avatar, status, last_seen)
         VALUES (?, ?, ?, ?, ?, ?, 'offline', ?)`,
        [randomUUID(), request.from_user_id, request.user_id, toUser.name, toUser.username, toUser.avatar, nowISO()]
      );
    }

    createNotificationInternal(
      request.from_user_id,
      'friend_request',
      'Friend Request Accepted',
      `${toUser?.name ?? 'Someone'} accepted your friend request`,
      request.user_id
    );
  });

  return { success: true };
}

function rejectFriendRequest(requestId: string): boolean {
  const d = getDb();
  const request = d.getFirstSync<any>('SELECT * FROM friend_requests WHERE id = ?', [requestId]);
  if (!request) return false;
  d.runSync("UPDATE friend_requests SET status = 'declined' WHERE id = ?", [requestId]);
  return true;
}

function removeFriend(userId: string, friendId: string): boolean {
  const d = getDb();
  d.runSync('DELETE FROM friends WHERE user_id = ? AND friend_id = ?', [userId, friendId]);
  d.runSync('DELETE FROM friends WHERE user_id = ? AND friend_id = ?', [friendId, userId]);
  return true;
}

function blockUser(userId: string, blockedUserId: string): void {
  const d = getDb();
  d.withTransactionSync(() => {
    d.runSync(
      'INSERT OR REPLACE INTO blocked_users (id, user_id, blocked_user_id) VALUES (?, ?, ?)',
      [randomUUID(), userId, blockedUserId]
    );
    d.runSync('DELETE FROM friends WHERE user_id = ? AND friend_id = ?', [userId, blockedUserId]);
    d.runSync('DELETE FROM friends WHERE user_id = ? AND friend_id = ?', [blockedUserId, userId]);
  });
}

function searchUsers(query: string, limit = 20) {
  const d = getDb();
  return d.getAllSync<{ id: string; name: string; avatar: string | null }>(
    `SELECT id, name, avatar FROM users
     WHERE name LIKE ? OR email LIKE ?
     ORDER BY name ASC
     LIMIT ?`,
    [`%${query}%`, `%${query}%`, limit]
  );
}

function getMutualFriendsCount(userId: string, otherUserId: string): number {
  const d = getDb();
  const r = d.getFirstSync<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM friends f1
     INNER JOIN friends f2 ON f1.friend_id = f2.friend_id
     WHERE f1.user_id = ? AND f2.user_id = ?`,
    [userId, otherUserId]
  );
  return r?.cnt ?? 0;
}

// ────────────────────────────────────────────
// CHAT / MESSAGING
// ────────────────────────────────────────────

function dbRowToConversation(r: any): Conversation {
  return {
    id: r.id,
    participantIds: JSON.parse(r.participant_ids),
    participantNames: JSON.parse(r.participant_names),
    lastMessage: r.last_message,
    lastMessageAt: r.last_message_at,
    unreadCount: r.unread_count,
  };
}

function getConversations(userId: string): Conversation[] {
  const d = getDb();
  const memberConvos = d.getAllSync<{ conversation_id: string }>(
    'SELECT conversation_id FROM conversation_members WHERE user_id = ?',
    [userId]
  );
  if (memberConvos.length === 0) return [];

  const ids = memberConvos.map((m) => m.conversation_id);
  const placeholders = ids.map(() => '?').join(',');
  const rows = d.getAllSync<any>(
    `SELECT * FROM conversations
     WHERE id IN (${placeholders})
     ORDER BY last_message_at DESC NULLS LAST`,
    ids
  );
  return rows.map(dbRowToConversation);
}

function getChatMessages(conversationId: string): Message[] {
  const rows = getDb().getAllSync<any>(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC',
    [conversationId]
  );
  return rows.map((r) => ({
    id: r.id,
    conversationId: r.conversation_id,
    senderId: r.sender_id,
    senderName: r.sender_name,
    content: r.content,
    mediaUrl: r.media_url,
    sentAt: r.sent_at,
    readAt: r.read_at,
    deliveredAt: r.delivered_at,
    type: r.type,
  }));
}

function createConversation(
  userId: string,
  participantIds: string[],
  participantNames: string[]
): Conversation {
  const d = getDb();
  const id = randomUUID();
  d.withTransactionSync(() => {
    d.runSync(
      `INSERT INTO conversations (id, participant_ids, participant_names, unread_count)
       VALUES (?, ?, ?, 0)`,
      [id, JSON.stringify(participantIds), JSON.stringify(participantNames)]
    );
    for (let i = 0; i < participantIds.length; i++) {
      d.runSync(
        'INSERT OR IGNORE INTO conversation_members (id, conversation_id, user_id, user_name) VALUES (?, ?, ?, ?)',
        [randomUUID(), id, participantIds[i], participantNames[i] ?? 'User']
      );
    }
  });
  return { id, participantIds, participantNames, unreadCount: 0 };
}

function sendMessage(
  userId: string,
  conversationId: string,
  content: string,
  type: 'text' | 'image' | 'voice' = 'text'
): Message {
  const d = getDb();
  const user = d.getFirstSync<{ name: string }>('SELECT name FROM users WHERE id = ?', [userId]);
  const id = randomUUID();
  const sentAt = nowISO();
  d.withTransactionSync(() => {
    d.runSync(
      `INSERT INTO messages (id, conversation_id, sender_id, sender_name, content, sent_at, type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, conversationId, userId, user?.name ?? 'User', content, sentAt, type]
    );
    d.runSync(
      'UPDATE conversations SET last_message = ?, last_message_at = ? WHERE id = ?',
      [content, sentAt, conversationId]
    );
  });
  return {
    id,
    conversationId,
    senderId: userId,
    senderName: user?.name ?? 'User',
    content,
    sentAt,
    type,
  };
}

function markMessagesRead(conversationId: string, userId: string): void {
  const d = getDb();
  const now = nowISO();
  d.runSync(
    `UPDATE messages SET read_at = ?
     WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL`,
    [now, conversationId, userId]
  );
  d.runSync(
    'UPDATE conversations SET unread_count = 0 WHERE id = ?',
    [conversationId]
  );
}

function getUnreadCount(userId: string): number {
  const d = getDb();
  const convIds = d.getAllSync<{ id: string }>(
    `SELECT c.id FROM conversations c
     INNER JOIN conversation_members cm ON cm.conversation_id = c.id
     WHERE cm.user_id = ?`,
    [userId]
  ).map((c) => c.id);
  if (convIds.length === 0) return 0;

  const placeholders = convIds.map(() => '?').join(',');
  const r = d.getFirstSync<{ cnt: number }>(
    `SELECT COALESCE(SUM(unread_count), 0) as cnt
     FROM conversations WHERE id IN (${placeholders})`,
    convIds
  );
  return r?.cnt ?? 0;
}

// ────────────────────────────────────────────
// COMMUNITIES
// ────────────────────────────────────────────

function dbRowToCommunity(r: any): Community {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    avatar: r.avatar,
    memberCount: r.member_count,
    isPrivate: r.is_private === 1,
    createdAt: r.created_at,
  };
}

function getCommunities(): Community[] {
  return getDb()
    .getAllSync<any>('SELECT * FROM communities ORDER BY member_count DESC')
    .map(dbRowToCommunity);
}

function createCommunity(
  userId: string,
  data: { name: string; description: string; avatar?: string; isPrivate?: boolean }
): Community {
  const d = getDb();
  const id = randomUUID();
  d.withTransactionSync(() => {
    d.runSync(
      `INSERT INTO communities (id, name, description, avatar, member_count, is_private)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [id, data.name, data.description, data.avatar ?? null, data.isPrivate ? 1 : 0]
    );
    const user = d.getFirstSync<{ name: string }>('SELECT name FROM users WHERE id = ?', [userId]);
    d.runSync(
      'INSERT INTO community_members (id, community_id, user_id, user_name) VALUES (?, ?, ?, ?)',
      [randomUUID(), id, userId, user?.name ?? 'User']
    );
  });
  const r = d.getFirstSync<any>('SELECT * FROM communities WHERE id = ?', [id]);
  return dbRowToCommunity(r!);
}

function joinCommunity(userId: string, communityId: string): boolean {
  const d = getDb();
  const existing = d.getFirstSync<{ id: string }>(
    'SELECT id FROM community_members WHERE community_id = ? AND user_id = ?',
    [communityId, userId]
  );
  if (existing) return false;

  const user = d.getFirstSync<{ name: string }>('SELECT name FROM users WHERE id = ?', [userId]);
  d.withTransactionSync(() => {
    d.runSync(
      'INSERT INTO community_members (id, community_id, user_id, user_name) VALUES (?, ?, ?, ?)',
      [randomUUID(), communityId, userId, user?.name ?? 'User']
    );
    d.runSync('UPDATE communities SET member_count = member_count + 1 WHERE id = ?', [communityId]);
  });
  return true;
}

function leaveCommunity(userId: string, communityId: string): boolean {
  const d = getDb();
  const existing = d.getFirstSync<{ id: string }>(
    'SELECT id FROM community_members WHERE community_id = ? AND user_id = ?',
    [communityId, userId]
  );
  if (!existing) return false;

  d.withTransactionSync(() => {
    d.runSync(
      'DELETE FROM community_members WHERE community_id = ? AND user_id = ?',
      [communityId, userId]
    );
    d.runSync(
      'UPDATE communities SET member_count = MAX(0, member_count - 1) WHERE id = ?',
      [communityId]
    );
  });
  return true;
}

function getCommunityMembers(communityId: string) {
  return getDb().getAllSync<{ id: string; user_id: string; user_name: string; joined_at: string }>(
    'SELECT * FROM community_members WHERE community_id = ? ORDER BY joined_at ASC',
    [communityId]
  );
}

function getCommunityPosts(communityId: string): Post[] {
  return getDb()
    .getAllSync<any>(
      'SELECT * FROM posts WHERE type = ? ORDER BY created_at DESC LIMIT 50',
      ['general']
    )
    .map(dbRowToPost);
}

// ────────────────────────────────────────────
// NOTIFICATIONS
// ────────────────────────────────────────────

function dbRowToNotification(r: any): Notification {
  return {
    id: r.id,
    userId: r.user_id,
    type: r.type,
    title: r.title,
    content: r.content,
    read: r.read === 1,
    createdAt: r.created_at,
    relatedId: r.related_id,
  };
}

function getNotifications(userId: string, limit = 50): Notification[] {
  return getDb()
    .getAllSync<any>(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    )
    .map(dbRowToNotification);
}

function createNotificationInternal(
  userId: string,
  type: string,
  title: string,
  content: string,
  relatedId?: string
): Notification {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    `INSERT INTO notifications (id, user_id, type, title, content, related_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, userId, type, title, content, relatedId ?? null]
  );
  const r = d.getFirstSync<any>('SELECT * FROM notifications WHERE id = ?', [id]);
  return dbRowToNotification(r!);
}

function markNotificationRead(notificationId: string): void {
  getDb().runSync('UPDATE notifications SET read = 1 WHERE id = ?', [notificationId]);
}

function markAllNotificationsRead(userId: string): void {
  getDb().runSync('UPDATE notifications SET read = 1 WHERE user_id = ?', [userId]);
}

function deleteNotification(notificationId: string): void {
  getDb().runSync('DELETE FROM notifications WHERE id = ?', [notificationId]);
}

function deleteOldNotifications(maxAgeDays = 30): number {
  const d = getDb();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - maxAgeDays);
  const cutoffISO = cutoff.toISOString();
  const before = d.getFirstSync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM notifications WHERE created_at < ?',
    [cutoffISO]
  );
  d.runSync('DELETE FROM notifications WHERE created_at < ?', [cutoffISO]);
  return before?.cnt ?? 0;
}

function getNotificationUnreadCount(userId: string): number {
  const r = getDb().getFirstSync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM notifications WHERE user_id = ? AND read = 0',
    [userId]
  );
  return r?.cnt ?? 0;
}

// ────────────────────────────────────────────
// USER PROFILE (for ProfileScreen)
// ────────────────────────────────────────────

function getUserProfile(userId: string) {
  return getDb().getFirstSync<any>(
    `SELECT u.id, u.name, u.avatar, u.points, u.streak, u.longest_streak,
            up.bio, up.experience, up.fitness_level, up.goal
     FROM users u
     LEFT JOIN user_profiles up ON up.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  );
}

function getUserPosts(userId: string): Post[] {
  return getDb()
    .getAllSync<any>(
      'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    )
    .map(dbRowToPost);
}

function getUserAchievements(userId: string) {
  return getDb().getAllSync<any>(
    `SELECT a.id, a.name, a.description, a.icon, a.category, ua.unlocked_at
     FROM user_achievements ua
     INNER JOIN achievements a ON a.id = ua.achievement_id
     WHERE ua.user_id = ?
     ORDER BY ua.unlocked_at DESC`,
    [userId]
  );
}

// ════════════════════════════════════════════
// REACT QUERY HOOKS (screen-compatible)
// ════════════════════════════════════════════

export function useFeed() {
  return useQuery({
    queryKey: QUERY_KEYS.feed,
    queryFn: async () => {
      const userId = currentUserId();
      if (!userId) return [];
      return getFeedPosts(userId);
    },
    staleTime: 1000 * 30,
  });
}

export function useStories() {
  return useQuery({
    queryKey: QUERY_KEYS.stories,
    queryFn: async () => getActiveStories(),
    staleTime: 1000 * 60,
  });
}

export function useFriends() {
  return useQuery({
    queryKey: QUERY_KEYS.friends,
    queryFn: async () => {
      const userId = currentUserId();
      if (!userId) return [];
      return getFriends(userId);
    },
    staleTime: 1000 * 60,
  });
}

export function useFriendRequests() {
  return useQuery({
    queryKey: QUERY_KEYS.friendRequests,
    queryFn: async () => {
      const userId = currentUserId();
      if (!userId) return [];
      return getFriendRequests(userId);
    },
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: async () => {
      const userId = currentUserId();
      if (!userId) return [];
      return getNotifications(userId);
    },
    staleTime: 1000 * 30,
  });
}

export function useConversations() {
  return useQuery({
    queryKey: QUERY_KEYS.conversations,
    queryFn: async () => {
      const userId = currentUserId();
      if (!userId) return [];
      return getConversations(userId);
    },
  });
}

export function useChatMessages(conversationId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.messages(conversationId),
    queryFn: async () => getChatMessages(conversationId),
    enabled: !!conversationId,
  });
}

export function useCommunities() {
  return useQuery({
    queryKey: QUERY_KEYS.communities,
    queryFn: async () => getCommunities(),
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      content: string;
      type: string;
      images?: string[];
      workoutId?: string;
      mealId?: string;
    }) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      return createPost(userId, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.feed });
    },
  });
}

export function useSendFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { fromUserId: string; fromUserName: string }) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      return sendFriendRequest(userId, data.fromUserId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.friendRequests });
    },
  });
}

export function useLikePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      return toggleLike(userId, postId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.feed });
    },
  });
}

export function useCreateComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      return addComment(userId, postId, content);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.feed });
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      return sendMessage(userId, conversationId, content);
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: QUERY_KEYS.messages(variables.conversationId),
      });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
    },
  });
}

export function useAcceptFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      return acceptFriendRequest(requestId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.friends });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.friendRequests });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });
}

// ════════════════════════════════════════════
// ADDITIONAL HOOKS (new social features)
// ════════════════════════════════════════════

export function useRejectFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => rejectFriendRequest(requestId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.friendRequests });
    },
  });
}

export function useRemoveFriend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (friendId: string) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      return removeFriend(userId, friendId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.friends });
    },
  });
}

export function useBlockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (blockedUserId: string) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      blockUser(userId, blockedUserId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.friends });
    },
  });
}

export function useSearchUsers() {
  return useMutation({
    mutationFn: async (query: string) => searchUsers(query),
  });
}

export function useCreateStory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      image?: string;
      videoUrl?: string;
      text?: string;
      workoutRef?: string;
    }) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      return createStory(userId, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stories });
    },
  });
}

export function useViewStory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (storyId: string) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      viewStory(userId, storyId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stories });
    },
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      participantIds: string[];
      participantNames: string[];
    }) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      const allIds = [userId, ...data.participantIds.filter((id) => id !== userId)];
      return createConversation(userId, allIds, data.participantNames);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
    },
  });
}

export function useMarkMessagesRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      markMessagesRead(conversationId, userId);
    },
    onSuccess: (_data, conversationId) => {
      qc.invalidateQueries({
        queryKey: QUERY_KEYS.messages(conversationId),
      });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
    },
  });
}

export function useJoinCommunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (communityId: string) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      return joinCommunity(userId, communityId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.communities });
    },
  });
}

export function useLeaveCommunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (communityId: string) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      return leaveCommunity(userId, communityId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.communities });
    },
  });
}

export function useCreateCommunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      avatar?: string;
      isPrivate?: boolean;
    }) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      return createCommunity(userId, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.communities });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      return deletePost(userId, postId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.feed });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const userId = currentUserId();
      if (!userId) throw new Error('Not authenticated');
      markAllNotificationsRead(userId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      markNotificationRead(notificationId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      deleteNotification(notificationId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });
}

export function useCommunityPosts(communityId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.communityPosts(communityId),
    queryFn: async () => getCommunityPosts(communityId),
    enabled: !!communityId,
  });
}

export function useCommunityMembers(communityId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.communityMembers(communityId),
    queryFn: async () => getCommunityMembers(communityId),
    enabled: !!communityId,
  });
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.userProfile(userId),
    queryFn: async () => getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useUserPosts(userId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.userPosts(userId),
    queryFn: async () => getUserPosts(userId),
    enabled: !!userId,
  });
}

export function useUserAchievements(userId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.userAchievements(userId),
    queryFn: async () => getUserAchievements(userId),
    enabled: !!userId,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: QUERY_KEYS.unreadCount,
    queryFn: async () => {
      const userId = currentUserId();
      if (!userId) return 0;
      return getUnreadCount(userId);
    },
    staleTime: 1000 * 15,
  });
}

export function useCleanupExpiredStories() {
  return useMutation({
    mutationFn: async () => deleteExpiredStories(),
  });
}
