import { CoachContext, generateResponse } from './ruleEngine.js';
import { logger } from '../utils/logger.js';

export type LLMProvider = 'openai' | 'anthropic' | 'rule';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function getProvider(): LLMProvider {
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return 'rule';
}

function getModel(): string {
  const provider = getProvider();
  if (provider === 'anthropic') return process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
  if (provider === 'openai') return process.env.OPENAI_MODEL || 'gpt-4o';
  return 'rule';
}

export function isLLMAvailable(): boolean {
  return getProvider() !== 'rule';
}

export function getLLMInfo(): { provider: LLMProvider; model: string } {
  const provider = getProvider();
  return { provider, model: provider === 'rule' ? 'rule-engine' : getModel() };
}

async function callOpenAI(messages: LLMMessage[], maxTokens = 1024): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = getModel();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${error}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content || '';
}

async function callAnthropic(messages: LLMMessage[], maxTokens = 1024): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = getModel();

  const systemMsg = messages.find(m => m.role === 'system');
  const conversationMsgs = messages.filter(m => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemMsg?.content || '',
      messages: conversationMsgs.map(m => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${error}`);
  }

  const data = await response.json() as { content: Array<{ type: string; text: string }> };
  return data.content[0]?.text || '';
}

export async function generateLLMResponse(
  context: CoachContext,
  systemPrompt: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<string> {
  const provider = getProvider();

  if (provider === 'rule') {
    return generateResponse(context);
  }

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
  ];

  if (conversationHistory) {
    for (const msg of conversationHistory.slice(-10)) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: 'user', content: context.message });

  try {
    let response: string;
    if (provider === 'anthropic') {
      response = await callAnthropic(messages);
    } else {
      response = await callOpenAI(messages);
    }
    return response || generateResponse(context);
  } catch (error) {
    logger.warn(`LLM call failed, falling back to rule engine: ${(error as Error).message}`);
    return generateResponse(context);
  }
}
