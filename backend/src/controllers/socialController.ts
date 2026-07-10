import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import {
  getFeed,
  createPost,
  getStories,
  createStory,
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  getMessages,
  sendMessage,
  getCommunities,
  createCommunity,
  getNotifications,
  markNotificationRead,
  acceptFriendRequest,
  declineFriendRequest,
  updatePost,
  deletePost,
  deleteStory,
  joinCommunity,
  leaveCommunity,
  deleteNotification,
  likePost,
  createComment,
  listConversations,
  sendMessageToConversation,
} from '../services/socialService.js';
import { successResponse } from '../utils/response.js';

export const getFeedHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const feed = await getFeed(userId);
  res.json(successResponse(feed));
};

export const createPostHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const post = await createPost(userId, req.body);
  res.status(201).json(successResponse(post, 'Post created'));
};

export const getStoriesHandler = async (_req: Request, res: Response) => {
  const stories = await getStories();
  res.json(successResponse(stories));
};

export const createStoryHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const story = await createStory(userId, req.body);
  res.status(201).json(successResponse(story, 'Story created'));
};

export const getFriendsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const friends = await getFriends(userId);
  res.json(successResponse(friends));
};

export const getFriendRequestsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const requests = await getFriendRequests(userId);
  res.json(successResponse(requests));
};

export const sendFriendRequestHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const request = await sendFriendRequest(userId, req.body);
  res.status(201).json(successResponse(request, 'Friend request sent'));
};

export const getMessagesHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const conversationId = req.params.conversationId as string;
  const messages = await getMessages(userId, conversationId);
  res.json(successResponse(messages));
};

export const sendMessageHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const message = await sendMessage({ ...req.body, senderId: userId });
  res.status(201).json(successResponse(message, 'Message sent'));
};

export const getCommunitiesHandler = async (_req: Request, res: Response) => {
  const communities = await getCommunities();
  res.json(successResponse(communities));
};

export const createCommunityHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const community = await createCommunity(userId, req.body);
  res.status(201).json(successResponse(community, 'Community created'));
};

export const getNotificationsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const notifications = await getNotifications(userId);
  res.json(successResponse(notifications));
};

export const markNotificationReadHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const id = req.params.id as string;
  const notification = await markNotificationRead(userId, id);
  res.json(successResponse(notification, 'Notification marked as read'));
};

export const acceptFriendRequestHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const requestId = req.params.requestId as string;
  const result = await acceptFriendRequest(userId, requestId);
  res.json(successResponse(result, 'Friend request accepted'));
};

export const declineFriendRequestHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const requestId = req.params.requestId as string;
  const result = await declineFriendRequest(userId, requestId);
  res.json(successResponse(result, 'Friend request declined'));
};

export const updatePostHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const postId = req.params.postId as string;
  const post = await updatePost(userId, postId, req.body);
  res.json(successResponse(post, 'Post updated'));
};

export const deletePostHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const postId = req.params.postId as string;
  await deletePost(userId, postId);
  res.json(successResponse(null, 'Post deleted'));
};

export const deleteStoryHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const storyId = req.params.storyId as string;
  await deleteStory(userId, storyId);
  res.json(successResponse(null, 'Story deleted'));
};

export const joinCommunityHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const communityId = req.params.communityId as string;
  const { userName } = req.body;
  const result = await joinCommunity(userId, communityId, userName);
  res.json(successResponse(result, 'Joined community'));
};

export const leaveCommunityHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const communityId = req.params.communityId as string;
  await leaveCommunity(userId, communityId);
  res.json(successResponse(null, 'Left community'));
};

export const likePostHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const postId = req.params.postId as string;
  const result = await likePost(userId, postId);
  res.json(successResponse(result, result.liked ? 'Post liked' : 'Post unliked'));
};

export const createCommentHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const postId = req.params.postId as string;
  const comment = await createComment(userId, postId, req.body);
  res.status(201).json(successResponse(comment, 'Comment added'));
};

export const listConversationsHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const conversations = await listConversations(userId);
  res.json(successResponse(conversations));
};

export const sendMessageToConversationHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const conversationId = req.params.conversationId as string;
  const message = await sendMessageToConversation(userId, conversationId, req.body);
  res.status(201).json(successResponse(message, 'Message sent'));
};

export const deleteNotificationHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const id = req.params.id as string;
  await deleteNotification(userId, id);
  res.json(successResponse(null, 'Notification deleted'));
};
