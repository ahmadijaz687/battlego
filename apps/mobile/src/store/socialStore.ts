import { create } from 'zustand';
import { Post, Story, Friend, Message, Conversation, Community, Notification } from '../types/social';
import { getDatabase } from '../database';
import { useAuthStore } from './authStore';

interface SocialState {
  feed: Post[];
  stories: Story[];
  friends: Friend[];
  friendRequests: Friend[];
  conversations: Conversation[];
  chatMessages: Message[];
  notifications: Notification[];
  communities: Community[];
  isLoading: boolean;
  error: string | null;
  setFeed: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  setStories: (stories: Story[]) => void;
  addStory: (story: Story) => void;
  setFriends: (friends: Friend[]) => void;
  addFriend: (friend: Friend) => void;
  setConversations: (convs: Conversation[]) => void;
  addMessage: (message: Message) => void;
  setNotifications: (notifications: Notification[]) => void;
  markNotificationRead: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadFeed: () => void;
  loadStories: () => void;
  loadFriends: () => void;
  loadConversations: () => void;
  loadNotifications: () => void;
  loadCommunities: () => void;
  fetchFeed: () => void;
  fetchStories: () => void;
  fetchFriends: () => void;
  fetchFriendRequests: () => void;
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  fetchConversations: () => void;
  fetchChatMessages: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  fetchCommunities: () => void;
  createPost: (data: any) => void;
  likePost: (postId: string) => void;
  createComment: (postId: string, content: string) => void;
}

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  feed: [],
  stories: [],
  friends: [],
  friendRequests: [],
  conversations: [],
  chatMessages: [],
  notifications: [],
  communities: [],
  isLoading: false,
  error: null,

  setFeed: (posts) => set({ feed: posts }),
  addPost: (post) => set((state) => ({ feed: [post, ...state.feed] })),

  setStories: (stories) => set({ stories }),
  addStory: (story) => set((state) => ({ stories: [story, ...state.stories] })),

  setFriends: (friends) => set({ friends }),
  addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),

  setConversations: (convs) => set({ conversations: convs }),
  addMessage: (message) => set((state) => ({
    conversations: state.conversations.map((c) =>
      c.id === message.conversationId
        ? { ...c, lastMessage: message.content, lastMessageAt: message.sentAt }
        : c
    ),
  })),

  setNotifications: (notifications) => set({ notifications }),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
  })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  loadFeed: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const d = getDatabase();
      const friendIds = d.getAllSync<{ friend_id: string }>(
        'SELECT friend_id FROM friends WHERE user_id = ?',
        [userId]
      ).map((r: any) => r.friend_id);
      const placeholders = friendIds.length > 0 ? friendIds.map(() => '?').join(',') : 'NULL';
      const rows = d.getAllSync<any>(
        `SELECT * FROM posts WHERE user_id IN (${placeholders}) OR user_id = ? ORDER BY created_at DESC LIMIT 50`,
        [...friendIds, userId]
      );
      const feed: Post[] = rows.map((r: any) => ({
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
      }));
      set({ feed, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load feed' });
    }
  },

  loadStories: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const d = getDatabase();
      const now = new Date().toISOString();
      const rows = d.getAllSync<any>(
        "SELECT * FROM stories WHERE expires_at > ? ORDER BY created_at DESC",
        [now]
      );
      const stories: Story[] = rows.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        userName: r.user_name,
        image: r.image,
        videoUrl: r.video_url,
        viewed: r.viewed === 1,
        duration: r.duration,
        expiresAt: r.expires_at,
      }));
      set({ stories, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load stories' });
    }
  },

  loadFriends: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const d = getDatabase();
      const rows = d.getAllSync<any>(
        'SELECT * FROM friends WHERE user_id = ? ORDER BY name ASC',
        [userId]
      );
      const friends: Friend[] = rows.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        friendId: r.friend_id,
        name: r.name,
        username: r.username,
        avatar: r.avatar,
        status: r.status,
        lastSeen: r.last_seen,
      }));
      set({ friends, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load friends' });
    }
  },

  loadConversations: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const d = getDatabase();
      const memberConvos = d.getAllSync<{ conversation_id: string }>(
        'SELECT conversation_id FROM conversation_members WHERE user_id = ?',
        [userId]
      );
      if (memberConvos.length === 0) {
        set({ conversations: [], isLoading: false });
        return;
      }
      const ids = memberConvos.map((m) => m.conversation_id);
      const placeholders = ids.map(() => '?').join(',');
      const rows = d.getAllSync<any>(
        `SELECT * FROM conversations WHERE id IN (${placeholders}) ORDER BY last_message_at DESC NULLS LAST`,
        ids
      );
      const conversations: Conversation[] = rows.map((r: any) => ({
        id: r.id,
        participantIds: JSON.parse(r.participant_ids),
        participantNames: JSON.parse(r.participant_names),
        lastMessage: r.last_message,
        lastMessageAt: r.last_message_at,
        unreadCount: r.unread_count,
      }));
      set({ conversations, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load conversations' });
    }
  },

  loadNotifications: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const d = getDatabase();
      const rows = d.getAllSync<any>(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
        [userId]
      );
      const notifications: Notification[] = rows.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        type: r.type,
        title: r.title,
        content: r.content,
        read: r.read === 1,
        createdAt: r.created_at,
        relatedId: r.related_id,
      }));
      set({ notifications, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load notifications' });
    }
  },

  loadCommunities: () => {
    try {
      set({ isLoading: true, error: null });
      const d = getDatabase();
      const rows = d.getAllSync<any>(
        'SELECT * FROM communities ORDER BY member_count DESC'
      );
      const communities: Community[] = rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        avatar: r.avatar,
        memberCount: r.member_count,
        isPrivate: r.is_private === 1,
        createdAt: r.created_at,
      }));
      set({ communities, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load communities' });
    }
  },

  fetchFeed: () => { get().loadFeed(); },
  fetchStories: () => { get().loadStories(); },
  fetchFriends: () => { get().loadFriends(); },
  fetchFriendRequests: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const d = getDatabase();
      const rows = d.getAllSync<any>(
        'SELECT * FROM friends WHERE friend_id = ? AND status = ?',
        [userId, 'pending']
      );
      const friendRequests: Friend[] = rows.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        friendId: r.friend_id,
        name: r.name,
        username: r.username,
        avatar: r.avatar,
        status: r.status,
        lastSeen: r.last_seen,
      }));
      set({ friendRequests });
    } catch { /* ignore */ }
  },
  sendFriendRequest: (userId) => {
    const myId = getUserId();
    if (!myId) return;
    try {
      const d = getDatabase();
      d.runSync(
        'INSERT INTO friends (id, user_id, friend_id, name, status) VALUES (?, ?, ?, ?, ?)',
        [Date.now().toString(), myId, userId, '', 'pending']
      );
    } catch { /* ignore */ }
  },
  acceptFriendRequest: (requestId) => {
    try {
      const d = getDatabase();
      d.runSync('UPDATE friends SET status = ? WHERE id = ?', ['accepted', requestId]);
      get().loadFriends();
    } catch { /* ignore */ }
  },
  fetchConversations: () => { get().loadConversations(); },
  fetchChatMessages: (conversationId) => {
    try {
      const d = getDatabase();
      const rows = d.getAllSync<any>(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC',
        [conversationId]
      );
      const chatMessages: Message[] = rows.map((r: any) => ({
        id: r.id,
        conversationId: r.conversation_id,
        senderId: r.sender_id,
        senderName: r.sender_name ?? '',
        content: r.content,
        sentAt: r.sent_at,
        readAt: r.read_at,
        type: 'text' as const,
      }));
      set({ chatMessages });
    } catch { /* ignore */ }
  },
  sendMessage: (conversationId, content) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const d = getDatabase();
      const id = Date.now().toString();
      d.runSync(
        'INSERT INTO messages (id, conversation_id, sender_id, content) VALUES (?, ?, ?, ?)',
        [id, conversationId, userId, content]
      );
      d.runSync(
        'UPDATE conversations SET last_message = ?, last_message_at = ? WHERE id = ?',
        [content, new Date().toISOString(), conversationId]
      );
      get().fetchChatMessages(conversationId);
    } catch { /* ignore */ }
  },
  fetchCommunities: () => { get().loadCommunities(); },
  createPost: (data) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const d = getDatabase();
      const id = Date.now().toString();
      d.runSync(
        'INSERT INTO posts (id, user_id, content, type) VALUES (?, ?, ?, ?)',
        [id, userId, data.content ?? '', data.type ?? 'general']
      );
      get().loadFeed();
    } catch { /* ignore */ }
  },
  likePost: (postId) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const d = getDatabase();
      const existing = d.getFirstSync<any>(
        'SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      if (existing) {
        d.runSync('DELETE FROM post_likes WHERE id = ?', [existing.id]);
        d.runSync('UPDATE posts SET likes = MAX(0, likes - 1) WHERE id = ?', [postId]);
      } else {
        d.runSync(
          'INSERT INTO post_likes (id, post_id, user_id) VALUES (?, ?, ?)',
          [Date.now().toString(), postId, userId]
        );
        d.runSync('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId]);
      }
      get().loadFeed();
    } catch { /* ignore */ }
  },
  createComment: (postId, content) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const d = getDatabase();
      d.runSync(
        'INSERT INTO post_comments (id, post_id, user_id, content) VALUES (?, ?, ?, ?)',
        [Date.now().toString(), postId, userId, content]
      );
      d.runSync('UPDATE posts SET comments = comments + 1 WHERE id = ?', [postId]);
      get().loadFeed();
    } catch { /* ignore */ }
  },
}));
