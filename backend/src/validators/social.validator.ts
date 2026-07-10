import { z } from 'zod';
import { validate } from '../middlewares/validation.js';

export const postSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  images: z.array(z.string()).optional(),
  workoutId: z.string().optional(),
  mealId: z.string().optional(),
  type: z.enum(['workout', 'nutrition', 'transformation', 'achievement', 'battle', 'general']),
  userName: z.string().min(1).max(255).trim(),
  userAvatar: z.string().max(500).optional(),
});

export const updatePostSchema = postSchema.partial().omit({ userName: true });

export const storySchema = z.object({
  image: z.string().max(500).optional(),
  videoUrl: z.string().max(500).optional(),
  duration: z.number().int().positive().default(5000),
  userName: z.string().min(1).max(255).trim(),
});

export const messageSchema = z.object({
  conversationId: z.string().uuid(),
  senderId: z.string().uuid(),
  senderName: z.string().min(1).max(255).trim(),
  content: z.string().min(1, 'Message content is required'),
  mediaUrl: z.string().max(500).optional(),
  type: z.enum(['text', 'image', 'voice']).default('text'),
});

export const friendRequestSchema = z.object({
  fromUserId: z.string().uuid(),
  fromUserName: z.string().min(1).max(255).trim(),
  fromUserAvatar: z.string().max(500).optional(),
});

export const communitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  description: z.string().min(1, 'Description is required'),
  avatar: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false),
  userName: z.string().min(1).max(255).trim(),
});

export const joinCommunitySchema = z.object({
  userName: z.string().min(1).max(255).trim(),
});

export const validatePost = validate(postSchema);
export const validateUpdatePost = validate(updatePostSchema);
export const validateStory = validate(storySchema);
export const validateMessage = validate(messageSchema);
export const validateFriendRequest = validate(friendRequestSchema);
export const validateCommunity = validate(communitySchema);
export const validateJoinCommunity = validate(joinCommunitySchema);
