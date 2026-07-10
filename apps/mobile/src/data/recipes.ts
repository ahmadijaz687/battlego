

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Array<{ foodId: string; quantity: number; unit: string }>;
  instructions: string[];
  tags?: string[];
  verified?: boolean;
}

export const recipes: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Greek Yogurt Bowl',
    description: 'Protein-packed breakfast bowl',
    servings: 1,
    prepTime: 5,
    calories: 350,
    protein: 25,
    carbs: 30,
    fat: 10,
    ingredients: [
      { foodId: 'greek-yogurt', quantity: 200, unit: 'g' },
      { foodId: 'banana', quantity: 1, unit: 'medium' },
      { foodId: 'almond-butter', quantity: 1, unit: 'tbsp' },
    ],
    instructions: [
      'Add Greek yogurt to bowl',
      'Slice banana and add to bowl',
      'Drizzle with almond butter',
    ],
    tags: ['breakfast', 'high-protein'],
  },
  {
    id: 'recipe-2',
    name: 'Grilled Chicken Bowl',
    description: 'Lean protein with rice and vegetables',
    servings: 1,
    prepTime: 10,
    cookTime: 15,
    calories: 450,
    protein: 35,
    carbs: 45,
    fat: 12,
    ingredients: [
      { foodId: 'chicken-breast', quantity: 150, unit: 'g' },
      { foodId: 'brown-rice', quantity: 150, unit: 'g' },
      { foodId: 'broccoli', quantity: 100, unit: 'g' },
    ],
    instructions: [
      'Season chicken with salt and pepper',
      'Grill chicken until cooked through',
      'Steam broccoli',
      'Serve over brown rice',
    ],
    tags: ['lunch', 'high-protein', 'meal-prep'],
  },
];