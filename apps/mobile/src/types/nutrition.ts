export interface Food {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  barcode?: string;
}

export interface Meal {
  id: string;
  name: string;
  foods: { foodId: string; quantity: number }[];
  time?: string;
}

export interface DailyLog {
  date: string;
  meals: Meal[];
  water: number;
  waterGoal: number;
}

export interface NutritionGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
  unit: 'lbs' | 'kg';
}

export interface WeightGoal extends WeightLog {
  targetWeight: number;
  goalType: 'lose' | 'maintain' | 'gain';
}

export interface BodyMeasurement {
  id: string;
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulders?: number;
  arms?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  neck?: number;
  bodyFat?: number;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  time: string;
  startDate: string;
  endDate?: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  completed: boolean;
}

export interface WaterLog {
  id: string;
  amount: number;
  date: string;
}