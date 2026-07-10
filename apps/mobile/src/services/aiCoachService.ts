import { getDatabase, type DB } from '../database';
import { randomUUID } from 'expo-crypto';
import { now } from '../database/helpers';

function getDb(): DB {
  return getDatabase();
}

export type IntentType =
  | 'form_check'
  | 'workout'
  | 'programming'
  | 'nutrition'
  | 'recovery'
  | 'motivation'
  | 'education'
  | 'greeting'
  | 'general';

export type CoachPersonalityId =
  | 'evidence-hypertrophy'
  | 'sports-performance'
  | 'strength'
  | 'bodybuilding'
  | 'fat-loss'
  | 'nutrition-specialist'
  | 'powerlifting'
  | 'recovery'
  | 'motivation';

export interface CoachPersonality {
  id: CoachPersonalityId;
  name: string;
  description: string;
  avatar: string;
  greeting: string[];
  tone: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: string;
  difficulty: string;
}

interface CoachContext {
  userId: string;
  userName: string;
  personalityId: CoachPersonalityId;
  message: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  intent?: IntentType;
  entities?: {
    exerciseName?: string;
    bodyPart?: string;
    goal?: string;
    topic?: string;
  };
  userGoals?: string;
  experienceLevel?: string;
}

export const COACH_PERSONALITIES: Record<CoachPersonalityId, CoachPersonality> = {
  'evidence-hypertrophy': {
    id: 'evidence-hypertrophy',
    name: 'Dr. Gains',
    description: 'Science-driven muscle building with research-backed protocols',
    avatar: '🔬',
    greeting: ['Alright', 'Let\'s get to work', 'Time to grow'],
    tone: 'scientific',
  },
  'sports-performance': {
    id: 'sports-performance',
    name: 'Coach Velocity',
    description: 'Athletic development for speed, power, and agility',
    avatar: '⚡',
    greeting: ['Ready to perform', 'Let\'s go', 'Game time'],
    tone: 'intense',
  },
  'strength': {
    id: 'strength',
    name: 'Iron Mike',
    description: 'Pure strength development with proven programming',
    avatar: '🏋️',
    greeting: ['Time to lift', 'Let\'s get strong', 'Alright'],
    tone: 'direct',
  },
  'bodybuilding': {
    id: 'bodybuilding',
    name: 'Sculptor',
    description: 'Physique-focused training for muscle size and symmetry',
    avatar: '💎',
    greeting: ['Time to build', 'Let\'s sculpt', 'Ready to grow'],
    tone: 'passionate',
  },
  'fat-loss': {
    id: 'fat-loss',
    name: 'Coach Torch',
    description: 'Sustainable fat loss through nutrition and training',
    avatar: '🔥',
    greeting: ['Let\'s stay on track', 'Progress starts now', 'Keep pushing'],
    tone: 'supportive',
  },
  'nutrition-specialist': {
    id: 'nutrition-specialist',
    name: 'Chef Macro',
    description: 'Comprehensive nutrition coaching for any goal',
    avatar: '🥗',
    greeting: ['Let\'s fuel up', 'Time to eat right', 'Let\'s plan'],
    tone: 'educational',
  },
  'powerlifting': {
    id: 'powerlifting',
    name: 'The General',
    description: 'Competitive powerlifting preparation and technique',
    avatar: '⚔️',
    greeting: ['Time to pull', 'Let\'s prep', 'Ready to compete'],
    tone: 'strategic',
  },
  'recovery': {
    id: 'recovery',
    name: 'Healer',
    description: 'Optimize recovery, manage fatigue, prevent injury',
    avatar: '💚',
    greeting: ['Let\'s recover', 'Time to heal', 'Feel better'],
    tone: 'empathetic',
  },
  'motivation': {
    id: 'motivation',
    name: 'Coach Blaze',
    description: 'Accountability, mindset, and habit-building support',
    avatar: '🌟',
    greeting: ['You\'ve got this', 'Let\'s go', 'Time to shine'],
    tone: 'uplifting',
  },
};

export const ALL_PERSONALITIES: CoachPersonality[] = Object.values(COACH_PERSONALITIES);

