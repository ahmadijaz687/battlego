import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import {
  getConversations,
  getConversation,
  createConversation,
  addMessage,
  deleteConversation,
  togglePin,
} from '../services/aiService.js';
import {
  generateWorkoutPlan,
  findExerciseReplacement,
  calculateProgressiveOverload,
  getRecoveryRecommendations,
  generateNutritionPlan,
} from '../services/aiGenerationService.js';
import { CoachPersonalityId } from '../services/aiPersonality.js';
import { processUserMessage, getProactiveCoaching } from '../services/orchestrator.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { isLLMAvailable, getLLMInfo } from '../services/llmProvider.js';
import { emitAIMessage } from '../socket/index.js';

export const getConversationsHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }
    const conversations = await getConversations(userId);
    res.json(successResponse(conversations));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch conversations'));
  }
};

export const getConversationHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    const conversationId = req.params.conversationId as string;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }
    const conversation = await getConversation(userId, conversationId);
    res.json(successResponse(conversation));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch conversation'));
  }
};

export const createConversationHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }
    const { title } = req.body;
    const conversation = await createConversation(userId, title || 'New Conversation');
    res.status(201).json(successResponse(conversation, 'Conversation created'));
  } catch {
    res.status(500).json(errorResponse('Failed to create conversation'));
  }
};

export const addMessageHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }
    const conversationId = req.params.conversationId as string;
    const { role, content } = req.body;
    const message = await addMessage(conversationId, role, content);
    res.status(201).json(successResponse(message, 'Message added'));
  } catch {
    res.status(500).json(errorResponse('Failed to add message'));
  }
};

export const deleteConversationHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    const conversationId = req.params.conversationId as string;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }
    await deleteConversation(userId, conversationId);
    res.json(successResponse(null, 'Conversation deleted'));
  } catch {
    res.status(500).json(errorResponse('Failed to delete conversation'));
  }
};

export const togglePinHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    const conversationId = req.params.conversationId as string;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }
    const conversation = await togglePin(userId, conversationId);
    res.json(successResponse(conversation, 'Pin toggled'));
  } catch {
    res.status(500).json(errorResponse('Failed to toggle pin'));
  }
};

function getAIContext(req: Request) {
  const authReq = req as AuthenticatedRequest;
  return {
    userId: authReq.user?.id || '',
    userName: authReq.user?.email?.split('@')[0] || 'User',
    personalityId: (req.headers['x-coach-personality'] as CoachPersonalityId) || 'evidence-hypertrophy',
  };
}

export const generateWorkoutPlanHandler = async (req: Request, res: Response) => {
  try {
    const aiContext = getAIContext(req);
    const plan = await generateWorkoutPlan(req.body, aiContext);
    res.status(201).json(successResponse(plan, 'Workout plan generated'));
  } catch {
    res.status(500).json(errorResponse('Failed to generate workout plan'));
  }
};

export const findExerciseReplacementHandler = async (req: Request, res: Response) => {
  try {
    const aiContext = getAIContext(req);
    const replacements = await findExerciseReplacement(req.body, aiContext);
    res.json(successResponse(replacements));
  } catch {
    res.status(500).json(errorResponse('Failed to find replacement'));
  }
};

export const calculateProgressiveOverloadHandler = async (req: Request, res: Response) => {
  try {
    const aiContext = getAIContext(req);
    const result = await calculateProgressiveOverload(req.body, aiContext);
    res.json(successResponse(result));
  } catch {
    res.status(500).json(errorResponse('Failed to calculate overload'));
  }
};

export const getRecoveryRecommendationsHandler = async (req: Request, res: Response) => {
  try {
    const aiContext = getAIContext(req);
    const result = await getRecoveryRecommendations(req.body, aiContext);
    res.json(successResponse(result));
  } catch {
    res.status(500).json(errorResponse('Failed to get recovery recommendations'));
  }
};

export const generateNutritionPlanHandler = async (req: Request, res: Response) => {
  try {
    const aiContext = getAIContext(req);
    const result = await generateNutritionPlan(req.body, aiContext);
    res.status(201).json(successResponse(result, 'Nutrition plan generated'));
  } catch {
    res.status(500).json(errorResponse('Failed to generate nutrition plan'));
  }
};

export const chatReplyHandler = async (req: Request, res: Response) => {
  try {
    const { conversationId, content } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId || !conversationId || !content) {
      res.status(400).json(errorResponse('conversationId and content are required'));
      return;
    }

    const userMessage = await addMessage(conversationId, 'user', content);

    const personalityId = (req.headers['x-coach-personality'] as CoachPersonalityId) || 'evidence-hypertrophy';
    const orchestratorResult = await processUserMessage(userId, content, personalityId, conversationId);

    const reply = orchestratorResult.message;
    const assistantMessage = await addMessage(conversationId, 'assistant', reply);

    emitAIMessage(conversationId, {
      id: assistantMessage.id,
      conversationId,
      role: 'assistant',
      content: reply,
      timestamp: assistantMessage.timestamp?.toISOString(),
    });

    res.status(201).json(successResponse({
      userMessage,
      assistantMessage,
      intent: orchestratorResult.intent,
      suggestions: orchestratorResult.suggestions,
      proactiveTip: orchestratorResult.proactiveTip,
      analytics: orchestratorResult.analytics,
    }, 'Reply generated'));
  } catch {
    res.status(500).json(errorResponse('Failed to generate chat reply'));
  }
};

export const getPersonalitiesHandler = async (_req: Request, res: Response) => {
  try {
    const personalities = [
      { id: 'evidence-hypertrophy', name: 'Evidence-Based Hypertrophy Coach', description: 'Science-driven muscle building' },
      { id: 'sports-performance', name: 'Sports Performance Coach', description: 'Athletic development' },
      { id: 'strength', name: 'Strength Coach', description: 'Pure strength development' },
      { id: 'bodybuilding', name: 'Bodybuilding Coach', description: 'Physique-focused training' },
      { id: 'fat-loss', name: 'Fat Loss Coach', description: 'Sustainable fat loss' },
      { id: 'nutrition-specialist', name: 'Nutrition Specialist', description: 'Comprehensive nutrition coaching' },
      { id: 'powerlifting', name: 'Powerlifting Coach', description: 'Competition preparation' },
      { id: 'recovery', name: 'Recovery Coach', description: 'Optimize recovery' },
      { id: 'motivation', name: 'Motivation Coach', description: 'Mindset and habit building' },
    ];
    res.json(successResponse(personalities));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch personalities'));
  }
};

export const getProactiveCoachingHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }
    const suggestion = await getProactiveCoaching(userId);
    res.json(successResponse(suggestion));
  } catch {
    res.status(500).json(errorResponse('Failed to get proactive coaching'));
  }
};

export const getLLMStatusHandler = async (_req: Request, res: Response) => {
  try {
    const info = getLLMInfo();
    res.json(successResponse({
      available: isLLMAvailable(),
      provider: info.provider,
      model: info.model,
    }));
  } catch {
    res.status(500).json(errorResponse('Failed to get LLM status'));
  }
};
