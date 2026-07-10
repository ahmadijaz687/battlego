import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { Meal } from '../../types/nutrition';
import { PremiumCard } from '../../components/PremiumCard';
import { MealCard } from '../../components/MealCard';
import { EmptyState } from '../../components/EmptyState';
import { useNutritionStore } from '../../store/nutritionStore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'MealHistory'>;

export default function MealHistoryScreen({ navigation }: Props) {
  const { meals, foods, fetchMeals, fetchFoods } = useNutritionStore();

  useEffect(() => {
    fetchMeals();
    fetchFoods();
  }, []);

  const renderMeal = ({ item }: { item: Meal }) => {
    const macros = foods ? item.foods.reduce((acc, f) => {
      const food = foods.find((fd) => fd.id === f.foodId);
      if (food) {
        acc.protein += (food.protein || 0) * f.quantity;
        acc.carbs += (food.carbs || 0) * f.quantity;
        acc.fat += (food.fat || 0) * f.quantity;
      }
      return acc;
    }, { protein: 0, carbs: 0, fat: 0 }) : undefined;

    return <MealCard meal={item} macros={macros} onPress={() => navigation.navigate('MealDetails', { mealId: item.id })} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Meal History</Text>
      </View>

      {meals && meals.length > 0 ? (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={renderMeal}
          contentContainerStyle={styles.list}
        />
      ) : (
        <EmptyState icon="🍽️" title="No meals logged" description="Start logging your meals to see history" />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  list: { paddingBottom: spacing.md },
});