const MEDICAL_DISCLAIMER = '\n\n⚕️ MEDICAL DISCLAIMER: This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read here.';

const EXERCISE_ALIASES: Record<string, string> = {
  squat: 'Barbell Back Squat',
  'barbell squat': 'Barbell Back Squat',
  'back squat': 'Barbell Back Squat',
  'front squat': 'Barbell Back Squat',
  deadlift: 'Conventional Deadlift',
  'conventional deadlift': 'Conventional Deadlift',
  sumo: 'Conventional Deadlift',
  'bench press': 'Barbell Bench Press',
  bench: 'Barbell Bench Press',
  'barbell bench': 'Barbell Bench Press',
  'overhead press': 'Overhead Press',
  ohp: 'Overhead Press',
  'military press': 'Overhead Press',
  'shoulder press': 'Overhead Press',
  row: 'Barbell Row',
  'barbell row': 'Barbell Row',
  'bent over row': 'Barbell Row',
  'pull up': 'Pull-up',
  'pull-ups': 'Pull-up',
  'pullup': 'Pull-up',
  'chin up': 'Pull-up',
  pushup: 'Push-up',
  'push ups': 'Push-up',
  'push up': 'Push-up',
  'lateral raise': 'Dumbbell Lateral Raise',
  'side raise': 'Dumbbell Lateral Raise',
  curl: 'Bicep Curl',
  'bicep curl': 'Bicep Curl',
  'bicep curls': 'Bicep Curl',
  'hammer curl': 'Bicep Curl',
  dip: 'Tricep Dip',
  dips: 'Tricep Dip',
  'tricep dips': 'Tricep Dip',
  rdl: 'Romanian Deadlift',
  'romanian deadlift': 'Romanian Deadlift',
  'stiff leg deadlift': 'Romanian Deadlift',
  'leg press': 'Leg Press Machine',
  'cable fly': 'Cable Fly',
  'cable flyes': 'Cable Fly',
  'chest fly': 'Cable Fly',
  'face pull': 'Face Pull',
  'face pulls': 'Face Pull',
  'kettlebell swing': 'Kettlebell Swing',
  lunge: 'Lunge',
  lunges: 'Lunge',
  'walking lunge': 'Lunge',
  plank: 'Plank',
  'russian twist': 'Russian Twist',
  'leg curl': 'Leg Curl',
  'hamstring curl': 'Leg Curl',
  'calf raise': 'Calf Raise',
  'calf raises': 'Calf Raise',
  'hip thrust': 'Barbell Hip Thrust',
  'hip thrusts': 'Barbell Hip Thrust',
};

