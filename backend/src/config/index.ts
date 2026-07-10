/**
 * Centralized, externalized configuration.
 *
 * All runtime configuration is sourced from environment variables so the
 * deployment stack (Docker, EAS, CI) can inject values without code changes.
 * Defaults are provided for local development only; production must set the
 * required secrets explicitly (see validateEnvironment()).
 */

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
}

function int(value: string | undefined, fallback: number): number {
  const n = value !== undefined ? parseInt(value, 10) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function float(value: string | undefined, fallback: number): number {
  const n = value !== undefined ? parseFloat(value) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

export const config = {
  server: {
    port: int(process.env.PORT, 5000),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:8081',
    logLevel: process.env.LOG_LEVEL || 'dev',
    logFormat: process.env.LOG_FORMAT || 'combined',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d',
    sessionSecret: process.env.SESSION_SECRET || process.env.JWT_SECRET || '',
  },
  database: {
    url: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/fitnessbattle',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  rateLimit: {
    windowMs: int(process.env.RATE_LIMIT_WINDOW_MS, 900000),
    max: int(process.env.RATE_LIMIT_MAX, 100),
  },
  ai: {
    provider: (process.env.AI_PROVIDER || 'openai') as 'openai' | 'anthropic',
    apiKey: process.env.AI_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
    maxTokens: int(process.env.AI_MAX_TOKENS, 1024),
    temperature: float(process.env.AI_TEMPERATURE, 0.7),
    maxContextMessages: int(process.env.AI_MAX_CONTEXT_MESSAGES, 20),
    enableRag: bool(process.env.AI_ENABLE_RAG, true),
    rateLimitPerMinute: int(process.env.AI_RATE_LIMIT, 30),
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
  },
  client: {
    apiUrl: process.env.API_URL || 'http://localhost:5000',
  },
} as const;

export type AppConfig = typeof config;