export interface PostData {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  content: string;
  media: string[];
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
}

export interface StoryData {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  duration: number;
  expiresAt: string;
  createdAt: string;
  viewed: boolean;
}

export interface ConversationData {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string | null;
  }[];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export interface FriendData {
  id: string;
  name: string;
  avatar: string | null;
  bio?: string;
  isOnline: boolean;
  lastSeen: string;
  mutualFriends: number;
  isFriend: boolean;
  requestPending: boolean;
  requestReceived: boolean;
}
