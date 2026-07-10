import { Router } from 'express';
import {
  getFeedHandler,
  createPostHandler,
  getStoriesHandler,
  createStoryHandler,
  getFriendsHandler,
  getFriendRequestsHandler,
  sendFriendRequestHandler,
  acceptFriendRequestHandler,
  declineFriendRequestHandler,
  getMessagesHandler,
  sendMessageHandler,
  listConversationsHandler,
  sendMessageToConversationHandler,
  getCommunitiesHandler,
  createCommunityHandler,
  joinCommunityHandler,
  leaveCommunityHandler,
  getNotificationsHandler,
  markNotificationReadHandler,
  deleteNotificationHandler,
  updatePostHandler,
  deletePostHandler,
  deleteStoryHandler,
  likePostHandler,
  createCommentHandler,
} from '../controllers/socialController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate, createPostSchema, createStorySchema, sendFriendRequestSchema, sendMessageSchema, createCommunitySchema, joinCommunitySchema } from '../middlewares/validation.js';

const router = Router();

router.get('/feed', requireAuth, getFeedHandler);
router.post('/posts', requireAuth, validate(createPostSchema), createPostHandler);
router.put('/posts/:postId', requireAuth, updatePostHandler);
router.delete('/posts/:postId', requireAuth, deletePostHandler);
router.post('/posts/:postId/like', requireAuth, likePostHandler);
router.post('/posts/:postId/comment', requireAuth, createCommentHandler);
router.get('/stories', getStoriesHandler);
router.post('/stories', requireAuth, validate(createStorySchema), createStoryHandler);
router.delete('/stories/:storyId', requireAuth, deleteStoryHandler);
router.get('/friends', requireAuth, getFriendsHandler);
router.get('/friend-requests', requireAuth, getFriendRequestsHandler);
router.post('/friend-requests', requireAuth, validate(sendFriendRequestSchema), sendFriendRequestHandler);
router.put('/friend-requests/:requestId/accept', requireAuth, acceptFriendRequestHandler);
router.put('/friend-requests/:requestId/decline', requireAuth, declineFriendRequestHandler);
router.get('/messages', requireAuth, listConversationsHandler);
router.get('/messages/:conversationId', requireAuth, getMessagesHandler);
router.post('/messages', requireAuth, validate(sendMessageSchema), sendMessageHandler);
router.post('/messages/:conversationId', requireAuth, validate(sendMessageSchema), sendMessageToConversationHandler);
router.get('/communities', getCommunitiesHandler);
router.post('/communities', requireAuth, validate(createCommunitySchema), createCommunityHandler);
router.post('/communities/:communityId/join', requireAuth, validate(joinCommunitySchema), joinCommunityHandler);
router.post('/communities/:communityId/leave', requireAuth, leaveCommunityHandler);
router.get('/notifications', requireAuth, getNotificationsHandler);
router.patch('/notifications/:id/read', requireAuth, markNotificationReadHandler);
router.delete('/notifications/:id', requireAuth, deleteNotificationHandler);

export default router;
