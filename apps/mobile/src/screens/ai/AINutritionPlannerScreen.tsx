import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ErrorState } from '../../components/ErrorState';
import { PremiumCard } from '../../components/PremiumCard';
import { Chip } from '../../components/Chip';
import { useAIStore } from '../../store/aiStore';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'AINutritionPlanner'>;

const goalOptions = [
  { key: 'weight_loss', label: 'Weight Loss', icon: 'trend-down' as const },
  { key: 'muscle_gain', label: 'Muscle Gain', icon: 'fitness' as const },
  { key: 'maintenance', label: 'Maintenance', icon: 'git-commit' as const },
];

export default function AINutritionPlannerScreen({ navigation }: Props) {
  const { settings, nutritionPlan, error, generateNutrition } = useAIStore();
  const [calories, setCalories] = useState(2200);
  const [selectedGoal, setSelectedGoal] = useState('muscle_gain');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setLocalError(null);
    try {
      await generateNutrition(calories, { protein: 120, carbs: 250, fat: 80 });
    } catch {
      setLocalError('Failed to generate meal plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Nutrition Planner</Text>
      </View>

      <Text style={styles.label}>Daily Calories: {calories}</Text>
      <View style={styles.calorieControls}>
        <Pressable onPress={() => setCalories((c) => Math.max(1200, c - 100))} accessibilityLabel="Decrease calories">
          <Ionicons name="remove-circle" size={32} color={colors.primary} />
        </Pressable>
        <Pressable onPress={() => setCalories((c) => Math.min(4000, c + 100))} accessibilityLabel="Increase calories">
          <Ionicons name="add-circle" size={32} color={colors.primary} />
        </Pressable>
      </View>

      <Text style={styles.subLabel}>Goal</Text>
      <View style={styles.goalRow}>
        {goalOptions.map((goal) => (
          <Chip
            key={goal.key}
            label={goal.label}
            selected={selectedGoal === goal.key}
            onPress={() => setSelectedGoal(goal.key)}
          />
        ))}
      </View>

      {isLoading ? (
        <LoadingSkeleton />
      ) : localError || error ? (
        <ErrorState title="Generation failed" message={localError || error || 'Something went wrong'} onRetry={handleGenerate} />
      ) : nutritionPlan ? (
        <PremiumCard variant="elevated" style={styles.preview}>
          <Text style={styles.previewTitle}>Daily Plan</Text>
          <Text style={styles.previewCalories}>{nutritionPlan.dailyCalories} cal</Text>
          <Text style={styles.previewDesc}>P: {nutritionPlan.macros.protein}g | C: {nutritionPlan.macros.carbs}g | F: {nutritionPlan.macros.fat}g</Text>
          {nutritionPlan.meals.slice(0, 3).map((meal) => (
            <Text key={meal.id} style={styles.mealRow}>- {meal.name}: {meal.calories} cal</Text>
          ))}
        </PremiumCard>
      ) : (
        <PremiumCard variant="elevated" style={styles.preview}>
          <Text style={styles.previewTitle}>AI Meal Plan</Text>
          <Text style={styles.previewDesc}>Personalized for {settings.experienceLevel} • {calories} calories</Text>
        </PremiumCard>
      )}

      <Button title="Generate Meal Plan" variant="primary" onPress={handleGenerate} disabled={isLoading} style={styles.button} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  label: { color: colors.textPrimary, fontSize: 18, fontWeight: '600', marginBottom: spacing.md, textAlign: 'center' },
  calorieControls: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, marginBottom: spacing.lg },
  subLabel: { color: colors.textSecondary, marginBottom: spacing.sm },
  goalRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap', marginBottom: spacing.lg },
  preview: { padding: spacing.lg, marginBottom: spacing.lg, alignItems: 'center' },
  previewTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.sm },
  previewDesc: { color: colors.textSecondary, textAlign: 'center' },
  previewCalories: { color: colors.primary, fontSize: 20, fontWeight: '700', marginVertical: spacing.sm },
  mealRow: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.xs },
  button: { marginTop: 'auto' },
});