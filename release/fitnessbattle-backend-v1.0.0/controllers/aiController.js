import { getConversations, getConversation, createConversation, addMessage, deleteConversation, togglePin, } from '../services/aiService.js';
import { generateWorkoutPlan, findExerciseReplacement, calculateProgressiveOverload, getRecoveryRecommendations, generateNutritionPlan, generateChatReply, } from '../services/aiGenerationService.js';
export const getConversationsHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const conversations = await getConversations(userId);
        res.json(conversations);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};
export const getConversationHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        const conversationId = Array.isArray(req.params.conversationId)
            ? req.params.conversationId[0]
            : req.params.conversationId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const conversation = await getConversation(userId, conversationId);
        res.json(conversation);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
};
export const createConversationHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { title } = req.body;
        const conversation = await createConversation(userId, title || 'New Conversation');
        res.status(201).json(conversation);
    }
    catch {
        res.status(500).json({ error: 'Failed to create conversation' });
    }
};
export const addMessageHandler = async (req, res) => {
    try {
        const conversationId = Array.isArray(req.params.conversationId)
            ? req.params.conversationId[0]
            : req.params.conversationId;
        const { role, content } = req.body;
        const message = await addMessage(conversationId, role, content);
        res.status(201).json(message);
    }
    catch {
        res.status(500).json({ error: 'Failed to add message' });
    }
};
export const deleteConversationHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        const conversationId = Array.isArray(req.params.conversationId)
            ? req.params.conversationId[0]
            : req.params.conversationId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await deleteConversation(userId, conversationId);
        res.json({ message: 'Conversation deleted' });
    }
    catch {
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
};
export const togglePinHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        const conversationId = Array.isArray(req.params.conversationId)
            ? req.params.conversationId[0]
            : req.params.conversationId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const conversation = await togglePin(userId, conversationId);
        res.json(conversation);
    }
    catch {
        res.status(500).json({ error: 'Failed to toggle pin' });
    }
};
export const generateWorkoutPlanHandler = async (req, res) => {
    try {
        const plan = generateWorkoutPlan(req.body);
        res.status(201).json(plan);
    }
    catch {
        res.status(500).json({ error: 'Failed to generate workout plan' });
    }
};
export const findExerciseReplacementHandler = async (req, res) => {
    try {
        const replacements = findExerciseReplacement(req.body);
        res.json(replacements);
    }
    catch {
        res.status(500).json({ error: 'Failed to find replacement' });
    }
};
export const calculateProgressiveOverloadHandler = async (req, res) => {
    try {
        const result = calculateProgressiveOverload(req.body);
        res.json(result);
    }
    catch {
        res.status(500).json({ error: 'Failed to calculate overload' });
    }
};
export const getRecoveryRecommendationsHandler = async (req, res) => {
    try {
        const result = getRecoveryRecommendations(req.body);
        res.json(result);
    }
    catch {
        res.status(500).json({ error: 'Failed to get recovery recommendations' });
    }
};
export const generateNutritionPlanHandler = async (req, res) => {
    try {
        const result = generateNutritionPlan(req.body);
        res.status(201).json(result);
    }
    catch {
        res.status(500).json({ error: 'Failed to generate nutrition plan' });
    }
};
export const chatReplyHandler = async (req, res) => {
    try {
        const { conversationId, content, role = 'user' } = req.body;
        const normalized = typeof content === 'string' ? content.trim() : '';
        if (!conversationId || !normalized) {
            return res.status(400).json({ error: 'conversationId and content are required' });
        }
        const userMessage = await addMessage(conversationId, role, normalized);
        const reply = generateChatReply(normalized);
        const assistantMessage = await addMessage(conversationId, 'assistant', reply);
        res.status(201).json({ userMessage, assistantMessage });
    }
    catch {
        res.status(500).json({ error: 'Failed to generate chat reply' });
    }
};
