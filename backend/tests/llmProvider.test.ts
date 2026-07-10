import { isLLMAvailable, getLLMInfo } from '../src/services/llmProvider.js';

describe('LLM Provider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('isLLMAvailable', () => {
    it('should return false when no API keys are set', () => {
      delete process.env.OPENAI_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;
      expect(isLLMAvailable()).toBe(false);
    });

    it('should return true when OPENAI_API_KEY is set', () => {
      process.env.OPENAI_API_KEY = 'test-key';
      delete process.env.ANTHROPIC_API_KEY;
      expect(isLLMAvailable()).toBe(true);
    });

    it('should return true when ANTHROPIC_API_KEY is set', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      delete process.env.OPENAI_API_KEY;
      expect(isLLMAvailable()).toBe(true);
    });

    it('should prefer Anthropic over OpenAI', () => {
      process.env.OPENAI_API_KEY = 'openai-key';
      process.env.ANTHROPIC_API_KEY = 'anthropic-key';
      expect(isLLMAvailable()).toBe(true);
      const info = getLLMInfo();
      expect(info.provider).toBe('anthropic');
    });
  });

  describe('getLLMInfo', () => {
    it('should return rule provider when no keys set', () => {
      delete process.env.OPENAI_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;
      const info = getLLMInfo();
      expect(info.provider).toBe('rule');
      expect(info.model).toBe('rule-engine');
    });

    it('should return openai provider with default model', () => {
      process.env.OPENAI_API_KEY = 'test-key';
      delete process.env.ANTHROPIC_API_KEY;
      delete process.env.OPENAI_MODEL;
      const info = getLLMInfo();
      expect(info.provider).toBe('openai');
      expect(info.model).toBe('gpt-4o');
    });

    it('should use custom OPENAI_MODEL when set', () => {
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.OPENAI_MODEL = 'gpt-4o-mini';
      delete process.env.ANTHROPIC_API_KEY;
      const info = getLLMInfo();
      expect(info.model).toBe('gpt-4o-mini');
    });

    it('should return anthropic provider with default model', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      delete process.env.OPENAI_API_KEY;
      delete process.env.ANTHROPIC_MODEL;
      const info = getLLMInfo();
      expect(info.provider).toBe('anthropic');
      expect(info.model).toBe('claude-sonnet-4-20250514');
    });

    it('should use custom ANTHROPIC_MODEL when set', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.ANTHROPIC_MODEL = 'claude-3-haiku-20240307';
      delete process.env.OPENAI_API_KEY;
      const info = getLLMInfo();
      expect(info.model).toBe('claude-3-haiku-20240307');
    });
  });
});
