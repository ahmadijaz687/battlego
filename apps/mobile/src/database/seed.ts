import { insertRow } from './helpers';
import type { DB } from './index';
import { seedKnowledge } from './knowledgeSeed';

export function seedDatabase(db: DB): void {
  const exerciseCount = db.getFirstSync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM exercises'
  );
  if ((exerciseCount?.cnt ?? 0) > 0) {
    seedKnowledge(db);
    return;
  }

  db.withTransactionSync(() => {
    seedExerciseCategories(db);
    seedEquipment(db);
    seedMuscleGroups(db);
    seedExercises(db);
    seedFoodCategories(db);
    seedFoods(db);
    seedBattleTypes(db);
    seedAchievements(db);
    seedBadges(db);
    seedWorkoutTemplates(db);
  });

  seedKnowledge(db);
}

function seedExerciseCategories(db: DB): void {
  const categories = [
    { name: 'Strength', slug: 'strength', description: 'Resistance training', icon: '💪', sort_order: 1 },
    { name: 'Cardio', slug: 'cardio', description: 'Cardiovascular exercises', icon: '❤️', sort_order: 2 },
    { name: 'Flexibility', slug: 'flexibility', description: 'Stretching and mobility', icon: '🧘', sort_order: 3 },
    { name: 'Balance', slug: 'balance', description: 'Balance and stability', icon: '⚖️', sort_order: 4 },
    { name: 'Plyometric', slug: 'plyometric', description: 'Explosive movements', icon: '⚡', sort_order: 5 },
    { name: 'Core', slug: 'core', description: 'Core strengthening', icon: '🎯', sort_order: 6 },
    { name: 'Olympic Lift', slug: 'olympic-lift', description: 'Olympic weightlifting', icon: '🏋️', sort_order: 7 },
    { name: 'Calisthenics', slug: 'calisthenics', description: 'Bodyweight training', icon: '🤸', sort_order: 8 },
  ];
  for (const c of categories) {
    insertRow(db, 'exercise_categories', c);
  }
}

function seedEquipment(db: DB): void {
  const items = [
    { name: 'Barbell', category: 'free_weights', icon: '🏋️' },
    { name: 'Dumbbell', category: 'free_weights', icon: '🏋️' },
    { name: 'Kettlebell', category: 'free_weights', icon: '🔔' },
    { name: 'Cable Machine', category: 'machine', icon: '⚙️' },
    { name: 'Pull-up Bar', category: 'bodyweight', icon: '💪' },
    { name: 'Dip Station', category: 'bodyweight', icon: '💪' },
    { name: 'Bench', category: 'free_weights', icon: '🪑' },
    { name: 'Squat Rack', category: 'free_weights', icon: '🏗️' },
    { name: 'Resistance Band', category: 'accessory', icon: ' rubber_band' },
    { name: 'Medicine Ball', category: 'accessory', icon: '⚽' },
    { name: 'Foam Roller', category: 'recovery', icon: '🧱' },
    { name: 'Treadmill', category: 'cardio', icon: '🏃' },
    { name: 'Elliptical', category: 'cardio', icon: '🏃' },
    { name: 'Rowing Machine', category: 'cardio', icon: '🚣' },
    { name: 'Stationary Bike', category: 'cardio', icon: '🚴' },
    { name: 'TRX', category: 'bodyweight', icon: '🔗' },
    { name: 'Jump Rope', category: 'cardio', icon: '🤸' },
    { name: 'Bodyweight', category: 'none', icon: '💪' },
    { name: 'EZ Curl Bar', category: 'free_weights', icon: '🏋️' },
    { name: 'Landmine', category: 'free_weights', icon: '🏗️' },
  ];
  for (const item of items) {
    insertRow(db, 'equipment', item);
  }
}

function seedMuscleGroups(db: DB): void {
  const groups = [
    { name: 'Chest', body_region: 'upper', icon: '💪' },
    { name: 'Back', body_region: 'upper', icon: '🔙' },
    { name: 'Shoulders', body_region: 'upper', icon: '💪' },
    { name: 'Biceps', body_region: 'upper', icon: '💪' },
    { name: 'Triceps', body_region: 'upper', icon: '💪' },
    { name: 'Quadriceps', body_region: 'lower', icon: '🦵' },
    { name: 'Hamstrings', body_region: 'lower', icon: '🦵' },
    { name: 'Glutes', body_region: 'lower', icon: '🍑' },
    { name: 'Calves', body_region: 'lower', icon: '🦵' },
    { name: 'Abdominals', body_region: 'core', icon: '🎯' },
    { name: 'Forearms', body_region: 'upper', icon: '💪' },
    { name: 'Trapezius', body_region: 'upper', icon: '💪' },
    { name: 'Latissimus Dorsi', body_region: 'upper', icon: '🔙' },
    { name: 'Hip Flexors', body_region: 'lower', icon: '🦵' },
    { name: 'Full Body', body_region: 'full', icon: '🏋️' },
  ];
  for (const g of groups) {
    insertRow(db, 'muscle_groups', g);
  }
}

