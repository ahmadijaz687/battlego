export type CoachIntent =
  | 'workout'
  | 'nutrition'
  | 'recovery'
  | 'progress'
  | 'planning'
  | 'education'
  | 'analytics'
  | 'scheduling'
  | 'social'
  | 'battles'
  | 'general'
  | 'motivation'
  | 'mixed';

export interface IntentResult {
  primary: CoachIntent;
  secondary: CoachIntent | null;
  confidence: number;
}

const intentPatterns: Array<{ intent: CoachIntent; patterns: RegExp[]; keywords: string[] }> = [
  {
    intent: 'workout',
    patterns: [
      /\b(workout|exercise|train(ing)?|lift(ing)?|gym|routine)\b/i,
      /\b(set|rep|reps|volume|intensity)\s+(of|for|per|to|and)\b/i,
      /\b(chest|back|legs|shoulders|arms|biceps|triceps|quad|glute|hamstring)\s+(day|workout|exercise)\b/i,
    ],
    keywords: ['workout', 'exercise', 'training', 'lifting', 'gym', 'routine', 'sets', 'reps', 'weight',
      'bench', 'squat', 'deadlift', 'press', 'pull', 'curl', 'extension', 'fly', 'row'],
  },
  {
    intent: 'nutrition',
    patterns: [
      /\b(meal|food|diet|eat(ing)?|nutrition|macro|calorie|protein|carb|fat)\b/i,
      /\b(recipe|cook|breakfast|lunch|dinner|snack|supplement)\b/i,
    ],
    keywords: ['nutrition', 'meal', 'food', 'diet', 'eat', 'protein', 'carbs', 'calories', 'macro',
      'breakfast', 'lunch', 'dinner', 'snack', 'supplement', 'vitamin', 'mineral'],
  },
  {
    intent: 'recovery',
    patterns: [
      /\b(sleep|rest|recover(y|ing)?|fatigue|tired|hrv|deload)\b/i,
      /\b(stress|sore(ness)?|pain|injury|rehab|mobility)\b/i,
    ],
    keywords: ['recovery', 'sleep', 'rest', 'tired', 'fatigue', 'hrv', 'deload', 'soreness',
      'stress', 'mobility', 'stretching', 'warmup', 'cooldown', 'rehab'],
  },
  {
    intent: 'progress',
    patterns: [
      /\b(progress|result|gain|improve(ment)?|plateau|stuck|trend)\b/i,
      /\b(analytics|stats?|data|track(ing)?|measure|metric)\b/i,
      /\b(pr|personal.?record|pb|personal.?best)\b/i,
    ],
    keywords: ['progress', 'results', 'gains', 'improvement', 'plateau', 'stuck', 'stats',
      'tracking', 'pr', 'personal record', 'trend', 'analysis'],
  },
  {
    intent: 'planning',
    patterns: [
      /\b(plan|schedule|split|program|periodiz(ation|e)?)\b/i,
      /\b(should I|recommend|suggest|advise|best)\s+(do|train|workout|start|try)\b/i,
    ],
    keywords: ['plan', 'schedule', 'split', 'program', 'periodization', 'routine design',
      'frequency', 'volume', 'recommendation'],
  },
  {
    intent: 'education',
    patterns: [
      /\b(why|how|what|explain|science|research|study)\s+(does|is|are|can|should|would)\b/i,
      /\b(learn|teach|educate|understand|concept|principle|mechanism)\b/i,
    ],
    keywords: ['why', 'how', 'explain', 'science', 'research', 'study', 'learn', 'education',
      'mechanism', 'physiology', 'anatomy', 'evidence', 'study'],
  },
  {
    intent: 'motivation',
    patterns: [
      /\b(motivat(e|ion|ing)?|accountab(ility|le)?|habit|mindset|inspire)\b/i,
      /\b(keep going|stay|consisten(t|cy)|bored|lazy|struggling)\b/i,
    ],
    keywords: ['motivation', 'accountability', 'habit', 'mindset', 'consistency', 'keep going',
      'struggling', 'bored', 'unmotivated', 'discipline'],
  },
  {
    intent: 'scheduling',
    patterns: [
      /\b(schedule|when|time|frequency|how often|how many days)\b/i,
      /\b(morning|evening|afternoon|lunch|before work|after work)\b/i,
    ],
    keywords: ['schedule', 'when', 'time', 'frequency', 'how often', 'days per week', 'availability'],
  },
  {
    intent: 'social',
    patterns: [
      /\b(friend|social|share|post|community|group|follow)\b/i,
      /\b(leaderboard|rank|compare|team|partner)\b/i,
    ],
    keywords: ['friend', 'social', 'share', 'post', 'community', 'group', 'leaderboard', 'partner'],
  },
  {
    intent: 'battles',
    patterns: [
      /\b(battle|challenge|compete|competition|vs|versus|1v1)\b/i,
      /\b(head.?to.?head|duel|tournament|match)\b/i,
    ],
    keywords: ['battle', 'challenge', 'compete', 'competition', 'vs', 'versus', 'tournament', 'duel'],
  },
];

