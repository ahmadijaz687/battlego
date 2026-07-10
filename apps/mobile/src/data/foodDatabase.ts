import { FoodItem } from '../types/food';

const foods: FoodItem[] = [
  // Proteins
  { id: 'chicken-breast', name: 'Chicken Breast', category: 'Protein', servingSize: '100', servingUnit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6, sodium: 74, popularity: 100, searchKeywords: ['chicken', 'protein', 'lean'] },
  { id: 'salmon', name: 'Salmon', category: 'Protein', servingSize: '100', servingUnit: 'g', calories: 208, protein: 20, carbs: 0, fat: 13, sodium: 50, popularity: 95, searchKeywords: ['fish', 'omega', 'salmon'] },
  { id: 'egg', name: 'Egg', category: 'Protein', servingSize: '1', servingUnit: 'large', calories: 72, protein: 6.3, carbs: 0.6, fat: 4.8, sodium: 62, popularity: 85, searchKeywords: ['egg', 'protein', 'breakfast'] },
  { id: 'greek-yogurt', name: 'Greek Yogurt', category: 'Dairy', servingSize: '100', servingUnit: 'g', calories: 100, protein: 10, carbs: 6, fat: 0.4, sodium: 20, popularity: 80, searchKeywords: ['yogurt', 'protein', 'dairy'] },
  
  // Carbs
  { id: 'brown-rice', name: 'Brown Rice', category: 'Grains', servingSize: '100', servingUnit: 'g', calories: 112, protein: 2.6, carbs: 23, fat: 0.9, sodium: 5, popularity: 85, searchKeywords: ['rice', 'carbs', 'grain'] },
  { id: 'oatmeal', name: 'Oatmeal', category: 'Grains', servingSize: '40', servingUnit: 'g', calories: 150, protein: 5, carbs: 27, fat: 3, sodium: 2, popularity: 80, searchKeywords: ['oats', 'breakfast', 'carbs'] },
  { id: 'sweet-potato', name: 'Sweet Potato', category: 'Vegetables', servingSize: '150', servingUnit: 'g', calories: 112, protein: 2.3, carbs: 26, fat: 0.1, sodium: 4, popularity: 75, searchKeywords: ['potato', 'vegetable', 'carb'] },
  { id: 'banana', name: 'Banana', category: 'Fruits', servingSize: '1', servingUnit: 'medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, sodium: 1, popularity: 90, searchKeywords: ['fruit', 'potassium', 'carb'] },
  
  // Vegetables
  { id: 'broccoli', name: 'Broccoli', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, sodium: 33, potassium: 230, vitaminC: 89, popularity: 70, searchKeywords: ['vegetable', 'green', 'fiber'] },
  { id: 'avocado', name: 'Avocado', category: 'Fruits', servingSize: '1', servingUnit: 'medium', calories: 234, protein: 2.9, carbs: 12, fat: 21, sodium: 7, potassium: 487, popularity: 85, searchKeywords: ['healthy fat', 'avocado'] },
  { id: 'spinach', name: 'Spinach', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, vitaminA: 469, iron: 2.7, popularity: 60, searchKeywords: ['leafy', 'green', 'iron'] },
  
  // Fruits
  { id: 'apple', name: 'Apple', category: 'Fruits', servingSize: '1', servingUnit: 'medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, vitaminC: 8, popularity: 85, searchKeywords: ['fruit', 'fiber', 'snack'] },
  { id: 'blueberries', name: 'Blueberries', category: 'Fruits', servingSize: '100', servingUnit: 'g', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, vitaminK: 19.3, popularity: 75, searchKeywords: ['berry', 'antioxidant'] },
  
  // Nuts & Seeds
  { id: 'almond-butter', name: 'Almond Butter', category: 'Nuts', servingSize: '2', servingUnit: 'tbsp', calories: 190, protein: 6, carbs: 6, fat: 16, fiber: 3, vitaminE: 3.6, popularity: 80, searchKeywords: ['nut', 'butter', 'healthy fat'] },
  
  // Beverages
  { id: 'protein-shake', name: 'Protein Shake', category: 'Beverages', servingSize: '30', servingUnit: 'g', calories: 120, protein: 25, carbs: 3, fat: 1, popularity: 70, searchKeywords: ['shake', 'protein', 'supplement'] },
  
  // More foods to reach 50+
  { id: 'tilapia', name: 'Tilapia', category: 'Protein', servingSize: '100', servingUnit: 'g', calories: 96, protein: 18, carbs: 0, fat: 2.7, popularity: 55, searchKeywords: ['fish', 'white fish'] },
  { id: 'ground-beef', name: 'Ground Beef (90%) Lean', category: 'Protein', servingSize: '100', servingUnit: 'g', calories: 217, protein: 20, carbs: 0, fat: 16, sodium: 55, popularity: 85, searchKeywords: ['beef', 'red meat'] },
  { id: 'tuna', name: 'Tuna (canned)', category: 'Protein', servingSize: '100', servingUnit: 'g', calories: 132, protein: 29, carbs: 0, fat: 1, sodium: 400, popularity: 70, searchKeywords: ['fish', 'canned', 'protein'] },
  { id: 'quinoa', name: 'Quinoa', category: 'Grains', servingSize: '100', servingUnit: 'g', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, popularity: 65, searchKeywords: ['grain', 'gluten free', 'protein'] },
  { id: 'bread-wheat', name: 'Whole Wheat Bread', category: 'Grains', servingSize: '1', servingUnit: 'slice', calories: 82, protein: 4, carbs: 14, fat: 1.3, fiber: 2.7, popularity: 75, searchKeywords: ['bread', 'carb', 'grain'] },
  // ===== POULTRY =====
  { id: 'chicken-drums', name: 'Chicken Drumsticks', category: 'Meat', servingSize: '100', servingUnit: 'g', calories: 170, protein: 19, carbs: 0, fat: 9, sodium: 80, popularity: 85, searchKeywords: ['chicken', 'drumstick', 'leg'] },
  { id: 'chicken-thigh', name: 'Chicken Thigh', category: 'Meat', servingSize: '100', servingUnit: 'g', calories: 209, protein: 20, carbs: 0, fat: 13, sodium: 70, popularity: 90, searchKeywords: ['chicken', 'protein', 'thigh'] },
  { id: 'turkey-breast', name: 'Turkey Breast', category: 'Meat', servingSize: '100', servingUnit: 'g', calories: 135, protein: 30, carbs: 0, fat: 1, sodium: 75, popularity: 78, searchKeywords: ['turkey', 'protein', 'lean'] },
  { id: 'ground-turkey', name: 'Ground Turkey (93%)', category: 'Meat', servingSize: '100', servingUnit: 'g', calories: 170, protein: 21, carbs: 0, fat: 7, sodium: 70, popularity: 75, searchKeywords: ['turkey', 'ground', 'lean'] },
  // ===== RED MEAT =====
  { id: 'beef-sirloin', name: 'Beef Sirloin', category: 'Meat', servingSize: '100', servingUnit: 'g', calories: 207, protein: 29, carbs: 0, fat: 9, sodium: 55, popularity: 88, searchKeywords: ['beef', 'steak', 'sirloin', 'grilled'] },
  { id: 'beef-ribeye', name: 'Beef Ribeye', category: 'Meat', servingSize: '100', servingUnit: 'g', calories: 291, protein: 20, carbs: 0, fat: 22, sodium: 55, popularity: 92, searchKeywords: ['beef', 'steak', 'ribeye'] },
  { id: 'lean-ground-beef', name: 'Ground Beef (90% Lean)', category: 'Meat', servingSize: '100', servingUnit: 'g', calories: 217, protein: 20, carbs: 0, fat: 16, sodium: 60, popularity: 85, searchKeywords: ['beef', 'ground', 'burger'] },
  { id: 'pork-chop', name: 'Pork Chop', category: 'Meat', servingSize: '100', servingUnit: 'g', calories: 231, protein: 25, carbs: 0, fat: 14, sodium: 55, popularity: 75, searchKeywords: ['pork', 'chop'] },
  { id: 'lamb-chop', name: 'Lamb Chop', category: 'Meat', servingSize: '100', servingUnit: 'g', calories: 250, protein: 25, carbs: 0, fat: 15, sodium: 65, popularity: 70, searchKeywords: ['lamb', 'chop'] },
  // ===== FISH =====
  { id: 'salmon-wild', name: 'Wild Salmon', category: 'Seafood', servingSize: '100', servingUnit: 'g', calories: 182, protein: 25, carbs: 0, fat: 8, sodium: 55, omega3: 2.3, vitaminD: 11, popularity: 94, searchKeywords: ['salmon', 'wild', 'omega3'] },
  { id: 'tuna-fresh', name: 'Fresh Tuna', category: 'Seafood', servingSize: '100', servingUnit: 'g', calories: 132, protein: 29, carbs: 0, fat: 1, sodium: 50, popularity: 75, searchKeywords: ['tuna', 'fresh', 'grilled'] },
  { id: 'cod', name: 'Cod Fish', category: 'Seafood', servingSize: '100', servingUnit: 'g', calories: 96, protein: 18, carbs: 0, fat: 0.7, sodium: 60, popularity: 65, searchKeywords: ['cod', 'white fish'] },
  { id: 'shrimp', name: 'Shrimp', category: 'Seafood', servingSize: '100', servingUnit: 'g', calories: 99, protein: 24, carbs: 0.3, fat: 0.3, sodium: 110, iodine: 35, popularity: 88, searchKeywords: ['shrimp', 'prawn', 'seafood'] },
  { id: 'halibut', name: 'Halibut', category: 'Seafood', servingSize: '100', servingUnit: 'g', calories: 110, protein: 23, carbs: 0, fat: 1, sodium: 70, popularity: 60, searchKeywords: ['halibut', 'fish'] },
  { id: 'lobster', name: 'Lobster', category: 'Seafood', servingSize: '100', servingUnit: 'g', calories: 89, protein: 19, carbs: 0, fat: 0.9, sodium: 140, popularity: 80, searchKeywords: ['lobster', 'seafood'] },
  { id: 'crab', name: 'Crab Meat', category: 'Seafood', servingSize: '100', servingUnit: 'g', calories: 97, protein: 20, carbs: 0, fat: 1.7, sodium: 380, vitaminB12: 3, popularity: 85, searchKeywords: ['crab', 'seafood'] },
  { id: 'mackerel', name: 'Mackerel', category: 'Seafood', servingSize: '100', servingUnit: 'g', calories: 262, protein: 24, carbs: 0, fat: 17, sodium: 70, popularity: 65, searchKeywords: ['mackerel', 'omega3'] },
  { id: 'sardines', name: 'Sardines', category: 'Seafood', servingSize: '100', servingUnit: 'g', calories: 208, protein: 25, carbs: 0, fat: 11, sodium: 400, popularity: 55, searchKeywords: ['sardines', 'canned'] },
  { id: 'trout', name: 'Trout', category: 'Seafood', servingSize: '100', servingUnit: 'g', calories: 168, protein: 22, carbs: 0, fat: 7, sodium: 60, popularity: 60, searchKeywords: ['trout', 'fish'] },
  // ===== PLANT PROTEIN =====
  { id: 'tofu', name: 'Firm Tofu', category: 'Protein', servingSize: '100', servingUnit: 'g', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, sodium: 10, popularity: 70, searchKeywords: ['tofu', 'soy', 'vegan'] },
  { id: 'tempeh', name: 'Tempeh', category: 'Protein', servingSize: '100', servingUnit: 'g', calories: 193, protein: 20, carbs: 9, fat: 11, sodium: 25, popularity: 65, searchKeywords: ['tempeh', 'fermented', 'vegan'] },
  { id: 'lentils', name: 'Lentils (cooked)', category: 'Protein', servingSize: '100', servingUnit: 'g', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, iron: 3.3, popularity: 82, searchKeywords: ['lentils', 'legume'] },
  { id: 'chickpeas', name: 'Chickpeas (cooked)', category: 'Protein', servingSize: '100', servingUnit: 'g', calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, popularity: 80, searchKeywords: ['chickpeas', 'garbanzo', 'hummus'] },
  { id: 'black-beans', name: 'Black Beans (cooked)', category: 'Protein', servingSize: '100', servingUnit: 'g', calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, fiber: 8.7, popularity: 78, searchKeywords: ['black beans', 'legume'] },
  // ===== DAIRY =====
  { id: 'milk-whole', name: 'Whole Milk', category: 'Dairy', servingSize: '240', servingUnit: 'ml', calories: 149, protein: 7.4, carbs: 11.7, fat: 8, calcium: 276, vitaminD: 2.5, popularity: 82, searchKeywords: ['milk', 'dairy', 'whole'] },
  { id: 'milk-skim', name: 'Skim Milk', category: 'Dairy', servingSize: '240', servingUnit: 'ml', calories: 83, protein: 8.3, carbs: 12.2, fat: 0.2, calcium: 300, popularity: 68, searchKeywords: ['milk', 'skim', 'low fat'] },
  { id: 'cheddar-cheese', name: 'Cheddar Cheese', category: 'Dairy', servingSize: '28', servingUnit: 'g', calories: 113, protein: 7, carbs: 1, fat: 9, calcium: 200, sodium: 180, popularity: 78, searchKeywords: ['cheese', 'cheddar', 'dairy'] },
  { id: 'cottage-cheese', name: 'Cottage Cheese', category: 'Dairy', servingSize: '100', servingUnit: 'g', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, calcium: 123, popularity: 72, searchKeywords: ['cheese', 'cottage', 'dairy'] },
  // ===== GRAINS =====
  { id: 'white-rice', name: 'White Rice', category: 'Grains', servingSize: '100', servingUnit: 'g', calories: 130, protein: 2.4, carbs: 28.7, fat: 0.2, fiber: 0.4, popularity: 85, searchKeywords: ['rice', 'white', 'carb'] },
  { id: 'pasta', name: 'Pasta (cooked)', category: 'Grains', servingSize: '100', servingUnit: 'g', calories: 131, protein: 5.1, carbs: 26.4, fat: 1.4, sodium: 10, popularity: 82, searchKeywords: ['pasta', 'noodles', 'italian'] },
  // ===== VEGETABLES =====
  { id: 'carrots', name: 'Carrots', category: 'Vegetables', servingSize: '1', servingUnit: 'medium', calories: 25, protein: 0.3, carbs: 6.1, fat: 0.1, fiber: 2, vitaminA: 428, popularity: 78, searchKeywords: ['carrot', 'vegetable'] },
  { id: 'tomato', name: 'Tomato', category: 'Vegetables', servingSize: '1', servingUnit: 'medium', calories: 22, protein: 1.1, carbs: 4.8, fat: 0.3, vitaminC: 13.7, potassium: 237, popularity: 85, searchKeywords: ['tomato', 'vegetable'] },
  { id: 'lettuce', name: 'Romaine Lettuce', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 17, protein: 1.6, carbs: 3.3, fat: 0.2, vitaminA: 1540, popularity: 60, searchKeywords: ['lettuce', 'salad', 'green'] },
  { id: 'cucumber', name: 'Cucumber', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, sodium: 2, potassium: 147, popularity: 70, searchKeywords: ['cucumber', 'vegetable', 'hydrating'] },
  { id: 'bell-pepper', name: 'Bell Pepper (Red)', category: 'Vegetables', servingSize: '1', servingUnit: 'medium', calories: 31, protein: 1, carbs: 6, fat: 0.3, vitaminC: 127.7, popularity: 72, searchKeywords: ['pepper', 'vegetable', 'bell pepper'] },
  { id: 'kale', name: 'Kale', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9, vitaminK: 389, calcium: 150, popularity: 70, searchKeywords: ['kale', 'leafy', 'green'] },
  { id: 'cauliflower', name: 'Cauliflower', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 25, protein: 1.9, carbs: 5, fat: 0.1, fiber: 2, vitaminC: 46.4, popularity: 68, searchKeywords: ['cauliflower', 'vegetable'] },
  { id: 'brussels-sprouts', name: 'Brussels Sprouts', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 43, protein: 3.9, carbs: 9, fat: 0.4, fiber: 3.8, vitaminC: 85, popularity: 62, searchKeywords: ['brussels', 'sprouts', 'vegetable'] },
  { id: 'zucchini', name: 'Zucchini', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, potassium: 261, popularity: 75, searchKeywords: ['zucchini', 'squash', 'vegetable'] },
  // ===== MORE VEGETABLES =====
  { id: 'asparagus', name: 'Asparagus', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 20, protein: 2.4, carbs: 3.9, fat: 0.2, fiber: 2, vitaminK: 41.6, popularity: 65, searchKeywords: ['asparagus', 'green', 'vegetable'] },
  { id: 'onion', name: 'Onion', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, vitaminC: 8.1, popularity: 75, searchKeywords: ['onion', 'allium', 'vegetable'] },
  // ===== MORE FRUITS =====
  { id: 'grapes', name: 'Grapes', category: 'Fruits', servingSize: '100', servingUnit: 'g', calories: 69, protein: 0.7, carbs: 18.1, fat: 0.2, sugar: 15.5, popularity: 75, searchKeywords: ['fruit', 'grape', 'wine', 'seedless'] },
  { id: 'grapefruit', name: 'Grapefruit', category: 'Fruits', servingSize: '1', servingUnit: 'medium', calories: 82, protein: 1.4, carbs: 19, fat: 0.2, vitaminC: 42, popularity: 65, searchKeywords: ['fruit', 'citrus', 'grapefruit', 'diet'] },
  { id: 'strawberries', name: 'Strawberries', category: 'Fruits', servingSize: '100', servingUnit: 'g', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, vitaminC: 58.8, popularity: 78, searchKeywords: ['fruit', 'berry', 'strawberry'] },
  { id: 'orange', name: 'Orange', category: 'Fruits', servingSize: '1', servingUnit: 'medium', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, vitaminC: 69.7, folate: 40, popularity: 85, searchKeywords: ['fruit', 'citrus', 'orange', 'vitamin c'] },
  { id: 'pear', name: 'Pear', category: 'Fruits', servingSize: '1', servingUnit: 'medium', calories: 100, protein: 0.6, carbs: 27, fat: 0.2, fiber: 5.5, popularity: 70, searchKeywords: ['fruit', 'pear', 'snack'] },
  { id: 'grape-fruit', name: 'Grapefruit', category: 'Fruits', servingSize: '1', servingUnit: 'medium', calories: 82, protein: 1.4, carbs: 19, fat: 0.2, vitaminC: 42, popularity: 65, searchKeywords: ['fruit', 'citrus', 'grapefruit'] },
  { id: 'kiwi', name: 'Kiwi', category: 'Fruits', servingSize: '1', servingUnit: 'medium', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, vitaminC: 92.7, potassium: 231, popularity: 72, searchKeywords: ['fruit', 'kiwi', 'vitamin c'] },
  { id: 'mango', name: 'Mango', category: 'Fruits', servingSize: '1', servingUnit: 'medium', calories: 99, protein: 0.8, carbs: 24.7, fat: 0.6, vitaminC: 45.7, popularity: 75, searchKeywords: ['fruit', 'tropical', 'mango'] },
  { id: 'peach', name: 'Peach', category: 'Fruits', servingSize: '1', servingUnit: 'medium', calories: 59, protein: 1.4, carbs: 15, fat: 0.3, vitaminC: 10.4, popularity: 70, searchKeywords: ['fruit', 'peach', 'stone fruit'] },
  // ===== NUTS & SEEDS =====
  { id: 'almonds', name: 'Almonds', category: 'Nuts', servingSize: '28', servingUnit: 'g', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, vitaminE: 7.3, magnesium: 76, popularity: 78, searchKeywords: ['nuts', 'almond', 'almonds', 'snack'] },
  { id: 'walnuts', name: 'Walnuts', category: 'Nuts', servingSize: '28', servingUnit: 'g', calories: 185, protein: 4, carbs: 4, fat: 18, omega3: 2.5, magnesium: 45, popularity: 68, searchKeywords: ['nuts', 'walnut', 'omega', 'brain'] },
  { id: 'peanut-butter', name: 'Peanut Butter', category: 'Nuts', servingSize: '2', servingUnit: 'tbsp', calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 2, magnesium: 48, popularity: 85, searchKeywords: ['nuts', 'peanut', 'butter', 'protein'] },
  { id: 'peanuts', name: 'Peanuts', category: 'Nuts', servingSize: '28', servingUnit: 'g', calories: 159, protein: 7, carbs: 5, fat: 13, niacin: 2.4, popularity: 75, searchKeywords: ['nuts', 'peanut', 'snack'] },
  { id: 'cashews', name: 'Cashews', category: 'Nuts', servingSize: '28', servingUnit: 'g', calories: 157, protein: 5, carbs: 9, fat: 12, magnesium: 82, popularity: 72, searchKeywords: ['nuts', 'cashew', 'snack'] },
  // ===== BREAKFAST =====
  { id: 'cereal', name: 'Breakfast Cereal', category: 'Breakfast', servingSize: '30', servingUnit: 'g', calories: 120, protein: 2, carbs: 26, fat: 0.5, popularity: 70, searchKeywords: ['cereal', 'breakfast', 'grain'] },
  { id: 'pancakes', name: 'Pancakes', category: 'Breakfast', servingSize: '2', servingUnit: 'pieces', calories: 120, protein: 3, carbs: 18, fat: 3, sodium: 300, popularity: 75, searchKeywords: ['breakfast', 'pancake', 'maple'] },
  { id: 'waffle', name: 'Waffle', category: 'Breakfast', servingSize: '1', servingUnit: 'piece', calories: 120, protein: 3, carbs: 18, fat: 3, sodium: 250, popularity: 65, searchKeywords: ['breakfast', 'waffle', 'belgian'] },
  { id: 'cereal-honey', name: 'Honey Nut Cheerios', category: 'Breakfast', servingSize: '30', servingUnit: 'g', calories: 110, protein: 2, carbs: 20, fat: 1.5, iron: 15, popularity: 75, searchKeywords: ['cereal', 'breakfast', 'cheerios'] },
  // ===== SNACKS =====
  { id: 'protein-bar', name: 'Protein Bar', category: 'Snacks', servingSize: '50', servingUnit: 'g', calories: 220, protein: 20, carbs: 25, fat: 10, fiber: 5, popularity: 78, searchKeywords: ['bar', 'protein', 'snack'] },
  { id: 'dark-chocolate', name: 'Dark Chocolate (70%)', category: 'Snacks', servingSize: '28', servingUnit: 'g', calories: 170, protein: 2, carbs: 13, fat: 12, fiber: 3, popularity: 70, searchKeywords: ['chocolate', 'dessert', 'snack'] },
  { id: 'cookies', name: 'Cookies', category: 'Snacks', servingSize: '2', servingUnit: 'pieces', calories: 120, protein: 1, carbs: 18, fat: 5, popularity: 65, searchKeywords: ['cookies', 'dessert', 'snack'] },
  // ===== FAST FOOD =====
  { id: 'big-mac', name: 'Big Mac', category: 'Fast Food', servingSize: '1', servingUnit: 'sandwich', calories: 550, protein: 25, carbs: 45, fat: 30, sodium: 1040, popularity: 80, searchKeywords: ['mcdonalds', 'burger', 'fast food'] },
  { id: 'pizza', name: 'Pizza Slice', category: 'Fast Food', servingSize: '1', servingUnit: 'slice', calories: 290, protein: 12, carbs: 32, fat: 14, sodium: 580, popularity: 85, searchKeywords: ['pizza', 'italian', 'fast food'] },
  { id: 'fries', name: 'French Fries', category: 'Fast Food', servingSize: '100', servingUnit: 'g', calories: 365, protein: 3.4, carbs: 48, fat: 17, sodium: 246, popularity: 80, searchKeywords: ['fries', 'potato', 'fast food'] },
  // ===== MORE GRAINS =====
  { id: 'bread-white', name: 'White Bread', category: 'Grains', servingSize: '1', servingUnit: 'slice', calories: 80, protein: 2.6, carbs: 15.6, fat: 0.8, sodium: 140, popularity: 70, searchKeywords: ['bread', 'white', 'carb'] },
  { id: 'toast', name: 'Toast', category: 'Grains', servingSize: '1', servingUnit: 'slice', calories: 80, protein: 2.6, carbs: 15, fat: 1, sodium: 140, popularity: 75, searchKeywords: ['bread', 'toast', 'carb'] },
  // ===== MORE DAIRY =====
  { id: 'cream-cheese', name: 'Cream Cheese', category: 'Dairy', servingSize: '28', servingUnit: 'g', calories: 100, protein: 2, carbs: 3, fat: 9, calcium: 20, popularity: 70, searchKeywords: ['cheese', 'cream cheese', 'dairy'] },
  { id: 'milk-chocolate', name: 'Chocolate Milk', category: 'Dairy', servingSize: '240', servingUnit: 'ml', calories: 190, protein: 8, carbs: 26, fat: 5, calcium: 270, popularity: 75, searchKeywords: ['milk', 'chocolate', 'drink'] },
  // ===== DRINKS =====
  { id: 'coffee', name: 'Coffee (Black)', category: 'Beverages', servingSize: '240', servingUnit: 'ml', calories: 2, protein: 0.3, carbs: 0, fat: 0, popularity: 90, searchKeywords: ['coffee', 'caffeine', 'drink'] },
  { id: 'green-tea', name: 'Green Tea', category: 'Beverages', servingSize: '240', servingUnit: 'ml', calories: 2, protein: 0.3, carbs: 0.5, fat: 0, popularity: 80, searchKeywords: ['tea', 'green tea', 'beverage'] },
  { id: 'orange-juice', name: 'Orange Juice', category: 'Beverages', servingSize: '240', servingUnit: 'ml', calories: 110, protein: 1.7, carbs: 26, fat: 0.2, vitaminC: 500, popularity: 75, searchKeywords: ['juice', 'orange', 'citrus'] },
  // ===== SUPPLEMENTS =====
  { id: 'protein-powder-choc', name: 'Chocolate Protein Powder', category: 'Supplements', servingSize: '30', servingUnit: 'g', calories: 130, protein: 24, carbs: 5, fat: 1.5, popularity: 85, searchKeywords: ['protein', 'chocolate', 'supplement'] },
  { id: 'creatine', name: 'Creatine Monohydrate', category: 'Supplements', servingSize: '5', servingUnit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0, popularity: 80, searchKeywords: ['creatine', 'supplement', 'performance'] },
  { id: 'fish-oil', name: 'Fish Oil', category: 'Supplements', servingSize: '2', servingUnit: 'capsules', calories: 20, protein: 0, carbs: 0, fat: 2, popularity: 75, searchKeywords: ['fish oil', 'omega', 'supplement'] },
  { id: 'multivitamin', name: 'Multivitamin', category: 'Supplements', servingSize: '1', servingUnit: 'tablet', calories: 0, protein: 0, carbs: 0.5, fat: 0, popularity: 78, searchKeywords: ['vitamin', 'multivitamin', 'supplement'] },
  // ===== VEGETABLES =====
  { id: 'artichoke', name: 'Artichoke', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 45, protein: 2.9, carbs: 11, fat: 0.4, fiber: 5.4, popularity: 60, searchKeywords: ['artichoke', 'vegetable'] },
  { id: 'beets', name: 'Beets', category: 'Vegetables', servingSize: '100', servingUnit: 'g', calories: 43, protein: 1.6, carbs: 10, fat: 0.1, fiber: 2.8, potassium: 305, popularity: 60, searchKeywords: ['beets', 'beet', 'vegetable'] },
  // ===== FRUITS =====
  { id: 'melon', name: 'Honeydew Melon', category: 'Fruits', servingSize: '100', servingUnit: 'g', calories: 36, protein: 0.5, carbs: 9.6, fat: 0.1, vitaminC: 18, popularity: 65, searchKeywords: ['fruit', 'melon', 'honeydew'] },
  { id: 'cantaloupe', name: 'Cantaloupe', category: 'Fruits', servingSize: '100', servingUnit: 'g', calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2, vitaminA: 338, popularity: 68, searchKeywords: ['fruit', 'melon', 'cantaloupe'] },
];

const categories = ['All', 'Meat', 'Seafood', 'Protein', 'Grains', 'Vegetables', 'Fruits', 'Dairy', 'Nuts', 'Supplements', 'Beverages', 'Snacks', 'Fast Food', 'Breakfast'];

export const foodDatabase = {
  foods,
  categories,
  byId: (id: string) => foods.find((f) => f.id === id),
  byCategory: (category: string) => foods.filter((f) => f.category === category),
  search: (query: string) => {
    const q = query.toLowerCase();
    return foods.filter((f) =>
      f.name.toLowerCase().includes(q) ||
      f.searchKeywords?.some((k) => k.toLowerCase().includes(q)) ||
      f.category.toLowerCase().includes(q)
    );
  },
  favorites: new Set<string>(),
  recent: new Set<string>(),
};