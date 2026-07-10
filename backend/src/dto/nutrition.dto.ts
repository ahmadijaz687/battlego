export interface CreateMealDTO {
  name: string;
  time?: string;
  foods: {
    foodId: string;
    quantity: number;
  }[];
}

export interface UpdateMealDTO {
  name?: string;
  time?: string;
  foods?: {
    foodId: string;
    quantity: number;
  }[];
}

export interface CreateFoodEntryDTO {
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  barcode?: string;
}

export interface WaterLogDTO {
  amount: number;
}

export interface WeightLogDTO {
  date: string;
  weight: number;
  unit: 'lbs' | 'kg';
}

export interface BodyMeasurementDTO {
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

export interface ShoppingListItemDTO {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}
