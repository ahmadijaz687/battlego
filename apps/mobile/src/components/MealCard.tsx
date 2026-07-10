import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Meal } from '../types/nutrition';
import { Tag } from './Tag';

interface MealCardProps {
  meal: Meal;
  onPress: () => void;
  style?: ViewStyle;
  macros?: { protein: number; carbs: number; fat: number };
}

export function MealCard({ meal, onPress, style, macros }: MealCardProps) {
  const totalProtein = macros?.protein ?? 0;
  const totalCarbs = macros?.carbs ?? 0;
  const totalFat = macros?.fat ?? 0;
  const totalCals = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;

  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.name}>{meal.name}</Text>
        <Tag label={`${meal.foods.length} items`} variant="default" />
      </View>
      {meal.time && <Text style={styles.time}>{meal.time}</Text>}
      <View style={styles.macrosRow}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{Math.round(totalCals)}</Text>
          <Text style={styles.macroLabel}>Cal</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{Math.round(totalProtein)}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{Math.round(totalCarbs)}g</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{Math.round(totalFat)}g</Text>
          <Text style={styles.macroLabel}>Fat</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600', flex: 1, marginRight: spacing.sm },
  time: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  macrosRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  macroItem: { alignItems: 'center' },
  macroValue: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '700' },
  macroLabel: { ...typography.tiny, color: colors.textMuted, textTransform: 'uppercase' },
  macroDivider: { width: 1, height: 24, backgroundColor: colors.border },
});
