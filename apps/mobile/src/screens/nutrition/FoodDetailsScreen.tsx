import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { useNutritionStore } from '../../store/nutritionStore';
import { Button } from '../../components/Button';
import { MacroRing } from '../../components/MacroRing';
import { ProgressRing } from '../../components/ProgressRing';
import { Ionicons } from '@expo/vector-icons';
import { runFadeIn, runScaleIn } from '../../utils/animations';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodDetails'>;

export default function FoodDetailsScreen({ navigation, route }: Props) {
  const { foodId } = route.params;
  const { foods, fetchFoods, createMeal } = useNutritionStore();
  const [quantity, setQuantity] = useState('1');

  const food = foods?.find((f) => f.id === foodId);

  useEffect(() => {
    fetchFoods();
  }, []);

  const headerAnim = { opacity: new Animated.Value(0), transform: [{ translateY: new Animated.Value(12) }] };
  const macrosAnim = { opacity: new Animated.Value(0), transform: [{ scale: new Animated.Value(0.92) }] };

  useEffect(() => {
    runFadeIn(headerAnim, 0);
    runScaleIn(macrosAnim, 100);
  }, [food]);

  if (!food) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.error}>Food not found</Text>
      </SafeAreaView>
    );
  }

  const handleLog = () => {
    createMeal({
      name: food.name,
      foods: [{ foodId: food.id, quantity: parseFloat(quantity) || 1 }],
    });
    navigation.goBack();
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(0.5, parseFloat(quantity) + delta).toString());
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[headerAnim, styles.header]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>{food.name}</Text>
      </Animated.View>

      <PremiumCard variant="elevated" style={styles.heroCard}>
        <View style={styles.heroContent}>
          <ProgressRing progress={100} size={120} strokeWidth={10} color={colors.primary}>
            <Text style={styles.calorieValue}>{food.calories}</Text>
            <Text style={styles.calorieUnit}>cal</Text>
          </ProgressRing>
          <Text style={styles.heroLabel}>Per {food.servingSize}</Text>
        </View>
      </PremiumCard>

      <Animated.View style={[macrosAnim, styles.macrosSection]}>
        <Text style={styles.sectionLabel}>Macros</Text>
        <View style={styles.macroRow}>
          <MacroRing label="Protein" value={food.protein} max={100} />
          <MacroRing label="Carbs" value={food.carbs} max={100} />
          <MacroRing label="Fat" value={food.fat} max={100} />
        </View>
      </Animated.View>

      <View style={styles.quantitySection}>
        <Text style={styles.quantityLabel}>Servings</Text>
        <View style={styles.quantityControls}>
          <Pressable style={styles.quantityButton} onPress={() => handleQuantityChange(-0.5)}>
            <Ionicons name="remove" size={20} color={colors.textPrimary} />
          </Pressable>
          <TextInput
            style={styles.quantityInput}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            textAlign="center"
          />
          <Pressable style={styles.quantityButton} onPress={() => handleQuantityChange(0.5)}>
            <Ionicons name="add" size={20} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Log Food" onPress={handleLog} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary, marginLeft: spacing.md },
  error: { color: colors.error, textAlign: 'center', marginTop: spacing.xl },
  heroCard: { marginBottom: spacing.xl, alignItems: 'center', padding: spacing.lg },
  heroContent: { alignItems: 'center' },
  calorieValue: { ...typography.kpi, color: colors.textPrimary },
  calorieUnit: { ...typography.kpiLabel, color: colors.textMuted, marginTop: -spacing.xs },
  heroLabel: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.sm },
  macrosSection: { marginBottom: spacing.xl },
  sectionLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quantitySection: { marginBottom: spacing.lg },
  quantityLabel: { color: colors.textSecondary, marginBottom: spacing.sm },
  quantityControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  quantityButton: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: 12,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityInput: {
    flex: 1,
    backgroundColor: colors.surfaceGlass,
    color: colors.textPrimary,
    padding: spacing.md,
    borderRadius: 12,
    fontSize: 16,
  },
  actions: { marginTop: 'auto' },
});