import { classifyIntent, extractEntities } from '../src/services/intentClassifier.js';

describe('Intent Classifier', () => {
  describe('classifyIntent', () => {
    it('should classify workout-related messages', () => {
      const result = classifyIntent('I want to do a chest workout today');
      expect(result.primary).toBe('workout');
    });

    it('should classify nutrition-related messages', () => {
      const result = classifyIntent('What should I eat for protein?');
      expect(result.primary).toBe('nutrition');
    });

    it('should classify recovery-related messages', () => {
      const result = classifyIntent('I feel tired and sore, need recovery tips');
      expect(result.primary).toBe('recovery');
    });

    it('should classify progress-related messages', () => {
      const result = classifyIntent('Show me my analytics and stats');
      expect(result.primary).toBe('progress');
    });

    it('should classify education-related messages', () => {
      const result = classifyIntent('Why does progressive overload work?');
      expect(result.primary).toBe('education');
    });

    it('should classify motivation-related messages', () => {
      const result = classifyIntent('I need motivation to keep going');
      expect(result.primary).toBe('motivation');
    });

    it('should classify general messages', () => {
      const result = classifyIntent('hello');
      expect(result.primary).toBe('general');
    });

    it('should detect mixed intents', () => {
      const result = classifyIntent('I want to work out and eat better for fat loss');
      expect(['workout', 'nutrition', 'mixed']).toContain(result.primary);
    });
  });

  describe('extractEntities', () => {
    it('should extract exercise names', () => {
      const entities = extractEntities('How do I improve my bench press?', 'workout');
      expect(entities.exerciseName).toBe('bench press');
    });

    it('should extract weight entities', () => {
      const entities = extractEntities('I squat 225 lbs', 'workout');
      expect(entities.weight).toBe(225);
    });

    it('should extract rep entities', () => {
      const entities = extractEntities('I did 12 reps', 'workout');
      expect(entities.reps).toBe(12);
    });

    it('should extract set entities', () => {
      const entities = extractEntities('I did 4 sets', 'workout');
      expect(entities.sets).toBe(4);
    });

    it('should extract calorie entities', () => {
      const entities = extractEntities('I ate 2000 calories today', 'nutrition');
      expect(entities.calories).toBe(2000);
    });

    it('should extract goal entities', () => {
      const entities = extractEntities('I want to lose fat', 'workout');
      expect(entities.goal).toBe('fat loss');
    });

    it('should extract equipment entities', () => {
      const entities = extractEntities('I only have a dumbbell and a band', 'workout');
      expect(entities.equipment).toContain('dumbbell');
      expect(entities.equipment).toContain('band');
    });

    it('should extract education topics', () => {
      const entities = extractEntities('Tell me about protein timing', 'education');
      expect(entities.topic).toBeDefined();
    });
  });
});
