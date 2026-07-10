import { randomUUID } from 'expo-crypto';
import { getDatabase, type DB } from '../database';
import type {
  FoodRow,
  MealRow,
  MealFoodRow,
  WaterLogRow,
  WeightLogRow,
  BodyMeasurementRow,
  DailyMacros,
} from '../database/types';
import { now, today } from '../database/helpers';

function getDb(): DB {
  return getDatabase();
}

// ── Foods ──────────────────────────────────────────────────────

export function searchFoods(q: string, category?: string, limit = 50): FoodRow[] {
  const d = getDb();
  let sql = 'SELECT * FROM foods WHERE 1=1';
  const params: unknown[] = [];
  if (q) {
    sql += ' AND (name LIKE ? OR brand LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  sql += ' ORDER BY name ASC LIMIT ?';
  params.push(limit);
  return d.getAllSync<FoodRow>(sql, params as any);
}

export function getFoodById(foodId: string): FoodRow | null {
  return getDb().getFirstSync<FoodRow>('SELECT * FROM foods WHERE id = ?', [foodId]);
}

export function createFood(data: {
  name: string; brand?: string; calories: number;
  protein: number; carbs: number; fat: number;
  servingSize: string; category?: string;
}): FoodRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    `INSERT INTO foods (id, name, brand, calories, protein, carbs, fat, serving_size, category)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.name, data.brand ?? null, data.calories, data.protein, data.carbs, data.fat, data.servingSize, data.category ?? null]
  );
  return d.getFirstSync<FoodRow>('SELECT * FROM foods WHERE id = ?', [id])!;
}

// ── Meals ──────────────────────────────────────────────────────

export function createMeal(userId: string, data: {
  name: string; type?: string; date?: string; time?: string;
}): MealRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    'INSERT INTO meals (id, user_id, name, type, date, time) VALUES (?, ?, ?, ?, ?, ?)',
    [id, userId, data.name, data.type ?? 'BREAKFAST', data.date ?? today(), data.time ?? null]
  );
  return d.getFirstSync<MealRow>('SELECT * FROM meals WHERE id = ?', [id])!;
}

export function addFoodToMeal(mealId: string, foodId: string, quantity: number, userId?: string): MealFoodRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    'INSERT OR REPLACE INTO meal_foods (id, meal_id, food_id, quantity, user_id) VALUES (?, ?, ?, ?, ?)',
    [id, mealId, foodId, quantity, userId ?? null]
  );
  return d.getFirstSync<MealFoodRow>('SELECT * FROM meal_foods WHERE id = ?', [id])!;
}

export function removeFoodFromMeal(mealId: string, foodId: string): void {
  getDb().runSync('DELETE FROM meal_foods WHERE meal_id = ? AND food_id = ?', [mealId, foodId]);
}

export function getMealsByDate(userId: string, date: string): (MealRow & { foods: (MealFoodRow & { food: FoodRow })[] })[] {
  const d = getDb();
  const meals = d.getAllSync<MealRow>(
    'SELECT * FROM meals WHERE user_id = ? AND date = ? ORDER BY created_at ASC', [userId, date]
  );

  return meals.map((meal) => {
    const foods = d.getAllSync<MealFoodRow>(
      'SELECT * FROM meal_foods WHERE meal_id = ?', [meal.id]
    ).map((mf) => {
      const food = d.getFirstSync<FoodRow>('SELECT * FROM foods WHERE id = ?', [mf.food_id]);
      return { ...mf, food: food ?? { id: mf.food_id, name: 'Unknown', calories: 0, protein: 0, carbs: 0, fat: 0, serving_size: '100g', brand: null, category: null } as FoodRow };
    });
    return { ...meal, foods };
  });
}

export function getDailyMacros(userId: string, date: string): DailyMacros {
  const meals = getMealsByDate(userId, date);

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  for (const meal of meals) {
    for (const mf of meal.foods) {
      const servingSize = mf.food.serving_size;
      const numericServing = parseFloat(servingSize) || 100;
      const multiplier = mf.quantity / numericServing;

      totalCalories += Math.round(mf.food.calories * multiplier);
      totalProtein += Math.round(mf.food.protein * multiplier * 10) / 10;
      totalCarbs += Math.round(mf.food.carbs * multiplier * 10) / 10;
      totalFat += Math.round(mf.food.fat * multiplier * 10) / 10;
    }
  }

  return { date, calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fat: totalFat, meals };
}

// ── Water ──────────────────────────────────────────────────────

export function logWater(userId: string, amount: number): WaterLogRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    'INSERT INTO water_logs (id, user_id, amount, date) VALUES (?, ?, ?, ?)',
    [id, userId, amount, now()]
  );
  return d.getFirstSync<WaterLogRow>('SELECT * FROM water_logs WHERE id = ?', [id])!;
}

export function getWaterLog(userId: string, date?: string): WaterLogRow[] {
  const d = getDb();
  if (date) {
    return d.getAllSync<WaterLogRow>(
      'SELECT * FROM water_logs WHERE user_id = ? AND date LIKE ? ORDER BY date DESC',
      [userId, `${date}%`]
    );
  }
  return d.getAllSync<WaterLogRow>(
    'SELECT * FROM water_logs WHERE user_id = ? ORDER BY date DESC', [userId]
  );
}

// ── Weight ─────────────────────────────────────────────────────

export function logWeight(userId: string, weight: number, unit: 'lbs' | 'kg', date?: string): WeightLogRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    'INSERT INTO weight_logs (id, user_id, date, weight, unit) VALUES (?, ?, ?, ?, ?)',
    [id, userId, date ?? today(), weight, unit]
  );
  return d.getFirstSync<WeightLogRow>('SELECT * FROM weight_logs WHERE id = ?', [id])!;
}

export function getWeightHistory(userId: string, limit = 90): WeightLogRow[] {
  return getDb().getAllSync<WeightLogRow>(
    'SELECT * FROM weight_logs WHERE user_id = ? ORDER BY date DESC LIMIT ?', [userId, limit]
  );
}

// ── Body Measurements ──────────────────────────────────────────

export function logBodyMeasurement(userId: string, data: {
  date?: string; chest?: number; waist?: number; hips?: number;
  shoulders?: number; arms?: number; forearms?: number;
  thighs?: number; calves?: number; neck?: number; bodyFat?: number;
}): BodyMeasurementRow {
  const d = getDb();
  const id = randomUUID();
  d.runSync(
    `INSERT INTO body_measurements (id, user_id, date, chest, waist, hips, shoulders, arms, forearms, thighs, calves, neck, body_fat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, data.date ?? today(), data.chest ?? null, data.waist ?? null,
     data.hips ?? null, data.shoulders ?? null, data.arms ?? null,
     data.forearms ?? null, data.thighs ?? null, data.calves ?? null,
     data.neck ?? null, data.bodyFat ?? null]
  );
  return d.getFirstSync<BodyMeasurementRow>('SELECT * FROM body_measurements WHERE id = ?', [id])!;
}

