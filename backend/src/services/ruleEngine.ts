import { getPersonality, CoachPersonalityId } from './aiPersonality.js';

export interface CoachContext {
  userId: string;
  userName: string;
  personalityId: CoachPersonalityId;
  message: string;
  userGoals?: string;
  recentWorkouts?: string;
  workoutStats?: string;
  nutritionSummary?: string;
  recoveryData?: string;
  weightTrend?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  intent?: string;
  entities?: Record<string, unknown>;
}

function getContextualGreeting(userName: string, personalityId: CoachPersonalityId): string {
  const greetings: Record<CoachPersonalityId, string[]> = {
    'evidence-hypertrophy': ['Alright', 'Let\'s get to work', 'Time to grow'],
    'sports-performance': ['Ready to perform', 'Let\'s go', 'Game time'],
    strength: ['Time to lift', 'Let\'s get strong', 'Alright'],
    'bodybuilding': ['Time to build', 'Let\'s sculpt', 'Ready to grow'],
    'fat-loss': ['Let\'s stay on track', 'Progress starts now', 'Keep pushing'],
    'nutrition-specialist': ['Let\'s fuel up', 'Time to eat right', 'Let\'s plan'],
    powerlifting: ['Time to pull', 'Let\'s prep', 'Ready to compete'],
    recovery: ['Let\'s recover', 'Time to heal', 'Feel better'],
    motivation: ['You\'ve got this', 'Let\'s go', 'Time to shine'],
  };
  const options = greetings[personalityId] || ['Hey'];
  return `${options[Math.floor(Math.random() * options.length)]} ${userName}!`;
}

function getWorkoutResponse(context: CoachContext): string {
  const personality = getPersonality(context.personalityId);
  const lines: string[] = [];

  lines.push(`${getContextualGreeting(context.userName, context.personalityId)}`);
  lines.push(``);
  lines.push(`${personality.systemPrompt.split('\n')[0]}`);

  if (context.workoutStats && context.workoutStats !== 'Not available') {
    lines.push(`Looking at your training data: ${context.workoutStats}`);
  }

  if (context.recentWorkouts && context.recentWorkouts !== 'Not available') {
    lines.push(`Your recent sessions show: ${context.recentWorkouts}`);
  }

  if (context.userGoals) {
    lines.push(`Keeping your goal of "${context.userGoals}" in mind, here's what I recommend:`);
  }

  lines.push(``);
  lines.push(getWorkoutAdvice(context));

  return lines.join('\n');
}

function getWorkoutAdvice(context: CoachContext): string {
  const intent = context.intent || 'general';

  switch (intent) {
    case 'planning': {
      return `Based on your profile, I recommend a structured approach:\n` +
        `- Frequency: Train each muscle group 2x per week\n` +
        `- Volume: 10-20 working sets per muscle group per week\n` +
        `- Progression: Aim to add 2.5-5% weight or 1-2 reps when you hit your target reps with good form\n` +
        `- Rest: 60-90s for hypertrophy, 3-5min for strength work`;
    }
    case 'workout': {
      if (context.entities?.exerciseName) {
        return `For ${context.entities.exerciseName}, focus on controlled eccentrics and full range of motion. ` +
          `If you're stuck on progress, try varying the rep range or adding drop sets on your last set.`;
      }
      return `For an effective session, start with compound movements, then isolation. ` +
        `Keep rest periods appropriate to your goal and track your weights to ensure progression.`;
    }
    default: {
      return `Consistency is key. Focus on progressive overload, proper form, and adequate recovery. ` +
        `Track your workouts to ensure you're getting stronger over time.`;
    }
  }
}

function getNutritionResponse(context: CoachContext): string {
  const lines: string[] = [];

  lines.push(`${getContextualGreeting(context.userName, context.personalityId)}`);
  lines.push(``);

  if (context.nutritionSummary && context.nutritionSummary !== 'Not available') {
    lines.push(`Based on your nutrition data: ${context.nutritionSummary}`);
  }

  lines.push(``);
  lines.push(`Here's my advice:`);
  lines.push(`- Aim for 1.6-2.2g protein per kg of body weight daily`);
  lines.push(`- Distribute protein evenly across 3-4 meals`);
  lines.push(`- Prioritize whole food sources: lean meats, eggs, dairy, legumes`);
  lines.push(`- Stay hydrated: aim for 35-40ml per kg of body weight`);
  lines.push(`- Time carbs around your workouts for better performance`);

  if (context.userGoals?.toLowerCase().includes('fat loss') || context.userGoals?.toLowerCase().includes('lose')) {
    lines.push(``);
    lines.push(`For fat loss: maintain a 300-500 calorie deficit, keep protein high ` +
      `to preserve muscle, and consider increasing NEAT (non-exercise activity thermogenesis).`);
  }

  return lines.join('\n');
}

