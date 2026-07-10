import { Router } from 'express';
import {
  getConversationsHandler,
  getConversationHandler,
  createConversationHandler,
  addMessageHandler,
  deleteConversationHandler,
  togglePinHandler,
  generateWorkoutPlanHandler,
  findExerciseReplacementHandler,
  calculateProgressiveOverloadHandler,
  getRecoveryRecommendationsHandler,
  generateNutritionPlanHandler,
  chatReplyHandler,
  getPersonalitiesHandler,
  getProactiveCoachingHandler,
  getLLMStatusHandler,
} from '../controllers/aiController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate, createConversationSchema, addMessageSchema, chatReplySchema, aiWorkoutSchema, aiReplacementSchema, aiOverloadSchema, aiRecoverySchema, aiNutritionSchema } from '../middlewares/validation.js';

const router = Router();

router.get('/personalities', requireAuth, getPersonalitiesHandler);
router.get('/conversations', requireAuth, getConversationsHandler);
router.get('/conversations/:conversationId', requireAuth, getConversationHandler);
router.post('/conversations', requireAuth, validate(createConversationSchema), createConversationHandler);
router.post('/conversations/:conversationId/messages', requireAuth, validate(addMessageSchema), addMessageHandler);
router.delete('/conversations/:conversationId', requireAuth, deleteConversationHandler);
router.patch('/conversations/:conversationId/pin', requireAuth, togglePinHandler);
router.post('/workout', requireAuth, validate(aiWorkoutSchema), generateWorkoutPlanHandler);
router.post('/replacement', requireAuth, validate(aiReplacementSchema), findExerciseReplacementHandler);
router.post('/overload', requireAuth, validate(aiOverloadSchema), calculateProgressiveOverloadHandler);
router.post('/recovery', requireAuth, validate(aiRecoverySchema), getRecoveryRecommendationsHandler);
router.post('/nutrition', requireAuth, validate(aiNutritionSchema), generateNutritionPlanHandler);
router.post('/chat', requireAuth, validate(chatReplySchema), chatReplyHandler);
router.get('/proactive', requireAuth, getProactiveCoachingHandler);
router.get('/llm-status', requireAuth, getLLMStatusHandler);

export default router;