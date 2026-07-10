import { buildUserContext } from './aiContextBuilder.js';
import { CoachPersonalityId } from './aiPersonality.js';
import { processUserMessage } from './orchestrator.js';
import { generateResponse, CoachContext } from './ruleEngine.js';

interface AIGenerationContext {
  userId: string;
  userName: string;
  personalityId?: CoachPersonalityId;
}

export async function generateWorkoutPlan(
  body: { level?: number; goal?: string; equipment?: string[]; injuries?: string[] },
  context: AIGenerationContext
) {
  let userContext;
  try {
    userContext = await buildUserContext(context.userId);
  } catch {
    userContext = {
      workoutStats: { totalWorkouts: 0, weeklyFrequency: 0 },
      recentMeals: [],
      weightLogs: [],
      personalRecords: [],
      conversations: [],
      settings: null,
      waterIntake: 0,
    };
  }

  const coachContext: CoachContext = {
    userId: context.userId,
    userName: context.userName,
    personalityId: context.personalityId || 'evidence-hypertrophy',
    message: `Generate a workout plan for ${body.goal || 'general fitness'}`,
    userGoals: body.goal,
    workoutStats: `${userContext.workoutStats.totalWorkouts} workouts, ${userContext.workoutStats.weeklyFrequency}x/week`,
    intent: 'planning',
    entities: {
      equipment: body.equipment,
      injuries: body.injuries,
      level: body.level,
      goal: body.goal,
    },
  };

  const response = generateResponse(coachContext);

  return {
    id: `wp-${Date.now()}`,
    name: `${body.goal || 'Full Body'} Workout`,
    type: 'full_body',
    difficulty: body.level && body.level >= 3 ? 'advanced' : 'intermediate',
    duration: 45,
    calories: 320,
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-12', rest: '90s' },
      { name: 'Squats', sets: 4, reps: '8-12', rest: '90s' },
      { name: 'Barbell Row', sets: 3, reps: '8-12', rest: '90s' },
      { name: 'Overhead Press', sets: 3, reps: '8-12', rest: '60s' },
    ],
    equipment: body.equipment || ['barbell', 'dumbbell'],
    notes: body.injuries?.length ? `Avoid strain on reported injuries: ${body.injuries.join(', ')}. Consult your doctor before starting.` : undefined,
    coachAdvice: response,
  };
}

export async function findExerciseReplacement(
  _body: { exerciseId?: string; constraints?: { equipment?: string[]; targetMuscles?: string[] } },
  _context: AIGenerationContext
) {
  return [
    {
      name: 'Incline Dumbbell Press',
      sets: 4,
      reps: '8-12',
      rest: '90s',
      equipment: ['dumbbell', 'bench'],
      reason: 'Great compound movement targeting upper chest with similar activation pattern.',
    },
    {
      name: 'Cable Flyes',
      sets: 3,
      reps: '10-15',
      rest: '60s',
      equipment: ['cable'],
      reason: 'Excellent isolation movement with constant tension throughout the range of motion.',
    },
    {
      name: 'Machine Chest Press',
      sets: 4,
      reps: '8-12',
      rest: '90s',
      equipment: ['machine'],
      reason: 'Stable movement pattern, good for beginners or when working around injuries.',
    },
  ];
}

export async function calculateProgressiveOverload(
  body: { exerciseId?: string; history?: { reps: number; weight: number; date: string }[] },
  _context: AIGenerationContext
) {
  const history = body.history || [];
  const last = history.length > 0 ? history[history.length - 1] : { reps: 8, weight: 135 };

  const nextWeight = Math.round(last.weight * 1.025);
  const nextReps = last.reps + 1;

  let suggestion = '';
  if (history.length >= 2) {
    const prev = history[history.length - 2];
    const weightProgress = last.weight > prev.weight;
    const repProgress = last.reps > prev.reps;

    if (weightProgress) {
      suggestion = `Great progress! You added weight last session. Try ${nextWeight}lbs for ${last.reps} reps, aiming for ${nextReps} reps when comfortable.`;
    } else if (repProgress) {
      suggestion = `Nice rep progression! Try ${nextWeight}lbs next session. If you hit ${nextReps} reps easily, increase weight next time.`;
    } else {
      suggestion = `Focus on technique and controlled reps. Aim for ${last.weight}lbs x ${nextReps} reps this session.`;
    }
  } else {
    suggestion = `Add 2.5% weight if reps completed easily. Try ${nextWeight}lbs for ${nextReps} reps.`;
  }

  return {
    exerciseId: body.exerciseId || '1',
    nextWeight,
    nextReps,
    suggestion,
  };
}

