import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { NutritionStackParamList } from '../../types/navigation';
import NutritionDashboardScreen from '../../screens/nutrition/NutritionDashboardScreen';
import FoodSearchScreen from '../../screens/nutrition/FoodSearchScreen';
import FoodDetailsScreen from '../../screens/nutrition/FoodDetailsScreen';
import MealCreateScreen from '../../screens/nutrition/MealCreateScreen';
import MealDetailsScreen from '../../screens/nutrition/MealDetailsScreen';
import MealHistoryScreen from '../../screens/nutrition/MealHistoryScreen';
import WaterLogScreen from '../../screens/nutrition/WaterLogScreen';
import RecipeLibraryScreen from '../../screens/nutrition/RecipeLibraryScreen';
import RecipeDetailsScreen from '../../screens/nutrition/RecipeDetailsScreen';
import ShoppingListScreen from '../../screens/nutrition/ShoppingListScreen';
import WeightTrackingScreen from '../../screens/nutrition/WeightTrackingScreen';
import BodyMeasurementsScreen from '../../screens/nutrition/BodyMeasurementsScreen';
import SupplementTrackerScreen from '../../screens/nutrition/SupplementTrackerScreen';
import NutritionGoalsScreen from '../../screens/nutrition/NutritionGoalsScreen';
import NutritionAnalyticsScreen from '../../screens/nutrition/NutritionAnalyticsScreen';
import MacroCalculatorScreen from '../../screens/nutrition/MacroCalculatorScreen';
import BMICalculatorScreen from '../../screens/nutrition/BMICalculatorScreen';
import MealPlannerScreen from '../../screens/nutrition/MealPlannerScreen';

const Stack = createNativeStackNavigator<NutritionStackParamList>();

export function NutritionStackNavigator() {
  return (
    <Stack.Navigator
      id="NutritionStack"
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="NutritionDashboard" component={NutritionDashboardScreen} options={{ title: 'Nutrition' }} />
      <Stack.Screen name="FoodSearch" component={FoodSearchScreen} options={{ title: 'Food Search' }} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} options={{ title: 'Food Details' }} />
      <Stack.Screen name="MealCreate" component={MealCreateScreen} options={{ title: 'Create Meal' }} />
      <Stack.Screen name="MealDetails" component={MealDetailsScreen} options={{ title: 'Meal Details' }} />
      <Stack.Screen name="MealHistory" component={MealHistoryScreen} options={{ title: 'Meal History' }} />
      <Stack.Screen name="WaterLog" component={WaterLogScreen} options={{ title: 'Water Log' }} />
      <Stack.Screen name="RecipeLibrary" component={RecipeLibraryScreen} options={{ title: 'Recipes' }} />
      <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} options={{ title: 'Recipe Details' }} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} options={{ title: 'Shopping List' }} />
      <Stack.Screen name="WeightTracking" component={WeightTrackingScreen} options={{ title: 'Weight Tracking' }} />
      <Stack.Screen name="BodyMeasurements" component={BodyMeasurementsScreen} options={{ title: 'Body Measurements' }} />
      <Stack.Screen name="SupplementTracker" component={SupplementTrackerScreen} options={{ title: 'Supplements' }} />
      <Stack.Screen name="NutritionGoals" component={NutritionGoalsScreen} options={{ title: 'Nutrition Goals' }} />
      <Stack.Screen name="NutritionAnalytics" component={NutritionAnalyticsScreen} options={{ title: 'Nutrition Analytics' }} />
      <Stack.Screen name="MacroCalculator" component={MacroCalculatorScreen} options={{ title: 'Macro Calculator' }} />
      <Stack.Screen name="BMICalculator" component={BMICalculatorScreen} options={{ title: 'BMI Calculator' }} />
      <Stack.Screen name="MealPlanner" component={MealPlannerScreen} options={{ title: 'Meal Planner' }} />
    </Stack.Navigator>
  );
}
