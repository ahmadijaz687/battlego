import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';
import { NutritionSummary } from '../../types/dashboard';

interface NutritionSummaryCardProps {
  nutrition: NutritionSummary;
}

export function NutritionSummaryCard({ nutrition }: NutritionSummaryCardProps) {
  return (
    <Card>
      <Text style={styles.title}>Nutrition</Text>
      <View style={styles.row}>
        <Text style={styles.item}>{nutrition.protein}g protein</Text>
        <Text style={styles.item}>{nutrition.carbs}g carbs</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.item}>{nutrition.fat}g fat</Text>
        <Text style={styles.item}>{nutrition.calories} cal</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textSecondary, fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  item: { color: colors.textPrimary, fontSize: 14 },
});