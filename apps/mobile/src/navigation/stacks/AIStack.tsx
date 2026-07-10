import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { AIStackParamList } from '../../types/navigation';
import AIScreen from '../../screens/ai/AIScreen';
import AIChatScreen from '../../screens/ai/AIChatScreen';
import AIWorkoutGeneratorScreen from '../../screens/ai/AIWorkoutGeneratorScreen';
import AINutritionPlannerScreen from '../../screens/ai/AINutritionPlannerScreen';
import AISettingsScreen from '../../screens/ai/AISettingsScreen';
import AIBodyAnalysisScreen from '../../screens/ai/AIBodyAnalysisScreen';
import AIFoodAnalysisScreen from '../../screens/ai/AIFoodAnalysisScreen';
import AIProgressAnalysisScreen from '../../screens/ai/AIProgressAnalysisScreen';
import AIGoalPlannerScreen from '../../screens/ai/AIGoalPlannerScreen';

const Stack = createNativeStackNavigator<AIStackParamList>();

export function AIStackNavigator() {
  return (
    <Stack.Navigator
      id="AIStack"
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="AI" component={AIScreen} options={{ title: 'AI Coach' }} />
      <Stack.Screen name="AIChat" component={AIChatScreen} options={{ title: 'AI Chat' }} />
      <Stack.Screen name="AIWorkoutGenerator" component={AIWorkoutGeneratorScreen} options={{ title: 'Workout Generator' }} />
      <Stack.Screen name="AINutritionPlanner" component={AINutritionPlannerScreen} options={{ title: 'Nutrition Planner' }} />
      <Stack.Screen name="AISettings" component={AISettingsScreen} options={{ title: 'AI Settings' }} />
      <Stack.Screen name="AIBodyAnalysis" component={AIBodyAnalysisScreen} options={{ title: 'Body Analysis' }} />
      <Stack.Screen name="AIFoodAnalysis" component={AIFoodAnalysisScreen} options={{ title: 'Food Analysis' }} />
      <Stack.Screen name="AIProgressAnalysis" component={AIProgressAnalysisScreen} options={{ title: 'Progress Analysis' }} />
      <Stack.Screen name="AIGoalPlanner" component={AIGoalPlannerScreen} options={{ title: 'Goal Planner' }} />
    </Stack.Navigator>
  );
}
