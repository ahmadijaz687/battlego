import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NutritionStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

type Props = NativeStackScreenProps<NutritionStackParamList, 'MacroCalculator'>;

const activityLevels = [
  { key: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { key: 'light', label: 'Light', desc: '1-3 days/week' },
  { key: 'moderate', label: 'Moderate', desc: '3-5 days/week' },
  { key: 'active', label: 'Active', desc: '6-7 days/week' },
  { key: 'extreme', label: 'Extreme', desc: 'Twice/day' },
];

const goals = [
  { key: 'lose', label: 'Lose Weight', factor: 0.8 },
  { key: 'maintain', label: 'Maintain', factor: 1.0 },
  { key: 'gain', label: 'Gain Weight', factor: 1.15 },
];

const activityFactors: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extreme: 1.9,
};

interface Results {
  bmr: number;
  tdee: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export default function MacroCalculatorScreen({ navigation }: Props) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [results, setResults] = useState<Results | null>(null);

  const handleCalculate = () => {
    const h = Number(height);
    const w = Number(weight);
    const a = Number(age);
    if (!h || !w || !a) return;

    const bmr = gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = bmr * (activityFactors[activityLevel] || 1.55);
    const goalFactor = goals.find((g) => g.key === goal)?.factor || 1.0;
    const targetCalories = Math.round(tdee * goalFactor);
    const protein = Math.round(w * 2.0);
    const fat = Math.round(w * 0.8);
    const carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);

    setResults({ bmr: Math.round(bmr), tdee: Math.round(tdee), protein, carbs, fat, calories: targetCalories });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Macro Calculator</Text>

        <Card style={styles.inputCard}>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" placeholderTextColor={colors.textMuted} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholderTextColor={colors.textMuted} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderRow}>
                <Pressable style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]} onPress={() => setGender('male')}>
                  <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
                </Pressable>
                <Pressable style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]} onPress={() => setGender('female')}>
                  <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <Text style={styles.inputLabel}>Activity Level</Text>
          <View style={styles.activityRow}>
            {activityLevels.map((al) => (
              <Pressable
                key={al.key}
                style={[styles.activityChip, activityLevel === al.key && styles.activityChipActive]}
                onPress={() => setActivityLevel(al.key)}
              >
                <Text style={[styles.activityChipLabel, activityLevel === al.key && styles.activityChipLabelActive]}>{al.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.inputLabel}>Goal</Text>
          <View style={styles.goalRow}>
            {goals.map((g) => (
              <Pressable
                key={g.key}
                style={[styles.goalChip, goal === g.key && styles.goalChipActive]}
                onPress={() => setGoal(g.key)}
              >
                <Text style={[styles.goalChipLabel, goal === g.key && styles.goalChipLabelActive]}>{g.label}</Text>
              </Pressable>
            ))}
          </View>

          <Button title="Calculate" style={styles.calcBtn} onPress={handleCalculate} />
        </Card>

        {results && (
          <Card style={styles.resultsCard}>
            <Text style={styles.sectionTitle}>Your Results</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Basal Metabolic Rate (BMR)</Text>
              <Text style={styles.resultValue}>{results.bmr} kcal</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Daily Energy Expenditure (TDEE)</Text>
              <Text style={styles.resultValue}>{results.tdee} kcal</Text>
            </View>
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Recommended Daily Intake</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Calories</Text>
              <Text style={[styles.resultValue, { color: colors.primary }]}>{results.calories} kcal</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Protein</Text>
              <Text style={[styles.resultValue, { color: colors.accentGreen }]}>{results.protein}g</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Carbohydrates</Text>
              <Text style={[styles.resultValue, { color: colors.accentOrange }]}>{results.carbs}g</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Fat</Text>
              <Text style={[styles.resultValue, { color: colors.info }]}>{results.fat}g</Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg },
  inputCard: { padding: spacing.md, marginBottom: spacing.md },
  inputRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  inputGroup: { flex: 1 },
  inputLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: '600' },
  input: { backgroundColor: colors.surfaceTertiary, borderRadius: borderRadius.sm, padding: spacing.sm, ...typography.body, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  genderRow: { flexDirection: 'row', gap: spacing.xs },
  genderBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.sm, alignItems: 'center', backgroundColor: colors.surfaceTertiary, borderWidth: 1, borderColor: colors.border },
  genderBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  genderText: { ...typography.bodySmall, color: colors.textSecondary },
  genderTextActive: { color: colors.textInverse },
  activityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  activityChip: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.surfaceTertiary, borderWidth: 1, borderColor: colors.border },
  activityChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  activityChipLabel: { ...typography.caption, color: colors.textSecondary },
  activityChipLabelActive: { color: colors.textInverse },
  goalRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  goalChip: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.sm, alignItems: 'center', backgroundColor: colors.surfaceTertiary, borderWidth: 1, borderColor: colors.border },
  goalChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  goalChipLabel: { ...typography.bodySmall, color: colors.textSecondary },
  goalChipLabelActive: { color: colors.textInverse },
  calcBtn: { marginTop: spacing.sm },
  resultsCard: { padding: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  resultLabel: { ...typography.bodySmall, color: colors.textSecondary, flex: 1 },
  resultValue: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
});
