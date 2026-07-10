import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NutritionStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

type Props = NativeStackScreenProps<NutritionStackParamList, 'MealPlanner'>;

interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealSlot {
  id: string;
  label: string;
  items: MealItem[];
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const initialMeals: MealSlot[] = [
  { id: 'breakfast', label: 'Breakfast', items: [{ id: 'm1', name: 'Oatmeal', calories: 300, protein: 12, carbs: 50, fat: 6 }] },
  { id: 'lunch', label: 'Lunch', items: [{ id: 'm2', name: 'Chicken Salad', calories: 450, protein: 35, carbs: 20, fat: 25 }] },
  { id: 'dinner', label: 'Dinner', items: [{ id: 'm3', name: 'Salmon & Rice', calories: 550, protein: 40, carbs: 45, fat: 18 }] },
  { id: 'snacks', label: 'Snacks', items: [{ id: 'm4', name: 'Protein Shake', calories: 200, protein: 25, carbs: 10, fat: 5 }] },
];

type DayMeals = Record<string, MealSlot[]>;

export default function MealPlannerScreen({ navigation }: Props) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [dayMeals, setDayMeals] = useState<DayMeals>({ '0': initialMeals.map((s) => ({ ...s, items: [...s.items] })) });

  const currentDayKey = String(selectedDay);
  const currentMeals = dayMeals[currentDayKey] || initialMeals.map((s) => ({ ...s, items: [] }));

  const dayTotal = currentMeals.reduce(
    (acc, slot) => {
      slot.items.forEach((item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleAddFood = (slotId: string) => {
    navigation.navigate('FoodSearch');
  };

  const handleRemoveFood = (slotId: string, foodId: string) => {
    setDayMeals((prev) => {
      const updated = { ...prev };
      const meals = (updated[currentDayKey] || initialMeals.map((s) => ({ ...s, items: [] }))).map((slot) =>
        slot.id === slotId ? { ...slot, items: slot.items.filter((i) => i.id !== foodId) } : slot
      );
      updated[currentDayKey] = meals;
      return updated;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Meal Planner</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekStrip} contentContainerStyle={styles.weekContent}>
          {weekDays.map((day, index) => (
            <Pressable
              key={day}
              style={[styles.dayChip, selectedDay === index && styles.dayChipActive]}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[styles.dayChipText, selectedDay === index && styles.dayChipTextActive]}>{day}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Card style={styles.totalCard}>
          <Text style={styles.sectionTitle}>Daily Totals</Text>
          <View style={styles.totalRow}>
            <View style={styles.totalItem}><Text style={styles.totalValue}>{dayTotal.calories}</Text><Text style={styles.totalLabel}>kcal</Text></View>
            <View style={styles.totalItem}><Text style={[styles.totalValue, { color: colors.accentGreen }]}>{dayTotal.protein}g</Text><Text style={styles.totalLabel}>Protein</Text></View>
            <View style={styles.totalItem}><Text style={[styles.totalValue, { color: colors.accentOrange }]}>{dayTotal.carbs}g</Text><Text style={styles.totalLabel}>Carbs</Text></View>
            <View style={styles.totalItem}><Text style={[styles.totalValue, { color: colors.info }]}>{dayTotal.fat}g</Text><Text style={styles.totalLabel}>Fat</Text></View>
          </View>
        </Card>

        {currentMeals.map((slot) => (
          <Card key={slot.id} style={styles.mealSlot}>
            <View style={styles.slotHeader}>
              <Text style={styles.slotLabel}>{slot.label}</Text>
              <Pressable onPress={() => handleAddFood(slot.id)} accessibilityLabel={`Add food to ${slot.label}`}>
                <Text style={styles.addText}>+ Add</Text>
              </Pressable>
            </View>
            {slot.items.length === 0 ? (
              <Text style={styles.emptySlot}>No items planned</Text>
            ) : (
              slot.items.map((item) => (
                <View key={item.id} style={styles.mealItem}>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{item.name}</Text>
                    <Text style={styles.mealMacros}>{item.calories} kcal · P:{item.protein}g C:{item.carbs}g F:{item.fat}g</Text>
                  </View>
                  <Pressable onPress={() => handleRemoveFood(slot.id, item.id)} accessibilityLabel={`Remove ${item.name}`}>
                    <Text style={styles.removeText}>✕</Text>
                  </Pressable>
                </View>
              ))
            )}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.md },
  weekStrip: { marginBottom: spacing.md },
  weekContent: { gap: spacing.sm },
  dayChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  dayChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayChipText: { ...typography.bodySmall, color: colors.textSecondary },
  dayChipTextActive: { color: colors.textInverse },
  totalCard: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-around' },
  totalItem: { alignItems: 'center' },
  totalValue: { ...typography.h3, color: colors.textPrimary },
  totalLabel: { ...typography.caption, color: colors.textMuted },
  mealSlot: { padding: spacing.md, marginBottom: spacing.md },
  slotHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  slotLabel: { ...typography.h4, color: colors.textPrimary },
  addText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  emptySlot: { ...typography.bodySmall, color: colors.textMuted, paddingVertical: spacing.sm },
  mealItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  mealInfo: { flex: 1 },
  mealName: { ...typography.body, color: colors.textPrimary },
  mealMacros: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  removeText: { ...typography.body, color: colors.error, paddingHorizontal: spacing.sm },
});