function seedExercises(db: DB): void {
  const exercises = [
    { name: 'Barbell Bench Press', primary_muscle: 'Chest', secondary_muscles: '["Triceps","Shoulders"]', equipment: '["Barbell","Bench"]', difficulty: 'intermediate', category: 'Strength', is_bodyweight: 0, met: 6.0, calories_per_min: 0.1 },
    { name: 'Barbell Squat', primary_muscle: 'Quadriceps', secondary_muscles: '["Hamstrings","Glutes"]', equipment: '["Barbell","Squat Rack"]', difficulty: 'intermediate', category: 'Strength', is_bodyweight: 0, met: 6.0, calories_per_min: 0.1 },
    { name: 'Deadlift', primary_muscle: 'Back', secondary_muscles: '["Hamstrings","Glutes","Forearms"]', equipment: '["Barbell"]', difficulty: 'advanced', category: 'Strength', is_bodyweight: 0, met: 6.0, calories_per_min: 0.12 },
    { name: 'Pull-ups', primary_muscle: 'Latissimus Dorsi', secondary_muscles: '["Biceps","Forearms"]', equipment: '["Pull-up Bar"]', difficulty: 'intermediate', category: 'Strength', is_bodyweight: 1, met: 8.0, calories_per_min: 0.1 },
    { name: 'Push-ups', primary_muscle: 'Chest', secondary_muscles: '["Triceps","Shoulders"]', equipment: '["Bodyweight"]', difficulty: 'beginner', category: 'Calisthenics', is_bodyweight: 1, met: 8.0, calories_per_min: 0.08 },
    { name: 'Overhead Press', primary_muscle: 'Shoulders', secondary_muscles: '["Triceps"]', equipment: '["Barbell"]', difficulty: 'intermediate', category: 'Strength', is_bodyweight: 0, met: 6.0, calories_per_min: 0.09 },
    { name: 'Barbell Row', primary_muscle: 'Back', secondary_muscles: '["Biceps","Forearms"]', equipment: '["Barbell"]', difficulty: 'intermediate', category: 'Strength', is_bodyweight: 0, met: 6.0, calories_per_min: 0.09 },
    { name: 'Dumbbell Lateral Raise', primary_muscle: 'Shoulders', secondary_muscles: '[]', equipment: '["Dumbbell"]', difficulty: 'beginner', category: 'Strength', is_bodyweight: 0, met: 3.0, calories_per_min: 0.06 },
    { name: 'Bicep Curl', primary_muscle: 'Biceps', secondary_muscles: '[]', equipment: '["Dumbbell"]', difficulty: 'beginner', category: 'Strength', is_bodyweight: 0, met: 3.0, calories_per_min: 0.05 },
    { name: 'Tricep Dip', primary_muscle: 'Triceps', secondary_muscles: '["Chest","Shoulders"]', equipment: '["Dip Station"]', difficulty: 'intermediate', category: 'Strength', is_bodyweight: 1, met: 8.0, calories_per_min: 0.08 },
    { name: 'Lunges', primary_muscle: 'Quadriceps', secondary_muscles: '["Glutes","Hamstrings"]', equipment: '["Dumbbell"]', difficulty: 'beginner', category: 'Strength', is_bodyweight: 1, met: 6.0, calories_per_min: 0.08 },
    { name: 'Plank', primary_muscle: 'Abdominals', secondary_muscles: '["Shoulders"]', equipment: '["Bodyweight"]', difficulty: 'beginner', category: 'Core', is_bodyweight: 1, met: 3.0, calories_per_min: 0.04 },
    { name: 'Russian Twist', primary_muscle: 'Abdominals', secondary_muscles: '[]', equipment: '["Medicine Ball"]', difficulty: 'beginner', category: 'Core', is_bodyweight: 1, met: 4.0, calories_per_min: 0.06 },
    { name: 'Treadmill Running', primary_muscle: 'Quadriceps', secondary_muscles: '["Hamstrings","Calves"]', equipment: '["Treadmill"]', difficulty: 'beginner', category: 'Cardio', is_bodyweight: 1, met: 9.8, calories_per_min: 0.17 },
    { name: 'Jump Rope', primary_muscle: 'Full Body', secondary_muscles: '["Calves","Shoulders"]', equipment: '["Jump Rope"]', difficulty: 'beginner', category: 'Cardio', is_bodyweight: 1, met: 12.3, calories_per_min: 0.15 },
    { name: 'Kettlebell Swing', primary_muscle: 'Glutes', secondary_muscles: '["Hamstrings","Back","Shoulders"]', equipment: '["Kettlebell"]', difficulty: 'intermediate', category: 'Plyometric', is_bodyweight: 0, met: 9.8, calories_per_min: 0.13 },
    { name: 'Romanian Deadlift', primary_muscle: 'Hamstrings', secondary_muscles: '["Glutes","Back"]', equipment: '["Barbell"]', difficulty: 'intermediate', category: 'Strength', is_bodyweight: 0, met: 6.0, calories_per_min: 0.1 },
    { name: 'Leg Press', primary_muscle: 'Quadriceps', secondary_muscles: '["Glutes","Hamstrings"]', equipment: '["Machine"]', difficulty: 'beginner', category: 'Strength', is_bodyweight: 0, met: 5.0, calories_per_min: 0.08 },
    { name: 'Cable Fly', primary_muscle: 'Chest', secondary_muscles: '["Shoulders"]', equipment: '["Cable Machine"]', difficulty: 'intermediate', category: 'Strength', is_bodyweight: 0, met: 4.0, calories_per_min: 0.07 },
    { name: 'Face Pull', primary_muscle: 'Shoulders', secondary_muscles: '["Back"]', equipment: '["Cable Machine"]', difficulty: 'beginner', category: 'Strength', is_bodyweight: 0, met: 3.0, calories_per_min: 0.05 },
  ];
  for (const e of exercises) {
    insertRow(db, 'exercises', e);
  }
}