export function getBodyMeasurements(userId: string, limit = 30): BodyMeasurementRow[] {
  return getDb().getAllSync<BodyMeasurementRow>(
    'SELECT * FROM body_measurements WHERE user_id = ? ORDER BY date DESC LIMIT ?', [userId, limit]
  );
}

// ── Delete Operations ──────────────────────────────────────────

export function deleteMeal(mealId: string, userId: string): boolean {
  const d = getDb();
  const meal = d.getFirstSync<MealRow>('SELECT * FROM meals WHERE id = ? AND user_id = ?', [mealId, userId]);
  if (!meal) return false;
  d.runSync('DELETE FROM meals WHERE id = ?', [mealId]);
  return true;
}

export function deleteWaterLog(logId: string, userId: string): boolean {
  const d = getDb();
  const log = d.getFirstSync<WaterLogRow>('SELECT * FROM water_logs WHERE id = ? AND user_id = ?', [logId, userId]);
  if (!log) return false;
  d.runSync('DELETE FROM water_logs WHERE id = ?', [logId]);
  return true;
}

export function deleteWeightLog(logId: string, userId: string): boolean {
  const d = getDb();
  const log = d.getFirstSync<WeightLogRow>('SELECT * FROM weight_logs WHERE id = ? AND user_id = ?', [logId, userId]);
  if (!log) return false;
  d.runSync('DELETE FROM weight_logs WHERE id = ?', [logId]);
  return true;
}
