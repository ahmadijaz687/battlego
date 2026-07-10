import { classifyIntent, extractEntities, IntentResult } from './intentClassifier.js';
import { searchKnowledge, KnowledgeArticle } from './knowledgeBase.js';
import { generateResponse, CoachContext } from './ruleEngine.js';
import { buildUserContext, formatContextForPrompt } from './aiContextBuilder.js';
import { getPersonality, CoachPersonalityId, buildSystemPrompt } from './aiPersonality.js';
import { checkForProactiveTriggers, ProactiveSuggestion } from './proactiveCoach.js';
import { generateWeeklySummary } from './analyticsSummarizer.js';
import { prisma } from './database.js';
import { isLLMAvailable, generateLLMResponse, getLLMInfo as _getLLMInfo } from './llmProvider.js';
import { logger } from '../utils/logger.js';

export interface OrchestratorResponse {
  message: string;
  intent: string;
  suggestions: string[];
  proactiveTip?: string;
  analytics?: string;
}

async function getSuggestionsForIntent(intent: string, _personalityId: CoachPersonalityId): Promise<string[]> {
  const suggestions: Record<string, string[]> = {
    workout: [
      'Track your next workout session',
      'View your training history',
      'Check exercise library',
    ],
    nutrition: [
      'Log your meals',
      'View nutrition history',
      'Check macro targets',
    ],
    recovery: [
      'Log your sleep hours',
      'Check recovery score',
      'View recovery tips',
    ],
    progress: [
      'View workout analytics',
      'Check personal records',
      'Generate progress report',
    ],
    planning: [
      'Design a new routine',
      'Adjust training split',
      'Set new goals',
    ],
    education: [
      'Browse knowledge base',
      'Read exercise guides',
      'Learn training principles',
    ],
    motivation: [
      'View your achievements',
      'Check your streaks',
      'Set a new goal',
    ],
    analytics: [
      'View weekly summary',
      'Check monthly report',
      'Analyze trends',
    ],
    scheduling: [
      'Plan your weekly schedule',
      'Set workout reminders',
      'Adjust training days',
    ],
    social: [
      'View friends activity',
      'Share your progress',
      'Join community challenge',
    ],
    battles: [
      'Start a battle',
      'View battle history',
      'Find opponents',
    ],
    general: [
      'I can help with workouts, nutrition, recovery, and more',
      'Tell me what you\'d like to focus on',
      'Check your latest stats',
    ],
    mixed: [
      'I can help with multiple areas',
      'Let\'s prioritize what\'s most important',
    ],
  };

  return suggestions[intent] || suggestions.general;
}

export async function processUserMessage(
  userId: string,
  message: string,
  personalityId?: string,
  conversationId?: string
): Promise<OrchestratorResponse> {
  const validPersonalityId = (personalityId as CoachPersonalityId) || 'evidence-hypertrophy';
  const personality = getPersonality(validPersonalityId);

  const intentResult: IntentResult = classifyIntent(message);
  const intent = intentResult.primary;
  const entities = extractEntities(message, intent);

  let knowledgeArticles: KnowledgeArticle[] = [];
  if (intent === 'education') {
    knowledgeArticles = await searchKnowledge(message);
  }

  const userContext = await buildUserContext(userId);

  const coachContext: CoachContext = {
    userId,
    userName: userContext.profile?.name || 'User',
    personalityId: validPersonalityId,
    message,
    userGoals: userContext.goals,
    recentWorkouts: userContext.recentWorkouts.length > 0
      ? userContext.recentWorkouts.slice(0, 3).map(w => `${w.name} (${w.type}, ${w.duration}min)`).join(', ')
      : 'Not available',
    workoutStats: `${userContext.workoutStats.totalWorkouts} workouts, ${userContext.workoutStats.weeklyFrequency}x/week average`,
    nutritionSummary: `~${userContext.nutritionSummary.averageDailyCalories} calories, ${userContext.nutritionSummary.averageProtein}g protein daily`,
    recoveryData: `Sleep: ~7h average`,
    weightTrend: userContext.weightTrend.length > 0
      ? `Last reading: ${userContext.weightTrend[0]?.weight} ${userContext.weightTrend[0]?.unit}`
      : 'Not available',
    intent,
    entities,
  };

  let responseMessage: string;
  if (isLLMAvailable()) {
    const systemPrompt = buildSystemPrompt(validPersonalityId, userContext.profile?.name || 'User',
      formatContextForPrompt(userContext));

    let history: Array<{ role: 'user' | 'assistant'; content: string }> | undefined;
    if (conversationId) {
      try {
        const recentMessages = await prisma.aIMessage.findMany({
          where: { conversationId },
          orderBy: { timestamp: 'desc' },
          take: 10,
          select: { role: true, content: true },
        });
        history = recentMessages.reverse().map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));
      } catch (err) { logger.warn('Failed to fetch conversation history', { error: err instanceof Error ? err.message : String(err) }); }
    }

    responseMessage = await generateLLMResponse(coachContext, systemPrompt, history);
  } else if (intent === 'education' && knowledgeArticles.length > 0) {
    const article = knowledgeArticles[0];
    responseMessage = `${personality.systemPrompt.split('\n')[0]}\n\n` +
      `**${article.title}**\n${article.summary}\n\n${article.content}`;
  } else {
    responseMessage = generateResponse(coachContext);
  }

  if (intent === 'analytics' || intent === 'progress') {
    try {
      const analytics = await generateWeeklySummary(userId);
      responseMessage += '\n\n' + analytics;
      return {
        message: responseMessage,
        intent,
        suggestions: await getSuggestionsForIntent(intent, validPersonalityId),
        analytics,
      };
    } catch (err) { logger.warn('Failed to generate weekly summary', { error: err instanceof Error ? err.message : String(err) }); }
  }

  if (conversationId) {
    try {
      const _existingMessages = await prisma.aIMessage.findMany({
        where: { conversationId },
        orderBy: { timestamp: 'desc' },
        take: 2,
        select: { role: true, content: true },
      });

      const suggestions = await getSuggestionsForIntent(intent, validPersonalityId);

      return {
        message: responseMessage,
        intent,
        suggestions,
        proactiveTip: undefined,
      };
    } catch (err) { logger.warn('Failed to fetch conversation messages', { error: err instanceof Error ? err.message : String(err) }); }
  }

  const suggestions = await getSuggestionsForIntent(intent, validPersonalityId);

  let proactiveTip: string | undefined;
  try {
    const proactive = await checkForProactiveTriggers(userId);
    if (proactive && proactive.priority !== 'low') {
      proactiveTip = proactive.message;
    }
  } catch (err) { logger.warn('Failed to check proactive triggers', { error: err instanceof Error ? err.message : String(err) }); }

  return {
    message: responseMessage,
    intent,
    suggestions,
    proactiveTip,
  };
}

export async function getProactiveCoaching(userId: string): Promise<ProactiveSuggestion | null> {
  try {
    return await checkForProactiveTriggers(userId);
  } catch (err) {
    logger.warn('Proactive coaching check failed', { error: err instanceof Error ? err.message : String(err) });
    return null;
  }
}