function seedFoodCategories(db: DB): void {
  const cats = [
    { name: 'All', slug: 'all', icon: '🍽️', sort_order: 0 },
    { name: 'Meat', slug: 'meat', icon: '🥩', sort_order: 1 },
    { name: 'Seafood', slug: 'seafood', icon: '🐟', sort_order: 2 },
    { name: 'Protein', slug: 'protein', icon: '🥚', sort_order: 3 },
    { name: 'Grains', slug: 'grains', icon: '🌾', sort_order: 4 },
    { name: 'Vegetables', slug: 'vegetables', icon: '🥬', sort_order: 5 },
    { name: 'Fruits', slug: 'fruits', icon: '🍎', sort_order: 6 },
    { name: 'Dairy', slug: 'dairy', icon: '🧀', sort_order: 7 },
    { name: 'Nuts', slug: 'nuts', icon: '🥜', sort_order: 8 },
    { name: 'Supplements', slug: 'supplements', icon: '💊', sort_order: 9 },
    { name: 'Beverages', slug: 'beverages', icon: '🥤', sort_order: 10 },
    { name: 'Snacks', slug: 'snacks', icon: '🍪', sort_order: 11 },
    { name: 'Fast Food', slug: 'fast-food', icon: '🍔', sort_order: 12 },
    { name: 'Breakfast', slug: 'breakfast', icon: '🥞', sort_order: 13 },
  ];
  for (const c of cats) {
    insertRow(db, 'food_categories', c);
  }
}

function seedFoods(db: DB): void {
  const foods = [
    { name: 'Chicken Breast (grilled)', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving_size: '100g', category: 'Protein' },
    { name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 24, fat: 0.9, serving_size: '100g', category: 'Grains' },
    { name: 'Salmon (baked)', calories: 208, protein: 20, carbs: 0, fat: 13, serving_size: '100g', category: 'Seafood' },
    { name: 'Broccoli (steamed)', calories: 35, protein: 2.4, carbs: 7, fat: 0.4, serving_size: '100g', category: 'Vegetables' },
    { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, serving_size: '100g', category: 'Vegetables' },
    { name: 'Eggs (whole)', calories: 155, protein: 13, carbs: 1.1, fat: 11, serving_size: '100g', category: 'Protein' },
    { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving_size: '100g', category: 'Dairy' },
    { name: 'Oats', calories: 389, protein: 17, carbs: 66, fat: 7, serving_size: '100g', category: 'Grains' },
    { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving_size: '100g', category: 'Fruits' },
    { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, serving_size: '100g', category: 'Nuts' },
    { name: 'Whey Protein Powder', calories: 120, protein: 25, carbs: 3, fat: 1.5, serving_size: '1 scoop (30g)', category: 'Supplements' },
    { name: 'Whole Wheat Bread', calories: 247, protein: 13, carbs: 41, fat: 3.4, serving_size: '100g', category: 'Grains' },
    { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, serving_size: '100g', category: 'Fruits' },
    { name: 'Tuna (canned)', calories: 116, protein: 26, carbs: 0, fat: 0.8, serving_size: '100g', category: 'Seafood' },
    { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fat: 100, serving_size: '100ml', category: 'Nuts' },
  ];
  for (const f of foods) {
    insertRow(db, 'foods', f);
  }
}