export function classifyIntent(message: string): IntentResult {
  const lower = message.toLowerCase();

  const matchedIntents: Array<{ intent: CoachIntent; score: number }> = [];

  for (const entry of intentPatterns) {
    let score = 0;

    for (const pattern of entry.patterns) {
      const matches = lower.match(pattern);
      if (matches) {
        score += matches.length * 3;
      }
    }

    for (const keyword of entry.keywords) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(lower)) {
        score += 1;
      }
    }

    if (score > 0) {
      matchedIntents.push({ intent: entry.intent, score });
    }
  }

  if (matchedIntents.length === 0) {
    return { primary: 'general', secondary: null, confidence: 1 };
  }

  matchedIntents.sort((a, b) => b.score - a.score);
  const totalScore = matchedIntents.reduce((sum, m) => sum + m.score, 0);

  const primary = matchedIntents[0];
  const secondary = matchedIntents.length > 1 ? matchedIntents[1] : null;

  if (secondary && secondary.score >= primary.score * 0.6) {
    return {
      primary: primary.intent,
      secondary: secondary.intent,
      confidence: Math.min(1, totalScore / 20),
    };
  }

  if (secondary && secondary.score >= primary.score * 0.3) {
    return {
      primary: 'mixed' as CoachIntent,
      secondary: null,
      confidence: Math.min(1, totalScore / 20),
    };
  }

  return {
    primary: primary.intent,
    secondary: null,
    confidence: Math.min(1, primary.score / 10),
  };
}

export function extractEntities(message: string, intent: CoachIntent): Record<string, unknown> {
  const entities: Record<string, unknown> = {};
  const lower = message.toLowerCase();

  const exerciseNames = [
    'bench press', 'squat', 'deadlift', 'overhead press', 'shoulder press',
    'barbell row', 'pull up', 'push up', 'dumbbell curl', 'tricep extension',
    'leg press', 'lat pulldown', 'cable fly', 'dumbbell fly', 'incline bench',
    'decline bench', 'dumbbell press', 'arnold press', 'lateral raise',
    'front raise', 'face pull', 'upright row', 'shrug', 'calf raise',
    'leg extension', 'leg curl', 'hip thrust', 'glute bridge', 'plank',
  ];

  for (const exercise of exerciseNames) {
    const escaped = exercise.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(message)) {
      entities.exerciseName = exercise;
      break;
    }
  }

  const numberPatterns = [
    { pattern: /(\d+)\s*(kg|lb|pounds?|kilos?)/i, key: 'weight' },
    { pattern: /(\d+)\s*(reps?|repetitions?)/i, key: 'reps' },
    { pattern: /(\d+)\s*(sets?)/i, key: 'sets' },
    { pattern: /(\d+)\s*(calories?|cal)/i, key: 'calories' },
    { pattern: /(\d+)\s*(g|grams?)\s*(protein|carbs?|fat|protei)/i, key: 'grams' },
    { pattern: /(\d+)\s*(hours?|hrs?)\s*(sleep)?/i, key: 'hours' },
    { pattern: /(\d+)\s*(minutes?|mins?)/i, key: 'minutes' },
    { pattern: /(\d+)\s*(days?|weeks?)/i, key: 'duration' },
  ];

  for (const { pattern, key } of numberPatterns) {
    const match = message.match(pattern);
    if (match) {
      entities[key] = parseInt(match[1], 10);
    }
  }

  const goalPatterns = [
    { pattern: /(lose|burn|cut|fat.?loss)/i, value: 'fat loss' },
    { pattern: /(build|gain|muscle|hypertrophy|grow)/i, value: 'muscle building' },
    { pattern: /(strength|strong|power|stronger)/i, value: 'strength' },
    { pattern: /(endurance|stamina|cardio|condition)/i, value: 'endurance' },
    { pattern: /(maintain|recomp|body.?recomposition)/i, value: 'maintenance' },
  ];

  for (const { pattern, value } of goalPatterns) {
    if (pattern.test(lower)) {
      entities.goal = value;
      break;
    }
  }

  const equipment = [
    'barbell', 'dumbbell', 'kettlebell', 'cable', 'machine', 'band',
    'smith machine', 'ez bar', 'trap bar', 'medicine ball', 'bosu ball',
  ];

  for (const item of equipment) {
    const escaped = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(message)) {
      if (!entities.equipment) entities.equipment = [];
      (entities.equipment as string[]).push(item);
    }
  }

  if (intent === 'education') {
    const topicMatch = message.match(/(?:about|what is|explain|how does|tell me about)\s+([^?.!]+)/i);
    if (topicMatch) {
      entities.topic = topicMatch[1].trim();
    }
  }

  return entities;
}
