export function generateWorkoutPlan(body) {
    const { level, goal, equipment, injuries } = body;
    return {
        id: 'wp-' + Date.now(),
        name: (goal ? goal.replace('_', ' ') : 'Full Body') + ' Workout',
        type: 'full_body',
        exercises: [
            { id: '1', name: 'Bench Press', sets: 4, reps: '8-12', rest: '90s' },
            { id: '2', name: 'Squats', sets: 4, reps: '8-12', rest: '90s' },
        ],
        duration: 45,
        calories: 320,
        difficulty: level && level >= 3 ? 'advanced' : 'intermediate',
        equipment: equipment && equipment.length > 0 ? equipment : ['barbell', 'dumbbell'],
        notes: injuries && injuries.length > 0 ? 'Avoid strain on reported injuries.' : undefined,
    };
}
export function findExerciseReplacement(body) {
    const { exerciseId } = body;
    return [
        { id: (exerciseId || '1') + '-alt-1', name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', rest: '90s' },
        { id: (exerciseId || '1') + '-alt-2', name: 'Cable Flyes', sets: 3, reps: '10-15', rest: '60s' },
    ];
}
export function calculateProgressiveOverload(body) {
    const { history } = body;
    const last = history && history.length > 0 ? history[history.length - 1] : { reps: 8, weight: 135 };
    return {
        exerciseId: body.exerciseId || '1',
        nextWeight: Math.round((last.weight || 135) * 1.025),
        nextReps: (last.reps || 8) + 1,
        suggestion: 'Add 2.5% weight if reps completed easily.',
    };
}
export function getRecoveryRecommendations(body) {
    const { sleepHours = 7, stressLevel = 0 } = body;
    const score = Math.max(0, Math.min(100, 85 - stressLevel * 5 - Math.max(0, 7 - sleepHours) * 8));
    return {
        type: score >= 80 ? 'well_recovered' : 'active-recovery',
        score,
        status: score >= 80 ? 'well_recovered' : 'fatigued',
        recommendations: [
            'Focus on hydration today.',
            'Include 10 minutes of mobility work.',
            'Keep sleep above 7 hours tonight.',
        ],
    };
}
export function generateNutritionPlan(body) {
    const protein = body.macros?.protein ?? 120;
    const carbs = body.macros?.carbs ?? 200;
    const fat = body.macros?.fat ?? 70;
    return {
        id: 'np-' + Date.now(),
        dailyCalories: body.calories,
        macros: { protein, carbs, fat },
        meals: [
            { id: '1', name: 'Breakfast', foods: [{ id: '1', name: 'Oatmeal', quantity: 1, unit: 'cup' }], calories: 400, mealType: 'breakfast' },
            { id: '2', name: 'Lunch', foods: [{ id: '2', name: 'Grilled Chicken', quantity: 180, unit: 'g' }], calories: 550, mealType: 'lunch' },
            { id: '3', name: 'Dinner', foods: [{ id: '3', name: 'Salmon', quantity: 150, unit: 'g' }], calories: 450, mealType: 'dinner' },
            { id: '4', name: 'Snack', foods: [{ id: '4', name: 'Greek Yogurt', quantity: 170, unit: 'g' }], calories: 150, mealType: 'snack' },
        ],
    };
}
export function generateChatReply(message) {
    const normalized = message.toLowerCase().trim();
    if (normalized.includes('hello') || normalized.includes('hi')) {
        return 'Hey! How can I help with your fitness today?';
    }
    if (normalized.includes('workout') || normalized.includes('exercise')) {
        return 'Try this: 3 sets of Bench Press at 8-12 reps, then 3 sets of Squats. Rest 90s between sets.';
    }
    if (normalized.includes('nutrition') || normalized.includes('meal') || normalized.includes('food')) {
        return 'For your goals, aim for 120g protein, 200g carbs, and 70g fat today. Need a meal plan?';
    }
    if (normalized.includes('recovery') || normalized.includes('sleep') || normalized.includes('tired')) {
        return 'Recovery score looks moderate. Prioritize 7+ hours of sleep and stay hydrated.';
    }
    return 'That sounds like a good step. Want me to build a plan around it?';
}
