import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NutritionStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

type Props = NativeStackScreenProps<NutritionStackParamList, 'BMICalculator'>;

const bmiCategories = [
  { range: 'Below 18.5', label: 'Underweight', color: colors.info },
  { range: '18.5 - 24.9', label: 'Normal', color: colors.success },
  { range: '25.0 - 29.9', label: 'Overweight', color: colors.accentOrange },
  { range: '30.0 - 34.9', label: 'Obese Class I', color: colors.warning },
  { range: '35.0 - 39.9', label: 'Obese Class II', color: colors.secondaryRed },
  { range: '40.0+', label: 'Obese Class III', color: colors.error },
];

export default function BMICalculatorScreen({ navigation }: Props) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const handleCalculate = () => {
    const h = Number(height) / 100;
    const w = Number(weight);
    if (!h || !w) return;
    setBmi(Math.round((w / (h * h)) * 10) / 10);
  };

  const getCategory = (value: number) => {
    if (value < 18.5) return bmiCategories[0];
    if (value < 25) return bmiCategories[1];
    if (value < 30) return bmiCategories[2];
    if (value < 35) return bmiCategories[3];
    if (value < 40) return bmiCategories[4];
    return bmiCategories[5];
  };

  const heightInCm = Number(height);
  const weightInKg = Number(weight);
  const healthyMin = heightInCm ? Math.round(18.5 * (heightInCm / 100) ** 2) : null;
  const healthyMax = heightInCm ? Math.round(24.9 * (heightInCm / 100) ** 2) : null;

  const category = bmi ? getCategory(bmi) : null;
  const bmiPercent = bmi ? Math.min((bmi / 40) * 100, 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>BMI Calculator</Text>

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
          <Button title="Calculate BMI" onPress={handleCalculate} />
        </Card>

        {bmi !== null && category && (
          <Card style={styles.resultCard}>
            <Text style={styles.bmiValue}>{bmi}</Text>
            <Text style={[styles.bmiCategory, { color: category.color }]}>{category.label}</Text>

            <View style={styles.bmiScale}>
              <View style={[styles.bmiFill, { width: `${bmiPercent}%`, backgroundColor: category.color }]} />
            </View>

            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>18.5</Text>
              <Text style={styles.scaleLabel}>25</Text>
              <Text style={styles.scaleLabel}>30</Text>
              <Text style={styles.scaleLabel}>40</Text>
            </View>

            {healthyMin && healthyMax && (
              <View style={styles.healthyRange}>
                <Text style={styles.healthyTitle}>Healthy Weight Range</Text>
                <Text style={styles.healthyValue}>{healthyMin} kg - {healthyMax} kg</Text>
              </View>
            )}
          </Card>
        )}

        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>BMI Categories</Text>
          {bmiCategories.map((cat) => (
            <View key={cat.label} style={styles.categoryRow}>
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <Text style={styles.categoryRange}>{cat.range}</Text>
            </View>
          ))}
        </Card>
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
  resultCard: { padding: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  bmiValue: { ...typography.kpi, color: colors.textPrimary },
  bmiCategory: { ...typography.h4, marginTop: spacing.xs, marginBottom: spacing.md },
  bmiScale: { width: '100%', height: 8, backgroundColor: colors.surfaceTertiary, borderRadius: 4, overflow: 'hidden' },
  bmiFill: { height: '100%', borderRadius: 4 },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: spacing.xs },
  scaleLabel: { ...typography.tiny, color: colors.textMuted },
  healthyRange: { marginTop: spacing.md, alignItems: 'center' },
  healthyTitle: { ...typography.bodySmall, color: colors.textSecondary },
  healthyValue: { ...typography.body, color: colors.success, fontWeight: '700', marginTop: 2 },
  chartCard: { padding: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  categoryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs, gap: spacing.sm },
  categoryDot: { width: 10, height: 10, borderRadius: 5 },
  categoryLabel: { ...typography.bodySmall, color: colors.textPrimary, flex: 1 },
  categoryRange: { ...typography.caption, color: colors.textMuted },
});
