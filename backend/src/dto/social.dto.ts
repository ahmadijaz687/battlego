export interface CreatePostDTO {
  content: string;
  images?: string[];
  workoutId?: string;
  mealId?: string;
  type: 'workout' | 'nutrition' | 'transformation' | 'achievement' | 'battle' | 'general';
  userName: string;
  userAvatar?: string;
}

export interface UpdatePostDTO {
  content?: string;
  images?: string[];
  type?: 'workout' | 'nutrition' | 'transformation' | 'achievement' | 'battle' | 'general';
}

export interface CreateStoryDTO {
  image?: string;
  videoUrl?: string;
  duration?: number;
  userName: string;
}

export interface SendMessageDTO {
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  mediaUrl?: string;
  type: 'text' | 'image' | 'voice';
}

export interface FriendRequestDTO {
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
}

export interface CreateCommunityDTO {
  name: string;
  description: string;
  avatar?: string;
  isPrivate: boolean;
  userName: string;
}
