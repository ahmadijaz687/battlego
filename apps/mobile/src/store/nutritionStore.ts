import { create } from 'zustand';
import { Meal, DailyLog, NutritionGoal } from '../types/nutrition';
import { FoodItem } from '../types/food';
import { Recipe } from '../data/recipes';
import * as nutritionService from '../services/nutritionService';
import { useAuthStore } from './authStore';

interface NutritionState {
  dailyLog: DailyLog | null;
  foods: FoodItem[];
  meals: any[];
  waterLogs: any[];
  weightLogs: any[];
  bodyMeasurements: any[];
  favorites: Set<string>;
  recipes: Recipe[];
  goals: NutritionGoal | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  logFood: (foodId: string, quantity: number, mealId?: string) => void;
  addWater: (amount: number) => void;
  setGoals: (goals: NutritionGoal) => void;
  toggleFavorite: (foodId: string) => void;
  createMeal: (meal: Omit<Meal, 'id'>) => void;
  logRecipe: (recipeId: string) => void;
  loadFoods: (query?: string) => void;
  loadDailyLog: (date?: string) => void;
  loadRecipes: () => void;
  fetchFoods: (query?: string) => void;
  fetchMeals: (date?: string) => void;
  fetchWaterLogs: (date?: string) => void;
  createWaterLog: (amount: number) => void;
  fetchWeightLogs: () => void;
  createWeightLog: (data: { weight: number; unit?: string; date?: string }) => void;
  fetchBodyMeasurements: () => void;
}

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]!;
}

export const useNutritionStore = create<NutritionState>((set, get) => ({
  dailyLog: null,
  foods: [],
  meals: [],
  waterLogs: [],
  weightLogs: [],
  bodyMeasurements: [],
  favorites: new Set(),
  recipes: [],
  goals: null,
  searchQuery: '',
  isLoading: false,
  error: null,

  setSearchQuery: (query) => set({ searchQuery: query }),

  logFood: (foodId, quantity, mealId) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      if (mealId) {
        nutritionService.addFoodToMeal(mealId, foodId, quantity, userId);
      }
      const { dailyLog } = get();
      if (dailyLog) {
        const updatedLog: DailyLog = {
          ...dailyLog,
          meals: mealId
            ? dailyLog.meals.map((meal) =>
                meal.id === mealId
                  ? { ...meal, foods: [...meal.foods, { foodId, quantity }] }
                  : meal
              )
            : dailyLog.meals,
        };
        set({ dailyLog: updatedLog });
      }
    } catch (err) {
      set({ error: 'Failed to log food' });
    }
  },

  addWater: (amount) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      nutritionService.logWater(userId, amount);
      const { dailyLog } = get();
      if (dailyLog) {
        set({ dailyLog: { ...dailyLog, water: dailyLog.water + amount } });
      }
    } catch (err) {
      set({ error: 'Failed to log water' });
    }
  },

  setGoals: (goals) => set({ goals }),

  toggleFavorite: (foodId) => {
    const { favorites } = get();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(foodId)) {
      newFavorites.delete(foodId);
    } else {
      newFavorites.add(foodId);
    }
    set({ favorites: newFavorites });
  },

  createMeal: (meal) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const row = nutritionService.createMeal(userId, {
        name: meal.name,
      });
      for (const food of meal.foods) {
        nutritionService.addFoodToMeal(row.id, food.foodId, food.quantity, userId);
      }
      const newMeal: Meal = { ...meal, id: row.id };
      const { dailyLog } = get();
      if (dailyLog) {
        set({ dailyLog: { ...dailyLog, meals: [...dailyLog.meals, newMeal] } });
      }
    } catch (err) {
      set({ error: 'Failed to create meal' });
    }
  },

  logRecipe: (recipeId) => {
    const { recipes, dailyLog } = get();
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe && dailyLog) {
      const newMeal: Meal = {
        id: Date.now().toString(),
        name: recipe.name,
        foods: recipe.ingredients.map((i) => ({ foodId: i.foodId, quantity: i.quantity })),
      };
      set({ dailyLog: { ...dailyLog, meals: [...dailyLog.meals, newMeal] } });
    }
  },

  loadFoods: (query) => {
    try {
      set({ isLoading: true, error: null });
      const rows = nutritionService.searchFoods(query ?? '');
      const foods: FoodItem[] = rows.map((r) => ({
        id: r.id,
        name: r.name,
        brand: r.brand,
        calories: r.calories,
        protein: r.protein,
        carbs: r.carbs,
        fat: r.fat,
        servingSize: r.serving_size,
        category: r.category,
      } as FoodItem));
      set({ foods, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load foods' });
    }
  },

  loadDailyLog: (date) => {
    const userId = getUserId();
    if (!userId) return;
    const dateStr = date ?? todayStr();
    try {
      set({ isLoading: true, error: null });
      const macros = nutritionService.getDailyMacros(userId, dateStr);
      const dailyLog: DailyLog = {
        date: macros.date,
        water: 0,
        waterGoal: 2500,
        meals: macros.meals.map((m) => ({
          id: m.id,
          name: m.name,
          foods: m.foods.map((f) => ({
            foodId: f.food_id,
            quantity: f.quantity,
          })),
        })),
      };

      const waterLogs = nutritionService.getWaterLog(userId, dateStr);
      dailyLog.water = waterLogs.reduce((sum, w) => sum + w.amount, 0);

      set({ dailyLog, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load daily log' });
    }
  },

  loadRecipes: () => {
    try {
      set({ isLoading: true, error: null });
      set({ recipes: [], isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load recipes' });
    }
  },

  fetchFoods: (query) => {
    get().loadFoods(query);
  },

  fetchMeals: (date) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const dateStr = date ?? new Date().toISOString().split('T')[0]!;
      const macros = nutritionService.getDailyMacros(userId, dateStr);
      set({ meals: macros.meals, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load meals' });
    }
  },

  fetchWaterLogs: (date) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const logs = nutritionService.getWaterLog(userId, date);
      set({ waterLogs: logs, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load water logs' });
    }
  },

  createWaterLog: (amount) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      nutritionService.logWater(userId, amount);
      const logs = nutritionService.getWaterLog(userId);
      set({ waterLogs: logs });
    } catch (err) {
      set({ error: 'Failed to log water' });
    }
  },

  fetchWeightLogs: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const logs = nutritionService.getWeightHistory(userId);
      set({ weightLogs: logs, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load weight logs' });
    }
  },

  createWeightLog: (data) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      nutritionService.logWeight(userId, data.weight, (data.unit as 'lbs' | 'kg') ?? 'lbs', data.date);
      const logs = nutritionService.getWeightHistory(userId);
      set({ weightLogs: logs });
    } catch (err) {
      set({ error: 'Failed to log weight' });
    }
  },

  fetchBodyMeasurements: () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const logs = nutritionService.getBodyMeasurements(userId);
      set({ bodyMeasurements: logs, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load body measurements' });
    }
  },
}));