export async function getRecoveryRecommendations(
  body: { lastWorkout?: Date | string; sleepHours?: number; stressLevel?: number },
  _context: AIGenerationContext
) {
  const sleepHours = body.sleepHours ?? 7;
  const stressLevel = body.stressLevel ?? 0;
  const score = Math.max(0, Math.min(100, 85 - stressLevel * 5 - Math.max(0, 7 - sleepHours) * 8));

  const recommendations: string[] = [];

  if (sleepHours < 7) {
    recommendations.push('Aim for 7-9 hours of sleep. Try a consistent bedtime routine and avoid screens 30min before bed.');
  }

  if (stressLevel > 5) {
    recommendations.push('Elevated stress impacts recovery. Consider light activities like walking, stretching, or meditation.');
  }

  if (score < 60) {
    recommendations.push('Your recovery score is low. Consider a light active recovery day or full rest day.');
    recommendations.push('Focus on hydration: aim for 2-3 liters of water today.');
  } else if (score < 80) {
    recommendations.push('Moderate recovery. You can train but keep volume slightly reduced.');
    recommendations.push('Include an extra mobility block in your warmup.');
  } else {
    recommendations.push('You\'re well-recovered and ready for a productive session!');
    recommendations.push('Ensure a proper warm-up and fuel adequately before training.');
  }

  return {
    type: score >= 80 ? 'well_recovered' : 'active-recovery',
    score,
    status: score >= 80 ? 'well_recovered' : score >= 60 ? 'moderate' : 'fatigued',
    recommendations,
  };
}

export async function generateNutritionPlan(
  body: { calories: number; macros?: { protein?: number; carbs?: number; fat?: number } },
  _context: AIGenerationContext
) {
  const protein = body.macros?.protein ?? Math.round(body.calories * 0.3 / 4);
  const carbs = body.macros?.carbs ?? Math.round(body.calories * 0.4 / 4);
  const fat = body.macros?.fat ?? Math.round(body.calories * 0.3 / 9);

  return {
    id: `np-${Date.now()}`,
    dailyCalories: body.calories,
    macros: { protein, carbs, fat },
    meals: [
      {
        name: 'Breakfast',
        foods: [{ name: 'Oatmeal with Whey Protein', quantity: 1, unit: 'serving' }],
        calories: Math.round(protein * 0.25 * 4 + carbs * 0.3 * 4 + fat * 0.2 * 9),
        mealType: 'breakfast',
        macros: { protein: Math.round(protein * 0.25), carbs: Math.round(carbs * 0.3), fat: Math.round(fat * 0.2) },
      },
      {
        name: 'Lunch',
        foods: [{ name: 'Grilled Chicken with Rice and Vegetables', quantity: 1, unit: 'serving' }],
        calories: Math.round(protein * 0.35 * 4 + carbs * 0.35 * 4 + fat * 0.3 * 9),
        mealType: 'lunch',
        macros: { protein: Math.round(protein * 0.35), carbs: Math.round(carbs * 0.35), fat: Math.round(fat * 0.3) },
      },
      {
        name: 'Dinner',
        foods: [{ name: 'Salmon with Sweet Potato and Greens', quantity: 1, unit: 'serving' }],
        calories: Math.round(protein * 0.25 * 4 + carbs * 0.25 * 4 + fat * 0.35 * 9),
        mealType: 'dinner',
        macros: { protein: Math.round(protein * 0.25), carbs: Math.round(carbs * 0.25), fat: Math.round(fat * 0.35) },
      },
      {
        name: 'Snack',
        foods: [{ name: 'Greek Yogurt with Mixed Nuts', quantity: 1, unit: 'serving' }],
        calories: Math.round(protein * 0.15 * 4 + carbs * 0.1 * 4 + fat * 0.15 * 9),
        mealType: 'snack',
        macros: { protein: Math.round(protein * 0.15), carbs: Math.round(carbs * 0.1), fat: Math.round(fat * 0.15) },
      },
    ],
  };
}

export async function analyzeUserProgress(userId: string, _userName: string) {
  const orchestratorResponse = await processUserMessage(
    userId,
    'Analyze my recent progress and give me recommendations.',
    'evidence-hypertrophy'
  );

  return { analysis: orchestratorResponse.message };
}
