import { jest } from '@jest/globals';

const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.unstable_mockModule('../src/utils/logger.js', () => ({ logger: mockLogger }));

describe('config externalization', () => {
  const ORIGINAL = { ...process.env };

  afterEach(() => {
    process.env = { ...ORIGINAL };
    jest.resetModules();
  });

  it('provides sensible defaults when env vars are absent', async () => {
    delete process.env.PORT;
    delete process.env.HOST;
    delete process.env.NODE_ENV;
    delete process.env.CORS_ORIGIN;
    delete process.env.REDIS_URL;
    delete process.env.RATE_LIMIT_WINDOW_MS;
    delete process.env.RATE_LIMIT_MAX;
    delete process.env.AI_PROVIDER;
    delete process.env.AI_ENABLE_RAG;

    const { config } = await import('../src/config/index.js');
    expect(config.server.port).toBe(5000);
    expect(config.server.host).toBe('0.0.0.0');
    expect(config.server.nodeEnv).toBe('development');
    expect(config.redis.url).toBe('redis://localhost:6379');
    expect(config.rateLimit.windowMs).toBe(900000);
    expect(config.rateLimit.max).toBe(100);
    expect(config.ai.provider).toBe('openai');
    expect(config.ai.enableRag).toBe(true);
  });

  it('parses integer and float env vars', async () => {
    process.env.PORT = '8080';
    process.env.RATE_LIMIT_MAX = '200';
    process.env.AI_TEMPERATURE = '0.9';
    process.env.AI_MAX_TOKENS = '2048';

    const { config } = await import('../src/config/index.js');
    expect(config.server.port).toBe(8080);
    expect(config.rateLimit.max).toBe(200);
    expect(config.ai.temperature).toBeCloseTo(0.9);
    expect(config.ai.maxTokens).toBe(2048);
  });

  it('treats AI_ENABLE_RAG=false as disabled', async () => {
    process.env.AI_ENABLE_RAG = 'false';
    const { config } = await import('../src/config/index.js');
    expect(config.ai.enableRag).toBe(false);
  });

  it('falls back to JWT_SECRET for session secret', async () => {
    process.env.JWT_SECRET = 'abc';
    delete process.env.SESSION_SECRET;
    const { config } = await import('../src/config/index.js');
    expect(config.auth.sessionSecret).toBe('abc');
  });
});