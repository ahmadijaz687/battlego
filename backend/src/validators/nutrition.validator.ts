import { z } from 'zod';
import { validate } from '../middlewares/validation.js';

export const mealSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  time: z.string().max(50).optional(),
  foods: z.array(z.object({
    foodId: z.string().uuid(),
    quantity: z.number().positive('Quantity must be positive'),
  })).min(1, 'At least one food item is required'),
});

export const updateMealSchema = mealSchema.partial();

export const foodEntrySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  brand: z.string().max(255).trim().optional(),
  calories: z.number().int().positive('Calories must be positive'),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  servingSize: z.string().min(1).max(100).trim(),
  barcode: z.string().max(255).trim().optional(),
});

export const waterLogSchema = z.object({
  amount: z.number().int().positive('Amount must be positive'),
});

export const weightLogSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  weight: z.number().positive('Weight must be positive'),
  unit: z.enum(['lbs', 'kg']),
});

export const measurementSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  chest: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  hips: z.number().positive().optional(),
  shoulders: z.number().positive().optional(),
  arms: z.number().positive().optional(),
  forearms: z.number().positive().optional(),
  thighs: z.number().positive().optional(),
  calves: z.number().positive().optional(),
  neck: z.number().positive().optional(),
  bodyFat: z.number().min(0).max(100).optional(),
});

export const shoppingItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().max(50).trim(),
  category: z.string().max(100).trim(),
});

export const updateShoppingItemSchema = shoppingItemSchema.partial().extend({
  completed: z.boolean().optional(),
});

export const validateMeal = validate(mealSchema);
export const validateUpdateMeal = validate(updateMealSchema);
export const validateFoodEntry = validate(foodEntrySchema);
export const validateWaterLog = validate(waterLogSchema);
export const validateWeightLog = validate(weightLogSchema);
export const validateMeasurement = validate(measurementSchema);
export const validateShoppingItem = validate(shoppingItemSchema);
export const validateUpdateShoppingItem = validate(updateShoppingItemSchema);
