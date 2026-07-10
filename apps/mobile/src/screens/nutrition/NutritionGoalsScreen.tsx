import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NutritionStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';

type Props = NativeStackScreenProps<NutritionStackParamList, 'NutritionGoals'>;

interface Goals {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  water: string;
  targetWeight: string;
}

export default function NutritionGoalsScreen({ navigation }: Props) {
  const [goals, setGoals] = useState<Goals>({
    calories: '2200',
    protein: '150',
    carbs: '250',
    fat: '65',
    fiber: '30',
    water: '8',
    targetWeight: '75',
  });

  const updateGoal = (key: keyof Goals, value: string) => {
    setGoals((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    navigation.goBack();
  };

  const currentIntake = {
    calories: 1850,
    protein: 120,
    carbs: 200,
    fat: 50,
    fiber: 20,
    water: 5,
  };

  const progressItems = [
    { label: 'Calories', current: currentIntake.calories, target: Number(goals.calories), unit: 'kcal', color: colors.primary },
    { label: 'Protein', current: currentIntake.protein, target: Number(goals.protein), unit: 'g', color: colors.accentGreen },
    { label: 'Carbs', current: currentIntake.carbs, target: Number(goals.carbs), unit: 'g', color: colors.accentOrange },
    { label: 'Fat', current: currentIntake.fat, target: Number(goals.fat), unit: 'g', color: colors.info },
    { label: 'Fiber', current: currentIntake.fiber, target: Number(goals.fiber), unit: 'g', color: colors.accentPurple },
    { label: 'Water', current: currentIntake.water, target: Number(goals.water), unit: 'cups', color: colors.secondary },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Nutrition Goals</Text>

        <Card style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          {progressItems.map((item) => (
            <View key={item.label} style={styles.progressRow}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>{item.label}</Text>
                <Text style={styles.progressValue}>
                  {item.current}/{item.target} {item.unit}
                </Text>
              </View>
              <ProgressBar progress={Math.min(item.current / item.target, 1)} color={item.color} style={styles.progressBar} />
            </View>
          ))}
        </Card>

        <Card style={styles.goalsCard}>
          <Text style={styles.sectionTitle}>Set Goals</Text>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Daily Calories (kcal)</Text>
              <TextInput
                style={styles.input}
                value={goals.calories}
                onChangeText={(v) => updateGoal('calories', v)}
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                value={goals.protein}
                onChangeText={(v) => updateGoal('protein', v)}
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                value={goals.carbs}
                onChangeText={(v) => updateGoal('carbs', v)}
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                value={goals.fat}
                onChangeText={(v) => updateGoal('fat', v)}
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fiber (g)</Text>
              <TextInput
                style={styles.input}
                value={goals.fiber}
                onChangeText={(v) => updateGoal('fiber', v)}
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Water (cups)</Text>
              <TextInput
                style={styles.input}
                value={goals.water}
                onChangeText={(v) => updateGoal('water', v)}
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Target Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={goals.targetWeight}
                onChangeText={(v) => updateGoal('targetWeight', v)}
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.inputGroup} />
          </View>

          <Button title="Save Goals" style={styles.saveBtn} onPress={handleSave} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg },
  progressCard: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  progressRow: { marginBottom: spacing.sm },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { ...typography.bodySmall, color: colors.textSecondary },
  progressValue: { ...typography.caption, color: colors.textMuted },
  progressBar: { height: 8, borderRadius: 4 },
  goalsCard: { padding: spacing.md },
  inputRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  inputGroup: { flex: 1 },
  inputLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: '600' },
  input: { backgroundColor: colors.surfaceTertiary, borderRadius: borderRadius.sm, padding: spacing.sm, ...typography.body, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  saveBtn: { marginTop: spacing.md },
});
