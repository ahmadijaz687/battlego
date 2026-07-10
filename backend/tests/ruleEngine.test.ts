import { generateResponse, CoachContext } from '../src/services/ruleEngine.js';
import { CoachPersonalityId } from '../src/services/aiPersonality.js';

function makeContext(overrides: Partial<CoachContext> = {}): CoachContext {
  return {
    userId: 'test-user',
    userName: 'TestUser',
    personalityId: 'evidence-hypertrophy',
    message: 'test message',
    ...overrides,
  };
}

describe('Rule Engine', () => {
  describe('generateResponse', () => {
    it('should generate a workout response', () => {
      const ctx = makeContext({ message: 'workout plan', intent: 'workout' });
      const response = generateResponse(ctx);
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should generate a nutrition response', () => {
      const ctx = makeContext({ message: 'protein intake', intent: 'nutrition' });
      const response = generateResponse(ctx);
      expect(response).toBeTruthy();
      expect(response.toLowerCase()).toContain('protein');
    });

    it('should generate a recovery response', () => {
      const ctx = makeContext({ message: 'sleep tips', intent: 'recovery' });
      const response = generateResponse(ctx);
      expect(response).toBeTruthy();
      expect(response.toLowerCase()).toMatch(/recover|sleep|rest/);
    });

    it('should generate a progress response', () => {
      const ctx = makeContext({ message: 'show stats', intent: 'progress' });
      const response = generateResponse(ctx);
      expect(response).toBeTruthy();
    });

    it('should generate an education response', () => {
      const ctx = makeContext({ message: 'what is hypertrophy', intent: 'education' });
      const response = generateResponse(ctx);
      expect(response).toBeTruthy();
    });

    it('should generate a motivation response', () => {
      const ctx = makeContext({ message: 'keep going', intent: 'motivation' });
      const response = generateResponse(ctx);
      expect(response).toBeTruthy();
    });

    it('should generate a general response for unknown intents', () => {
      const ctx = makeContext({ message: 'hello', intent: 'general' });
      const response = generateResponse(ctx);
      expect(response).toBeTruthy();
      expect(response).toContain('TestUser');
    });

    it('should include personality context in response', () => {
      const ctx = makeContext({ message: 'help me', personalityId: 'strength' });
      const response = generateResponse(ctx);
      expect(response).toBeTruthy();
    });

    it('should handle different personalities', () => {
      const personalities: CoachPersonalityId[] = [
        'evidence-hypertrophy', 'sports-performance', 'strength',
        'bodybuilding', 'fat-loss', 'nutrition-specialist',
        'powerlifting', 'recovery', 'motivation',
      ];

      for (const p of personalities) {
        const ctx = makeContext({ message: 'help', personalityId: p });
        const response = generateResponse(ctx);
        expect(response).toBeTruthy();
        expect(response.length).toBeGreaterThan(10);
      }
    });

    it('should use context data when available', () => {
      const ctx = makeContext({
        message: 'workout advice',
        intent: 'workout',
        workoutStats: '50 workouts, 4x/week average',
        recentWorkouts: 'Bench Press (strength, 45min), Squat (strength, 50min)',
        userGoals: 'muscle building',
      });
      const response = generateResponse(ctx);
      expect(response).toBeTruthy();
    });

    it('should append follow-up question for complex queries', () => {
      const ctx = makeContext({
        message: 'a'.repeat(150),
        intent: 'general',
      });
      const response = generateResponse(ctx);
      expect(response).toContain('dive deeper');
    });

    it('should not append follow-up for short queries', () => {
      const ctx = makeContext({
        message: 'hi',
        intent: 'general',
      });
      const response = generateResponse(ctx);
      expect(response).not.toContain('dive deeper');
    });
  });
});
