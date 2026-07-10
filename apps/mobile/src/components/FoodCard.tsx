import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';
import { FoodItem } from '../types/food';

interface FoodCardProps {
  food: FoodItem;
  onPress: () => void;
  style?: ViewStyle;
}

export function FoodCard({ food, onPress, style }: FoodCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      <View style={styles.info}>
        <Text style={styles.name}>{food.name}</Text>
        {food.brand && <Text style={styles.brand}>{food.brand}</Text>}
        <Text style={styles.nutrition}>{food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {},
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  brand: { color: colors.textSecondary, fontSize: 12 },
  nutrition: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
});