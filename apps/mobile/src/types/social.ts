export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  workoutId?: string;
  mealId?: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  createdAt: string;
  type: 'workout' | 'nutrition' | 'transformation' | 'achievement' | 'battle' | 'general';
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  image?: string;
  videoUrl?: string;
  viewed: boolean;
  duration: number;
  expiresAt: string;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  name: string;
  username: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
}

export interface FriendRequest {
  id: string;
  userId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  mediaUrl?: string;
  sentAt: string;
  readAt?: string;
  deliveredAt?: string;
  type: 'text' | 'image' | 'voice';
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  memberCount: number;
  isPrivate: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'friend_request' | 'battle_invite' | 'community' | 'story_reaction' | 'message';
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface NotificationPreferences {
  workout: boolean;
  meal: boolean;
  hydration: boolean;
  battle: boolean;
  friendRequest: boolean;
  message: boolean;
  achievement: boolean;
  system: boolean;
  email: boolean;
  push: boolean;
  sound: boolean;
  vibration: boolean;
}