function getRecoveryResponse(context: CoachContext): string {
  const lines: string[] = [];

  lines.push(`${getContextualGreeting(context.userName, context.personalityId)}`);
  lines.push(``);
  lines.push(`Recovery is where the gains happen. Let's optimize yours.`);

  if (context.recoveryData && context.recoveryData !== 'Not available') {
    lines.push(`Your recovery metrics: ${context.recoveryData}`);
  }

  lines.push(``);
  lines.push(`Key recovery factors:`);
  lines.push(`- Sleep: 7-9 hours per night is optimal`);
  lines.push(`- Nutrition: adequate protein and carbohydrates post-workout`);
  lines.push(`- Hydration: replace fluids lost during training`);
  lines.push(`- Stress management: high cortisol impairs recovery`);
  lines.push(`- Active recovery: light walking or mobility on rest days`);

  return lines.join('\n');
}

function getProgressResponse(context: CoachContext): string {
  const lines: string[] = [];
  lines.push(`${getContextualGreeting(context.userName, context.personalityId)}`);
  lines.push(``);

  if (context.workoutStats && context.workoutStats !== 'Not available') {
    lines.push(`Your stats: ${context.workoutStats}`);
  }

  if (context.weightTrend && context.weightTrend !== 'Not available') {
    lines.push(`Weight trend: ${context.weightTrend}`);
  }

  lines.push(``);
  lines.push(`Tracking progress is essential. Here's what to monitor:`);
  lines.push(`- Training volume: Are you doing more over time?`);
  lines.push(`- Strength: Are your key lifts going up?`);
  lines.push(`- Body composition: Track measurements, not just scale weight`);
  lines.push(`- Recovery: How do you feel day-to-day?`);
  lines.push(`- Consistency: Are you hitting your sessions?`);

  return lines.join('\n');
}

function getGeneralResponse(context: CoachContext): string {
  const personality = getPersonality(context.personalityId);
  const lines: string[] = [];

  lines.push(`${getContextualGreeting(context.userName, context.personalityId)}`);
  lines.push(``);
  lines.push(`I'm your ${personality.name}. I can help you with:`);
  lines.push(`- **Workouts**: Designing plans, exercise selection, progression strategies`);
  lines.push(`- **Nutrition**: Meal planning, macro calculations, dietary advice`);
  lines.push(`- **Recovery**: Sleep optimization, stress management, injury prevention`);
  lines.push(`- **Progress**: Tracking, analysis, plateaus`);
  lines.push(`- **Scheduling**: Training splits, time management`);
  lines.push(``);
  lines.push(`What specific area would you like to focus on today?`);

  return lines.join('\n');
}

function getMotivationResponse(context: CoachContext): string {
  const lines: string[] = [];
  const encouragements = [
    `Remember why you started. Every rep, every meal, every early morning — it's all adding up.`,
    `Progress isn't always visible day to day, but consistency compounds. Trust the process.`,
    `You don't have to be extreme, just consistent. Small daily wins lead to big transformations.`,
    `Setbacks are part of the journey. What matters is how you respond. Get back up and keep going.`,
  ];

  lines.push(`Hey ${context.userName}!`);
  lines.push(``);
  lines.push(encouragements[Math.floor(Math.random() * encouragements.length)]);

  if (context.workoutStats && context.workoutStats !== 'Not available') {
    lines.push(``);
    lines.push(`Look at what you've already accomplished: ${context.workoutStats}`);
    lines.push(`That's proof you can do this.`);
  }

  return lines.join('\n');
}

