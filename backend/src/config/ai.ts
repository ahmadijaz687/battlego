export const aiConfig = {
  provider: (process.env.AI_PROVIDER || 'openai') as 'openai' | 'anthropic',
  apiKey: process.env.AI_API_KEY || '',
  model: process.env.AI_MODEL || 'gpt-4o-mini',
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1024', 10),
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  maxContextMessages: parseInt(process.env.AI_MAX_CONTEXT_MESSAGES || '20', 10),
  enableRag: process.env.AI_ENABLE_RAG !== 'false',
  rateLimitPerMinute: parseInt(process.env.AI_RATE_LIMIT || '30', 10),
};
