import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { Badge } from '../../components/Badge';
import { useNutritionStore } from '../../store/nutritionStore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'MealDetails'>;

export default function MealDetailsScreen({ navigation, route }: Props) {
  const { mealId } = route.params;
  const { meals, foods, fetchMeals, fetchFoods, isLoading } = useNutritionStore();
  const meal = meals?.find((m) => m.id === mealId);

  useEffect(() => {
    fetchMeals();
    fetchFoods();
  }, []);

  const getFood = (id: string) => foods?.find((f) => f.id === id);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.error}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!meal) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.error}>Meal not found</Text>
      </SafeAreaView>
    );
  }

  const totalCalories = meal.foods.reduce((sum, f) => sum + (getFood(f.foodId)?.calories || 0) * f.quantity, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>{meal.name}</Text>
      </View>

      <PremiumCard variant="elevated" style={styles.summaryCard}>
        <Text style={styles.calories}>{totalCalories} calories</Text>
      </PremiumCard>

      <View style={styles.foodsList}>
        {meal.foods.map((item) => {
          const food = getFood(item.foodId);
          return (
            <PremiumCard key={item.foodId} variant="glass" style={styles.foodCard}>
              <View style={styles.foodRow}>
                <Text style={styles.foodName}>{food?.name || 'Unknown food'}</Text>
                <Badge label={`${item.quantity}x`} variant="default" size="sm" />
              </View>
            </PremiumCard>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  summaryCard: { padding: spacing.md, alignItems: 'center', marginBottom: spacing.lg },
  calories: { color: colors.textSecondary, fontSize: 16 },
  foodsList: { gap: spacing.sm },
  foodCard: { padding: spacing.md },
  foodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  foodName: { color: colors.textPrimary, fontSize: 16, flex: 1 },
  error: { color: colors.error, fontSize: 16, textAlign: 'center', marginTop: spacing.xl },
});