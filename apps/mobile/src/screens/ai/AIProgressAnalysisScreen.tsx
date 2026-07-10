import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AIStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AIStackParamList, 'AIProgressAnalysis'>;

type Tab = 'workout' | 'nutrition' | 'weight';

export default function AIProgressAnalysisScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('workout');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'workout', label: 'Workout' },
    { key: 'nutrition', label: 'Nutrition' },
    { key: 'weight', label: 'Weight' },
  ];

  const weightData = [
    { label: 'Week 1', value: 82 },
    { label: 'Week 2', value: 81.2 },
    { label: 'Week 3', value: 80.5 },
    { label: 'Week 4', value: 79.8 },
    { label: 'Week 5', value: 79.1 },
    { label: 'Week 6', value: 78.5 },
  ];
  const minWeight = Math.min(...weightData.map((d) => d.value));
  const maxWeight = Math.max(...weightData.map((d) => d.value));
  const weightRange = maxWeight - minWeight || 1;

  const strengthData = [
    { label: 'Bench Press', before: 60, after: 80 },
    { label: 'Squat', before: 80, after: 110 },
    { label: 'Deadlift', before: 100, after: 130 },
  ];

  const recommendations = [
    'Increase protein intake to support muscle recovery',
    'Consider adding HIIT sessions for faster fat loss',
    'Your squat form could benefit from core stability work',
    'Sleep quality is impacting recovery - aim for 8 hours',
  ];

  const renderWeightChart = () => (
    <Card style={styles.chartCard}>
      <Text style={styles.sectionTitle}>Weight Trend</Text>
      <Text style={styles.changeText}>-3.5 kg in 6 weeks</Text>
      <View style={styles.lineChart}>
        {weightData.map((point, i) => {
          const heightPercent = ((point.value - minWeight) / weightRange) * 100;
          return (
            <View key={point.label} style={styles.linePoint}>
              <View style={[styles.lineDot, { bottom: `${heightPercent}%` }]} />
              {i < weightData.length - 1 && (
                <View
                  style={[
                    styles.lineSegment,
                    {
                      bottom: `${heightPercent}%`,
                      transform: [{ rotate: '0deg' }],
                    },
                  ]}
                />
              )}
              <Text style={[styles.lineLabel, { marginTop: 4 }]}>{point.value}kg</Text>
              <Text style={styles.lineLabel}>{point.label}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );

  const renderStrengthChart = () => (
    <Card style={styles.chartCard}>
      <Text style={styles.sectionTitle}>Strength Improvements</Text>
      {strengthData.map((ex) => (
        <View key={ex.label} style={styles.strengthRow}>
          <Text style={styles.strengthLabel}>{ex.label}</Text>
          <View style={styles.strengthBars}>
            <View style={styles.strengthBarRow}>
              <Text style={styles.strengthBarLabel}>Before</Text>
              <View style={styles.strengthBarBg}>
                <View style={[styles.strengthBarFill, { width: `${(ex.before / ex.after) * 100}%`, backgroundColor: colors.textMuted }]} />
              </View>
              <Text style={styles.strengthBarValue}>{ex.before}kg</Text>
            </View>
            <View style={styles.strengthBarRow}>
              <Text style={styles.strengthBarLabel}>After</Text>
              <View style={styles.strengthBarBg}>
                <View style={[styles.strengthBarFill, { width: '100%', backgroundColor: colors.success }]} />
              </View>
              <Text style={[styles.strengthBarValue, { color: colors.success }]}>{ex.after}kg</Text>
            </View>
          </View>
        </View>
      ))}
    </Card>
  );

  const renderNutritionSummary = () => (
    <Card style={styles.chartCard}>
      <Text style={styles.sectionTitle}>Nutrition Progress</Text>
      <View style={styles.nutritionStat}>
        <Text style={styles.nutritionLabel}>Average Daily Calories</Text>
        <Text style={styles.nutritionValue}>2,050 kcal</Text>
      </View>
      <View style={styles.nutritionStat}>
        <Text style={styles.nutritionLabel}>Protein Goal Hit Rate</Text>
        <Text style={styles.nutritionValue}>72%</Text>
      </View>
      <View style={styles.nutritionStat}>
        <Text style={styles.nutritionLabel}>Water Intake Avg</Text>
        <Text style={styles.nutritionValue}>6.2 cups</Text>
      </View>
      <View style={styles.nutritionStat}>
        <Text style={styles.nutritionLabel}>Meal Consistency</Text>
        <Text style={styles.nutritionValue}>Good</Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress Analysis</Text>
        </View>

        <View style={styles.tabs}>
          {tabs.map((t) => (
            <Pressable
              key={t.key}
              style={[styles.tab, activeTab === t.key && styles.tabActive]}
              onPress={() => setActiveTab(t.key)}
            >
              <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {activeTab === 'workout' && renderStrengthChart()}
        {activeTab === 'weight' && renderWeightChart()}
        {activeTab === 'nutrition' && renderNutritionSummary()}

        <Card style={styles.recommendationsCard}>
          <Text style={styles.sectionTitle}>AI Recommendations</Text>
          {recommendations.map((r, i) => (
            <View key={i} style={styles.recRow}>
              <Ionicons name="bulb" size={16} color={colors.accentYellow} />
              <Text style={styles.recText}>{r}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.areasCard}>
          <Text style={styles.sectionTitle}>Areas for Improvement</Text>
          <View style={styles.areaRow}>
            <View style={[styles.areaDot, { backgroundColor: colors.accentOrange }]} />
            <Text style={styles.areaText}>Consistency on weekends</Text>
          </View>
          <View style={styles.areaRow}>
            <View style={[styles.areaDot, { backgroundColor: colors.accentOrange }]} />
            <Text style={styles.areaText}>Water intake below target</Text>
          </View>
          <View style={styles.areaRow}>
            <View style={[styles.areaDot, { backgroundColor: colors.success }]} />
            <Text style={styles.areaText}>Strength improving steadily</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: 2, marginBottom: spacing.lg },
  tab: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: colors.textInverse },
  chartCard: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  changeText: { ...typography.body, color: colors.success, fontWeight: '700', marginBottom: spacing.md },
  lineChart: { flexDirection: 'row', justifyContent: 'space-between', height: 200, alignItems: 'flex-end' },
  linePoint: { flex: 1, alignItems: 'center', position: 'relative', justifyContent: 'flex-end' },
  lineDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  lineSegment: { position: 'absolute', height: 2, backgroundColor: colors.primary, width: '100%', left: '50%' },
  lineLabel: { ...typography.tiny, color: colors.textMuted, marginTop: 20 },
  strengthRow: { marginBottom: spacing.md },
  strengthLabel: { ...typography.body, color: colors.textPrimary, fontWeight: '600', marginBottom: spacing.xs },
  strengthBars: { gap: 4 },
  strengthBarRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  strengthBarLabel: { ...typography.tiny, color: colors.textMuted, width: 36 },
  strengthBarBg: { flex: 1, height: 8, backgroundColor: colors.surfaceTertiary, borderRadius: 4, overflow: 'hidden' },
  strengthBarFill: { height: '100%', borderRadius: 4 },
  strengthBarValue: { ...typography.caption, color: colors.textMuted, width: 40, textAlign: 'right' },
  nutritionStat: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  nutritionLabel: { ...typography.bodySmall, color: colors.textSecondary },
  nutritionValue: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  recommendationsCard: { padding: spacing.md, marginBottom: spacing.md },
  recRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'flex-start' },
  recText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1 },
  areasCard: { padding: spacing.md },
  areaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  areaDot: { width: 8, height: 8, borderRadius: 4 },
  areaText: { ...typography.bodySmall, color: colors.textPrimary },
});
