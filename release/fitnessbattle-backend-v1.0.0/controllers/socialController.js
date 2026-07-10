import { getFeed, createPost, getStories, createStory, getFriends, getFriendRequests, sendFriendRequest, getMessages, sendMessage, getCommunities, createCommunity, getNotifications, markNotificationRead, } from '../services/socialService.js';
export const getFeedHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const feed = await getFeed(userId);
        res.json(feed);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch feed' });
    }
};
export const createPostHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const post = await createPost(userId, req.body);
        res.status(201).json(post);
    }
    catch {
        res.status(500).json({ error: 'Failed to create post' });
    }
};
export const getStoriesHandler = async (_req, res) => {
    try {
        const stories = await getStories();
        res.json(stories);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
};
export const createStoryHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const story = await createStory(userId, req.body);
        res.status(201).json(story);
    }
    catch {
        res.status(500).json({ error: 'Failed to create story' });
    }
};
export const getFriendsHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const friends = await getFriends(userId);
        res.json(friends);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
};
export const getFriendRequestsHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const requests = await getFriendRequests(userId);
        res.json(requests);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch friend requests' });
    }
};
export const sendFriendRequestHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const request = await sendFriendRequest(userId, req.body);
        res.status(201).json(request);
    }
    catch {
        res.status(500).json({ error: 'Failed to send friend request' });
    }
};
export const getMessagesHandler = async (req, res) => {
    try {
        const conversationId = Array.isArray(req.params.conversationId)
            ? req.params.conversationId[0]
            : req.params.conversationId;
        const messages = await getMessages(conversationId);
        res.json(messages);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};
export const sendMessageHandler = async (req, res) => {
    try {
        const message = await sendMessage(req.body);
        res.status(201).json(message);
    }
    catch {
        res.status(500).json({ error: 'Failed to send message' });
    }
};
export const getCommunitiesHandler = async (_req, res) => {
    try {
        const communities = await getCommunities();
        res.json(communities);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch communities' });
    }
};
export const createCommunityHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const community = await createCommunity(userId, req.body);
        res.status(201).json(community);
    }
    catch {
        res.status(500).json({ error: 'Failed to create community' });
    }
};
export const getNotificationsHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const notifications = await getNotifications(userId);
        res.json(notifications);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};
export const markNotificationReadHandler = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const notification = await markNotificationRead(id);
        res.json(notification);
    }
    catch {
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};