function classifyIntent(message: string): IntentType {
  const lower = message.toLowerCase();

  const formCheckPatterns = [
    /(?:form|technique|how to|how do i|proper|correct|right way)\s+(?:do|perform|execute|do a|do the)/i,
    /(?:check|critique|fix|improve|correct)\s+(?:my|the|this)\s+(?:form|technique)/i,
    /(?:is this|am i)\s+(?:doing|performing)\s+\w+\s+(?:correctly|right|properly)/i,
    /(?:barbell|dumbbell|cable|kettlebell|machine|bodyweight)\s+(?:squat|deadlift|bench|press|row|curl|dip|fly|raise|pull|push|lunge|swing|plank|twist|crunch|thrust)/i,
    /(?:how|what)\s+(?:should|do|can)\s+(?:i|you)\s+(?:do|focus|watch out|be careful|pay attention)/i,
  ];

  for (const pattern of formCheckPatterns) {
    if (pattern.test(message)) return 'form_check';
  }

  const exerciseName = extractExerciseName(lower);
  if (exerciseName) return 'form_check';

  if (/(?:workout|exercise|train|lift|gym|routine|set|rep|split|program)/i.test(lower)) return 'workout';
  if (/(?:nutrition|meal|food|diet|eat|protein|carb|calorie|macro|supplement|creatine|vitamin)/i.test(lower)) return 'nutrition';
  if (/(?:recovery|sleep|rest|tired|fatigue|recover|hrv|deload|rehab|sore|stretch|foam|mobility)/i.test(lower)) return 'recovery';
  if (/(?:motivat|accountab|habit|mindset|goal|focus|consistency|stuck|discipline|give up)/i.test(lower)) return 'motivation';
  if (/(?:plan|schedule|periodiz|program|periodization)/i.test(lower)) return 'programming';
  if (/(?:why|how|what|explain|science|research|study|learn|education|tell me about)/i.test(lower)) return 'education';
  if (/(?:hello|hi|hey|good morning|good evening|sup|yo|what'?s up)/i.test(lower)) return 'greeting';
  if (/(?:progress|plateau|result|gain|improve|track|analytics|stat)/i.test(lower)) return 'workout';
  if (/(?:battle|challenge|compete|friend|social|share)/i.test(lower)) return 'general';

  return 'general';
}

function extractExerciseName(message: string): string | null {
  const lower = message.toLowerCase();

  for (const [alias, canonical] of Object.entries(EXERCISE_ALIASES)) {
    if (lower.includes(alias)) return canonical;
  }

  const exerciseKeywords = [
    'squat', 'deadlift', 'bench', 'press', 'row', 'curl', 'dip',
    'fly', 'raise', 'pull up', 'push up', 'lunge', 'plank',
    'swing', 'thrust', 'twist', 'crunch', 'extension', 'pulldown',
    'split squat', 'leg extension', 'calf raise', 'shrug',
  ];

  for (const keyword of exerciseKeywords) {
    if (lower.includes(keyword)) {
      for (const [alias, canonical] of Object.entries(EXERCISE_ALIASES)) {
        if (lower.includes(alias)) return canonical;
      }
      return keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }

  return null;
}

function extractEntities(message: string): CoachContext['entities'] {
  const lower = message.toLowerCase();
  const entities: CoachContext['entities'] = {};

  const exercise = extractExerciseName(lower);
  if (exercise) entities.exerciseName = exercise;

  const bodyPartMap: Record<string, string> = {
    chest: 'Chest', back: 'Back', shoulder: 'Shoulders', arm: 'Arms',
    bicep: 'Biceps', tricep: 'Triceps', leg: 'Legs', quad: 'Quadriceps',
    hamstring: 'Hamstrings', glute: 'Glutes', calf: 'Calves',
    abs: 'Abdominals', core: 'Core', forearm: 'Forearms', trap: 'Trapezius',
  };

  for (const [key, value] of Object.entries(bodyPartMap)) {
    if (lower.includes(key)) {
      entities.bodyPart = value;
      break;
    }
  }

  const goalMap: Record<string, string> = {
    'fat loss': 'fat_loss', 'lose weight': 'fat_loss', 'cutting': 'fat_loss', 'get lean': 'fat_loss',
    'muscle gain': 'muscle_gain', 'bulk': 'muscle_gain', 'get big': 'muscle_gain', 'gain muscle': 'muscle_gain',
    'strength': 'strength', 'get strong': 'strength', 'powerlifting': 'strength', 'get stronger': 'strength',
    'endurance': 'endurance', 'cardio': 'endurance', 'run faster': 'endurance',
    'flexibility': 'flexibility', 'mobility': 'flexibility', 'stretch': 'flexibility',
  };

  for (const [key, value] of Object.entries(goalMap)) {
    if (lower.includes(key)) {
      entities.goal = value;
      break;
    }
  }

  return entities;
}

function getGreeting(personalityId: CoachPersonalityId, userName: string): string {
  const personality = COACH_PERSONALITIES[personalityId];
  const greet = personality.greeting[Math.floor(Math.random() * personality.greeting.length)];
  return `${greet}, ${userName}!`;
}

function retrieveFormKnowledge(exerciseName: string): KnowledgeArticle | null {
  const db = getDb();
  const articles = db.getAllSync<KnowledgeArticle>(
    `SELECT * FROM knowledge_articles WHERE category = 'form' AND tags LIKE ?`,
    [`%${exerciseName.toLowerCase().replace(/\s+/g, '-')}%`]
  );
  if (articles.length > 0) return articles[0];

  const words = exerciseName.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (word.length < 3) continue;
    const results = db.getAllSync<KnowledgeArticle>(
      `SELECT * FROM knowledge_articles WHERE category = 'form' AND (title LIKE ? OR tags LIKE ?)`,
      [`%${word}%`, `%${word}%`]
    );
    if (results.length > 0) return results[0];
  }

  return null;
}

function retrieveKnowledgeByCategory(category: string, limit = 3): KnowledgeArticle[] {
  const db = getDb();
  return db.getAllSync<KnowledgeArticle>(
    `SELECT * FROM knowledge_articles WHERE category = ? ORDER BY RANDOM() LIMIT ?`,
    [category, limit]
  );
}

function retrieveKnowledgeByTags(tags: string[], limit = 3): KnowledgeArticle[] {
  const db = getDb();
  const conditions = tags.map(() => 'tags LIKE ?').join(' OR ');
  const params = tags.map(t => `%${t}%`);
  return db.getAllSync<KnowledgeArticle>(
    `SELECT * FROM knowledge_articles WHERE ${conditions} ORDER BY RANDOM() LIMIT ?`,
    [...params, limit]
  );
}

function generateFormCheckResponse(context: CoachContext, article: KnowledgeArticle | null): string {
  const personality = COACH_PERSONALITIES[context.personalityId];
  const exerciseName = context.entities?.exerciseName || 'this exercise';
  const greeting = getGreeting(context.personalityId, context.userName);
  const lines: string[] = [];

  lines.push(`${greeting}`);

  if (article) {
    try {
      const content = JSON.parse(article.content);
      lines.push('');
      lines.push(`${personality.tone === 'scientific' ? 'Here\'s the evidence-based breakdown of' : 'Great question about'} ${article.title}:`);
      lines.push('');

      if (content.cues && content.cues.length > 0) {
        lines.push('Key form cues:');
        for (const cue of content.cues.slice(0, 6)) {
          lines.push(`• ${cue}`);
        }
      }

      if (content.common_mistakes && content.common_mistakes.length > 0) {
        lines.push('');
        lines.push('Common mistakes to avoid:');
        for (const mistake of content.common_mistakes.slice(0, 3)) {
          lines.push(`• ${mistake}`);
        }
      }

      if (content.tips && content.tips.length > 0) {
        lines.push('');
        lines.push('Pro tips:');
        for (const tip of content.tips.slice(0, 2)) {
          lines.push(`• ${tip}`);
        }
      }

      if (content.muscles) {
        lines.push('');
        lines.push(`Muscles worked: ${content.muscles.join(', ')}`);
      }
    } catch {
      lines.push('');
      lines.push(`Here's what to focus on for ${exerciseName}:`);
      lines.push(article.summary);
    }
  } else {
    lines.push('');
    lines.push(`Here are the key principles for ${exerciseName}:`);
    lines.push('');
    lines.push('• Maintain proper body alignment throughout');
    lines.push('• Control the eccentric (lowering) phase');
    lines.push('• Use a full range of motion');
    lines.push('• Brace your core before each rep');
    lines.push('• Start with lighter weights to master the pattern');
    lines.push('');
    lines.push(`For specific ${exerciseName} form cues, check the exercise library or ask me about a particular aspect.`);
  }

  lines.push(MEDICAL_DISCLAIMER);

  return lines.join('\n');
}

function generateWorkoutResponse(context: CoachContext): string {
  const personality = COACH_PERSONALITIES[context.personalityId];
  const greeting = getGreeting(context.personalityId, context.userName);
  const lines: string[] = [];

  lines.push(`${greeting}`);
  lines.push('');

  const articles = retrieveKnowledgeByCategory('programming', 2);
  if (articles.length > 0) {
    const mainArticle = articles[0];
    try {
      const content = JSON.parse(mainArticle.content);
      if (content.key_points) {
        lines.push(`Based on current exercise science, here's what to focus on:`);
        for (const point of content.key_points.slice(0, 4)) {
          lines.push(`• ${point}`);
        }
      } else {
        lines.push(mainArticle.summary);
      }
    } catch {
      lines.push(mainArticle.summary);
    }
  } else {
    lines.push('Here\'s my workout advice:');
    lines.push('');
    lines.push('• Train each muscle group 2-3 times per week');
    lines.push('• Use 10-20 working sets per muscle group per week');
    lines.push('• Progressive overload is key — add weight or reps over time');
    lines.push('• Focus on compound movements first, then isolation');
  }

  lines.push('');
  lines.push('Would you like me to design a specific program for your goals?');

  return lines.join('\n');
}

function generateNutritionResponse(context: CoachContext): string {
  const personality = COACH_PERSONALITIES[context.personalityId];
  const greeting = getGreeting(context.personalityId, context.userName);
  const lines: string[] = [];

  lines.push(`${greeting}`);
  lines.push('');

  const articles = retrieveKnowledgeByCategory('nutrition', 2);
  if (articles.length > 0) {
    const article = articles[0];
    try {
      const content = JSON.parse(article.content);
      if (content.macros) {
        lines.push('Here are the evidence-based nutrition guidelines:');
        lines.push('');
        lines.push(`• Protein: ${content.macros.protein?.recommended || '1.6-2.2g per kg bodyweight'}`);
        lines.push(`• Carbs: ${content.macros.carbs?.recommended || '3-5g per kg bodyweight'}`);
        lines.push(`• Fat: ${content.macros.fat?.recommended || '0.8-1.2g per kg bodyweight'}`);
        if (content.calorie_calculator) {
          lines.push('');
          lines.push(content.calorie_calculator);
        }
      } else {
        lines.push(article.summary);
      }
    } catch {
      lines.push(article.summary);
    }
  } else {
    lines.push('Here\'s my nutrition advice:');
    lines.push('');
    lines.push('• Aim for 1.6-2.2g protein per kg of bodyweight daily');
    lines.push('• Distribute protein across 3-4 meals');
    lines.push('• Prioritize whole food sources');
    lines.push('• Stay hydrated: aim for 35-40ml per kg of bodyweight');
  }

  if (context.entities?.goal === 'fat_loss' || context.entities?.goal === 'lose weight') {
    lines.push('');
    lines.push('For fat loss specifically:');
    lines.push('• Maintain a 300-500 calorie deficit');
    lines.push('• Keep protein high (2.0-2.4g/kg) to preserve muscle');
    lines.push('• Increase NEAT (daily steps, movement)');
  }

  return lines.join('\n');
}

function generateRecoveryResponse(context: CoachContext): string {
  const personality = COACH_PERSONALITIES[context.personalityId];
  const greeting = getGreeting(context.personalityId, context.userName);
  const lines: string[] = [];

  lines.push(`${greeting}`);
  lines.push('');

  const articles = retrieveKnowledgeByCategory('recovery', 2);
  if (articles.length > 0) {
    const article = articles[0];
    try {
      const content = JSON.parse(article.content);
      lines.push(`${article.summary}`);
      lines.push('');
      if (content.optimal) lines.push(`Optimal: ${content.optimal}`);
      if (content.sleep_hygiene) {
        lines.push('');
        lines.push('Key practices:');
        for (const tip of content.sleep_hygiene.slice(0, 4)) {
          lines.push(`• ${tip}`);
        }
      } else if (content.tips) {
        lines.push('');
        for (const tip of content.tips.slice(0, 3)) {
          lines.push(`• ${tip}`);
        }
      }
    } catch {
      lines.push(article.summary);
    }
  } else {
    lines.push('Recovery is where the gains happen!');
    lines.push('');
    lines.push('Key recovery factors:');
    lines.push('• Sleep: 7-9 hours per night');
    lines.push('• Nutrition: adequate protein and carbohydrates');
    lines.push('• Hydration: replace fluids lost during training');
    lines.push('• Active recovery: light walking or mobility');
    lines.push('• Deload every 4-8 weeks');
  }

  return lines.join('\n');
}

function generateMotivationResponse(context: CoachContext): string {
  const personality = COACH_PERSONALITIES[context.personalityId];
  const greeting = getGreeting(context.personalityId, context.userName);
  const lines: string[] = [];

  lines.push(`${greeting}`);
  lines.push('');

  const encouragements = [
    'Remember why you started. Every rep, every meal, every early morning — it\'s all adding up.',
    'Progress isn\'t always visible day to day, but consistency compounds. Trust the process.',
    'You don\'t have to be extreme, just consistent. Small daily wins lead to big transformations.',
    'Setbacks are part of the journey. What matters is how you respond. Get back up and keep going.',
    'The best workout is the one you actually do. Show up, do the work, and results will follow.',
    'You\'re not competing with anyone but yesterday\'s version of yourself.',
    'Discipline is choosing between what you want now and what you want most.',
  ];

  lines.push(encouragements[Math.floor(Math.random() * encouragements.length)]);

  const articles = retrieveKnowledgeByCategory('motivation', 1);
  if (articles.length > 0) {
    try {
      const content = JSON.parse(articles[0].content);
      if (content.habit_stacking) {
        lines.push('');
        lines.push(`Pro tip: ${content.habit_stacking}`);
      }
      if (content.tips) {
        lines.push('');
        lines.push(content.tips[Math.floor(Math.random() * content.tips.length)]);
      }
    } catch {
      // Use article summary
    }
  }

  return lines.join('\n');
}

function generateProgrammingResponse(context: CoachContext): string {
  const personality = COACH_PERSONALITIES[context.personalityId];
  const greeting = getGreeting(context.personalityId, context.userName);
  const lines: string[] = [];

  lines.push(`${greeting}`);
  lines.push('');

  const articles = retrieveKnowledgeByCategory('programming', 1);
  if (articles.length > 0) {
    const article = articles[0];
    try {
      const content = JSON.parse(article.content);
      lines.push(article.summary);
      lines.push('');
      if (content.splits) {
        lines.push('Recommended splits:');
        for (const split of content.splits) {
          lines.push(`• ${split}`);
        }
      } else if (content.types) {
        lines.push('Types of periodization:');
        for (const type of content.types) {
          lines.push(`• ${type}`);
        }
      } else if (content.essentials) {
        lines.push('Essentials:');
        for (const item of content.essentials) {
          lines.push(`• ${item}`);
        }
      } else if (content.key_finding) {
        lines.push(content.key_finding);
      }
      if (content.tips) {
        lines.push('');
        for (const tip of content.tips.slice(0, 3)) {
          lines.push(`• ${tip}`);
        }
      }
    } catch {
      lines.push(article.summary);
    }
  } else {
    lines.push('Here\'s my programming advice:');
    lines.push('');
    lines.push('• Focus on compound movements');
    lines.push('• Progressive overload each week');
    lines.push('• Manage volume and recovery');
    lines.push('• Periodize your training blocks');
  }

  return lines.join('\n');
}

function generateEducationResponse(context: CoachContext): string {
  const personality = COACH_PERSONALITIES[context.personalityId];
  const greeting = getGreeting(context.personalityId, context.userName);
  const entity = context.entities?.topic || context.entities?.exerciseName || context.message;
  const lines: string[] = [];

  lines.push(`Great question!`);
  lines.push('');

  const searchTerms = entity.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
  const articles = searchTerms.length > 0 ? retrieveKnowledgeByTags(searchTerms, 2) : [];

  if (articles.length > 0) {
    const article = articles[0];
    lines.push(article.summary);
    lines.push('');
    try {
      const content = JSON.parse(article.content);
      const overview = content.overview || content.overview;
      if (overview) lines.push(overview);
      if (content.key_points) {
        lines.push('');
        for (const point of content.key_points.slice(0, 3)) {
          lines.push(`• ${point}`);
        }
      }
    } catch {
      // Use summary only
    }
  } else {
    lines.push('Here\'s what the science says: Consistent training with proper nutrition and recovery yields the best long-term results.');
    lines.push('');
    lines.push('Focus on the fundamentals:');
    lines.push('• Progressive overload');
    lines.push('• Adequate protein (1.6-2.2g/kg)');
    lines.push('• Quality sleep (7-9 hours)');
    lines.push('• Training consistency');
  }

  return lines.join('\n');
}

function generateGeneralResponse(context: CoachContext): string {
  const personality = COACH_PERSONALITIES[context.personalityId];
  const greeting = getGreeting(context.personalityId, context.userName);

  return `${greeting}

I'm your ${personality.name} coach. I can help you with:

• **Form Checks** — Ask me about proper exercise technique
• **Workouts** — Training plans, exercise selection, progression
• **Nutrition** — Macros, meal planning, supplements
• **Recovery** — Sleep, deloads, mobility, injury prevention
• **Programming** — Periodization, splits, volume management
• **Motivation** — Habits, goals, accountability

What would you like to focus on today?`;
}

export function generateAIResponse(
  message: string,
  personalityId: CoachPersonalityId = 'evidence-hypertrophy',
  userId: string = 'local-user',
  userName: string = 'Athlete',
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
  settings?: { goal?: string; experienceLevel?: string }
): string {
  const intent = classifyIntent(message);
  const entities = extractEntities(message);

  const context: CoachContext = {
    userId,
    userName,
    personalityId,
    message,
    conversationHistory,
    intent,
    entities,
    userGoals: settings?.goal,
    experienceLevel: settings?.experienceLevel,
  };

  let response: string;

  switch (intent) {
    case 'form_check': {
      const exerciseName = entities.exerciseName || '';
      const article = exerciseName ? retrieveFormKnowledge(exerciseName) : null;
      response = generateFormCheckResponse(context, article);
      break;
    }
    case 'workout':
      response = generateWorkoutResponse(context);
      break;
    case 'nutrition':
      response = generateNutritionResponse(context);
      break;
    case 'recovery':
      response = generateRecoveryResponse(context);
      break;
    case 'motivation':
      response = generateMotivationResponse(context);
      break;
    case 'programming':
      response = generateProgrammingResponse(context);
      break;
    case 'education':
      response = generateEducationResponse(context);
      break;
    case 'greeting':
      response = `${getGreeting(context.personalityId, context.userName)}\n\nHow can I help you today? I can assist with workouts, nutrition, recovery, form checks, and more.`;
      break;
    default:
      response = generateGeneralResponse(context);
      break;
  }

  return response;
}

export function storeMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): { id: string; conversation_id: string; role: string; content: string; thinking: number; timestamp: string } {
  const db = getDb();
  const id = randomUUID();
  db.runSync(
    'INSERT INTO ai_messages (id, conversation_id, role, content) VALUES (?, ?, ?, ?)',
    [id, conversationId, role, content]
  );
  db.runSync(
    'UPDATE ai_conversations SET updated_at = ? WHERE id = ?',
    [now(), conversationId]
  );
  return db.getFirstSync('SELECT * FROM ai_messages WHERE id = ?', [id])!;
}

export function createConversation(userId: string, title?: string): { id: string; user_id: string; title: string; pinned: number; created_at: string; updated_at: string } {
  const db = getDb();
  const id = randomUUID();
  db.runSync(
    'INSERT INTO ai_conversations (id, user_id, title) VALUES (?, ?, ?)',
    [id, userId, title || 'New Conversation']
  );
  return db.getFirstSync('SELECT * FROM ai_conversations WHERE id = ?', [id])!;
}

export function getConversations(userId: string) {
  const db = getDb();
  const conversations = db.getAllSync(
    'SELECT * FROM ai_conversations WHERE user_id = ? ORDER BY updated_at DESC',
    [userId]
  );
  return conversations.map((conv: any) => ({
    ...conv,
    messages: db.getAllSync(
      'SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY timestamp ASC',
      [conv.id]
    ),
  }));
}

export function deleteConversation(userId: string, conversationId: string): void {
  const db = getDb();
  db.runSync(
    'DELETE FROM ai_conversations WHERE id = ? AND user_id = ?',
    [conversationId, userId]
  );
}

export function clearConversationMessages(conversationId: string): void {
  getDb().runSync('DELETE FROM ai_messages WHERE conversation_id = ?', [conversationId]);
}
