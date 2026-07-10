import { getPersonality, getAllPersonalities, buildSystemPrompt } from '../src/services/aiPersonality.js';

describe('AI Personality', () => {
  describe('getPersonality', () => {
    it('should return a valid personality', () => {
      const p = getPersonality('evidence-hypertrophy');
      expect(p).toBeDefined();
      expect(p.id).toBe('evidence-hypertrophy');
      expect(p.name).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.systemPrompt).toBeTruthy();
    });

    it('should default to evidence-hypertrophy for unknown id', () => {
      const p = getPersonality('nonexistent' as any);
      expect(p.id).toBe('evidence-hypertrophy');
    });

    it('should return all personality types', () => {
      const ids = [
        'evidence-hypertrophy', 'sports-performance', 'strength',
        'bodybuilding', 'fat-loss', 'nutrition-specialist',
        'powerlifting', 'recovery', 'motivation',
      ] as const;

      for (const id of ids) {
        const p = getPersonality(id);
        expect(p.id).toBe(id);
        expect(p.systemPrompt.length).toBeGreaterThan(50);
      }
    });
  });

  describe('getAllPersonalities', () => {
    it('should return all 9 personalities', () => {
      const all = getAllPersonalities();
      expect(all).toHaveLength(9);
    });

    it('each personality should have required fields', () => {
      const all = getAllPersonalities();
      for (const p of all) {
        expect(p.id).toBeTruthy();
        expect(p.name).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(p.systemPrompt).toBeTruthy();
      }
    });
  });

  describe('buildSystemPrompt', () => {
    it('should build a system prompt with personality and user info', () => {
      const prompt = buildSystemPrompt('evidence-hypertrophy', 'John', '50 workouts, 4x/week');
      expect(prompt).toContain('John');
      expect(prompt).toContain('50 workouts');
      expect(prompt.length).toBeGreaterThan(100);
    });

    it('should include safety rules', () => {
      const prompt = buildSystemPrompt('strength', 'User', '');
      expect(prompt.toLowerCase()).toMatch(/medical|professional|safety/);
    });

    it('should work with all personalities', () => {
      const ids = [
        'evidence-hypertrophy', 'sports-performance', 'strength',
        'bodybuilding', 'fat-loss', 'nutrition-specialist',
        'powerlifting', 'recovery', 'motivation',
      ] as const;

      for (const id of ids) {
        const prompt = buildSystemPrompt(id, 'User', 'context');
        expect(prompt).toBeTruthy();
        expect(prompt.length).toBeGreaterThan(200);
      }
    });
  });
});
