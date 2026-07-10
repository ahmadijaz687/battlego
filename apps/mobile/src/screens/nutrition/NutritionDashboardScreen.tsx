import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { ProgressRing } from '../../components/ProgressRing';
import { MacroRing } from '../../components/MacroRing';
import { Badge } from '../../components/Badge';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import { runFadeIn, runScaleIn } from '../../utils/animations';
import { useNutritionStore } from '../../store/nutritionStore';

type Props = NativeStackScreenProps<RootStackParamList, 'NutritionDashboard'>;

export default function NutritionDashboard({ navigation }: Props) {
  const { meals, foods, waterLogs, fetchMeals, fetchFoods, fetchWaterLogs, createWaterLog, isLoading: mealsLoading, error: mealsError } = useNutritionStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeals();
    fetchFoods();
    fetchWaterLogs();
  }, []);

  const getFood = (id: string) => foods?.find((f) => f.id === id);

  const goals = { calories: 2200, protein: 120, carbs: 180, fat: 65 };

  const totals = (meals || []).reduce(
    (acc, meal) => {
      for (const food of meal.foods) {
        const foodData = getFood(food.foodId);
        if (!foodData) continue;
        const qty = food.quantity;
        acc.calories += (foodData.calories || 0) * qty;
        acc.protein += (foodData.protein || 0) * qty;
        acc.carbs += (foodData.carbs || 0) * qty;
        acc.fat += (foodData.fat || 0) * qty;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const latestWaterLog = waterLogs?.[waterLogs.length - 1];
  const waterAmount = latestWaterLog?.amount || 0;
  const waterGoal = 2000;
  const waterProgress = Math.min(Math.round((waterAmount / waterGoal) * 100), 100);

  const headerAnim = useRef({ opacity: new Animated.Value(0), transform: [{ translateY: new Animated.Value(12) as any }] as any }).current;
  const calorieAnim = useRef({ opacity: new Animated.Value(0), transform: [{ scale: new Animated.Value(0.92) as any }] as any }).current;
  const macrosAnim = useRef({ opacity: new Animated.Value(0), transform: [{ translateY: new Animated.Value(12) as any }] as any }).current;

  useEffect(() => {
    runFadeIn(headerAnim, 0);
    runScaleIn(calorieAnim, 60);
    runFadeIn(macrosAnim, 120);
  }, [meals]);

  const handleWaterAdd = () => {
    setError(null);
    createWaterLog(250);
  };

  const handleWaterRemove = () => {
    if (waterAmount > 0) {
      setError(null);
      createWaterLog(-250);
    }
  };

  if (mealsLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LoadingSkeleton height={60} style={{ marginBottom: spacing.md }} />
        <LoadingSkeleton height={180} style={{ marginBottom: spacing.md }} />
        <LoadingSkeleton height={140} style={{ marginBottom: spacing.md }} />
        <LoadingSkeleton height={200} />
      </SafeAreaView>
    );
  }

  const hasAnyError = mealsError;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <Animated.View style={[headerAnim, styles.header]}>
          <Text style={styles.title}>Nutrition</Text>
          <Pressable onPress={() => navigation.navigate('FoodSearch')}>
            <Ionicons name="add" size={28} color={colors.primary} />
          </Pressable>
        </Animated.View>

        {(error || hasAnyError) && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error || 'Some data may not be up to date'}</Text>
          </View>
        )}

          <Animated.View style={[calorieAnim, styles.calorieSection]}>
          <Card variant="surface" style={styles.calorieCard}>
            <View style={styles.calorieHeroContent}>
              <ProgressRing progress={Math.round((totals.calories / (goals?.calories || 2200)) * 100)} size={150} strokeWidth={10}>
                <Text style={styles.calorieValue}>{totals.calories}</Text>
                <Text style={styles.calorieUnit}>cal</Text>
              </ProgressRing>
              <Text style={styles.calorieGoal}>Goal: {goals?.calories || 2200}</Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={[macrosAnim, styles.macros]}>
          <Text style={styles.sectionLabel}>Macros</Text>
          <View style={styles.macroRow}>
            <MacroRing label="Protein" value={totals.protein} max={goals?.protein || 120} />
            <MacroRing label="Carbs" value={totals.carbs} max={goals?.carbs || 180} />
            <MacroRing label="Fat" value={totals.fat} max={goals?.fat || 65} />
          </View>
        </Animated.View>

        <Card variant="surface" style={styles.waterCard}>
          <View style={styles.waterRow}>
            <View style={styles.waterInfo}>
              <Text style={styles.waterLabel}>Water Intake</Text>
              <Text style={styles.waterValue}>{waterAmount}ml / {waterGoal}ml</Text>
            </View>
            <ProgressRing progress={waterProgress} size={60} strokeWidth={5} color={colors.accent} />
          </View>
          <View style={styles.waterControls}>
            <Pressable style={styles.waterButton} onPress={handleWaterRemove}>
              <Ionicons name="remove" size={18} color={colors.textPrimary} />
            </Pressable>
            <Pressable style={styles.waterButton} onPress={handleWaterAdd}>
              <Ionicons name="add" size={18} color={colors.textPrimary} />
            </Pressable>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Today's Meals</Text>
        {!meals || meals.length === 0 ? (
          <EmptyState icon="🍽️" title="No meals logged today" description="Tap + to add a meal" />
        ) : (
          meals.map((meal, index) => (
            <Pressable key={meal.id} onPress={() => navigation.navigate('MealDetails', { mealId: meal.id })} accessibilityRole="button" accessibilityLabel={meal.name}>
              <Card variant="surface" style={styles.mealCard}>
                <Text style={styles.mealName}>{meal.name}</Text>
                {meal.foods.map((food) => {
                  const foodData = getFood(food.foodId);
                  return (
                    <View key={food.foodId} style={styles.foodRow}>
                      <Text style={styles.foodName}>{foodData?.name || 'Unknown food'}</Text>
                      <Badge label={`${food.quantity}x`} variant="default" size="sm" />
                    </View>
                  );
                })}
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary },
  calorieCard: { padding: spacing.lg, alignItems: 'center' },
  calorieHeroContent: { alignItems: 'center' },
  calorieValue: { ...typography.kpi, color: colors.textPrimary },
  calorieUnit: { ...typography.kpiLabel, color: colors.textMuted, marginTop: -spacing.xs },
  calorieGoal: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.md },
  sectionLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm, marginTop: spacing.lg },
  calorieSection: { marginBottom: spacing.lg },
  macros: { marginBottom: spacing.lg },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  waterCard: { padding: spacing.md, marginBottom: spacing.lg },
  waterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  waterInfo: { flex: 1 },
  waterLabel: { color: colors.textSecondary, fontSize: 12, textTransform: 'uppercase' },
  waterValue: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', marginTop: spacing.xs },
  waterControls: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, alignSelf: 'flex-end' },
  waterButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorBanner: {
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: 14, textAlign: 'center' },
  mealCard: { marginBottom: spacing.sm, padding: spacing.md },
  mealName: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  foodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs },
  foodName: { color: colors.textSecondary, flex: 1 },
});