function getEducationResponse(context: CoachContext): string {
  const entity = context.entities?.topic || context.entities?.exerciseName || 'training';
  const lines: string[] = [];

  lines.push(`Great question about ${entity}!`);
  lines.push(``);

  const educationTopics: Record<string, string> = {
    'progressive overload': `Progressive overload is the gradual increase of stress placed on the body during training. ` +
      `This can be achieved by: increasing weight, increasing reps, increasing sets, decreasing rest periods, ` +
      `or improving exercise technique. Without progressive overload, muscles have no reason to adapt and grow.`,
    'hypertrophy': `Muscle hypertrophy occurs when muscle fibers are damaged through mechanical tension and metabolic stress, ` +
      `then repaired and adapted during recovery. Key factors: mechanical tension (heavy loads), metabolic stress (pump/burn), ` +
      `and muscle damage (controlled eccentrics). Optimal rep ranges: 6-30 reps per set.`,
    'protein': `Protein is essential for muscle repair and growth. The recommended intake for active individuals is ` +
      `1.6-2.2g per kg of body weight daily. Good sources include lean meats, eggs, dairy, legumes, and quality supplements. ` +
      `Distribute intake evenly across 3-4 meals for optimal muscle protein synthesis.`,
    'recovery': `Recovery involves: sleep (7-9 hours), nutrition (protein + carbs post-workout), hydration, ` +
      `stress management, and active recovery. Signs of under-recovery: persistent fatigue, decreased performance, ` +
      `poor sleep, increased irritability, and frequent illness.`,
  };

  const topicKey = Object.keys(educationTopics).find(k => entity.toString().toLowerCase().includes(k));
  if (topicKey) {
    lines.push(educationTopics[topicKey]);
  } else {
    lines.push(`Here's what the science says: Consistent training with proper nutrition and recovery ` +
      `yields the best long-term results. Focus on the fundamentals — progressive overload, adequate protein, ` +
      `quality sleep, and training consistency. Everything else is optimization.`);
  }

  return lines.join('\n');
}

export function generateResponse(context: CoachContext): string {
  const intent = context.intent || classifyIntentSimple(context.message);
  const queryLength = context.message.length;
  const isComplexQuery = queryLength > 100 || context.conversationHistory && context.conversationHistory.length > 4;

  let response = '';

  switch (intent) {
    case 'workout':
    case 'planning':
      response = getWorkoutResponse(context);
      break;
    case 'nutrition':
      response = getNutritionResponse(context);
      break;
    case 'recovery':
      response = getRecoveryResponse(context);
      break;
    case 'progress':
    case 'analytics':
      response = getProgressResponse(context);
      break;
    case 'education':
      response = getEducationResponse(context);
      break;
    case 'motivation':
      response = getMotivationResponse(context);
      break;
    case 'scheduling':
      response = getWorkoutResponse({ ...context, intent: 'planning' });
      break;
    case 'social':
    case 'battles':
      response = getGeneralResponse(context);
      break;
    default:
      response = getGeneralResponse(context);
  }

  const personality = getPersonality(context.personalityId);
  const personalityPrefix = personality.systemPrompt.split('\n').slice(0, 3).join(' ');

  return `${personalityPrefix}\n\n${response}${isComplexQuery ? '\n\nWould you like me to dive deeper into any specific aspect?' : ''}`;
}

function classifyIntentSimple(message: string): string {
  const lower = message.toLowerCase();
  if (/workout|exercise|train|lift|gym|routine|set|rep|weightlift/i.test(lower)) return 'workout';
  if (/nutrition|meal|food|diet|eat|protein|carb|calorie|macro/i.test(lower)) return 'nutrition';
  if (/recovery|sleep|rest|tired|fatigue|recover|hrv|deload|rehab/i.test(lower)) return 'recovery';
  if (/progress|plateau|stuck|result|gain|improve|track|analytics|stat/i.test(lower)) return 'progress';
  if (/plan|schedule|split|routine|program|periodiz/i.test(lower)) return 'planning';
  if (/why|how|what|explain|science|research|study|learn|education/i.test(lower)) return 'education';
  if (/motivat|accountab|habit|mindset|goal|focus|consistency|keep going/i.test(lower)) return 'motivation';
  if (/schedule|time|when|calendar|frequency/i.test(lower)) return 'scheduling';
  if (/friend|social|share|post|community|group/i.test(lower)) return 'social';
  if (/battle|challenge|compete|vs|versus/i.test(lower)) return 'battles';
  return 'general';
}