function seedBattleTypes(db: DB): void {
  const types = [
    { name: 'Reps Challenge', description: 'Who can do the most reps?', is_ranked: 1, max_participants: 2, min_participants: 2, xp_multiplier: 1.0, coin_multiplier: 1.0 },
    { name: 'Calories Burn', description: 'Burn the most calories', is_ranked: 1, max_participants: 2, min_participants: 2, xp_multiplier: 1.2, coin_multiplier: 1.2 },
    { name: 'Duration Sprint', description: 'Longest workout wins', is_ranked: 1, max_participants: 2, min_participants: 2, xp_multiplier: 1.0, coin_multiplier: 1.0 },
    { name: 'Distance Challenge', description: 'Cover the most distance', is_ranked: 1, max_participants: 2, min_participants: 2, xp_multiplier: 1.1, coin_multiplier: 1.1 },
    { name: 'Workout Volume', description: 'Complete the most workouts', is_ranked: 1, max_participants: 2, min_participants: 2, xp_multiplier: 1.0, coin_multiplier: 1.0 },
  ];
  for (const t of types) {
    insertRow(db, 'battle_types', t);
  }
}

function seedAchievements(db: DB): void {
  const achievements = [
    { name: 'First Workout', description: 'Complete your first workout', icon: '🏋️', category: 'workout', xp_reward: 50, criteria: '{"workouts":1}' },
    { name: 'Week Warrior', description: 'Work out 7 days in a row', icon: '🔥', category: 'streak', xp_reward: 100, criteria: '{"streak":7}' },
    { name: 'PR Crusher', description: 'Set 5 personal records', icon: '💪', category: 'workout', xp_reward: 150, criteria: '{"prs":5}' },
    { name: 'Meal Prep Master', description: 'Log 30 meals', icon: '🥗', category: 'nutrition', xp_reward: 100, criteria: '{"meals":30}' },
    { name: 'Hydration Hero', description: 'Log water for 14 days straight', icon: '💧', category: 'health', xp_reward: 75, criteria: '{"water_days":14}' },
    { name: 'Battle Champion', description: 'Win your first battle', icon: '🏆', category: 'battle', xp_reward: 200, criteria: '{"battle_wins":1}' },
    { name: 'Habit Builder', description: 'Complete 30 habit logs', icon: '✅', category: 'habit', xp_reward: 100, criteria: '{"habit_logs":30}' },
    { name: 'Century Club', description: 'Complete 100 workouts', icon: '💯', category: 'workout', xp_reward: 500, criteria: '{"workouts":100}' },
  ];
  for (const a of achievements) {
    insertRow(db, 'achievements', a);
  }
}

function seedBadges(db: DB): void {
  const badges = [
    { key: 'iron_will', name: 'Iron Will', description: 'Work out for 30 days', icon: '🏋️', tier: 'common', xp_reward: 50 },
    { key: 'fire_starter', name: 'Fire Starter', description: 'Start a 7-day streak', icon: '🔥', tier: 'common', xp_reward: 30 },
    { key: 'beast_mode', name: 'Beast Mode', description: 'Complete 50 workouts', icon: ' Beast', tier: 'rare', xp_reward: 100 },
    { key: 'legendary_lift', name: 'Legendary Lift', description: 'Set 25 personal records', icon: '⭐', tier: 'epic', xp_reward: 200 },
    { key: 'unstoppable', name: 'Unstoppable', description: 'Reach level 50', icon: '🚀', tier: 'legendary', xp_reward: 500 },
  ];
  for (const b of badges) {
    insertRow(db, 'badges', b);
  }
}

function seedWorkoutTemplates(db: DB): void {
  const templates = [
    {
      name: 'Full Body Strength',
      description: 'A complete full body workout targeting all major muscle groups',
      difficulty: 'intermediate',
      duration: 45,
      exercises: JSON.stringify([
        { exerciseId: '', name: 'Barbell Squat', sets: 4, reps: 8, rest: 90 },
        { exerciseId: '', name: 'Barbell Bench Press', sets: 4, reps: 8, rest: 90 },
        { exerciseId: '', name: 'Barbell Row', sets: 4, reps: 8, rest: 90 },
        { exerciseId: '', name: 'Overhead Press', sets: 3, reps: 10, rest: 60 },
        { exerciseId: '', name: 'Plank', sets: 3, reps: 60, rest: 30 },
      ]),
    },
  ];
  for (const t of templates) {
    insertRow(db, 'workout_templates', t);
  }
}
