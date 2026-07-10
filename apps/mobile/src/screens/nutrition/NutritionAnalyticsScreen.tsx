import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NutritionStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Card } from '../../components/Card';
import { StatisticCard } from '../../components/StatisticCard';

type Props = NativeStackScreenProps<NutritionStackParamList, 'NutritionAnalytics'>;

type Period = 'weekly' | 'monthly' | 'yearly';

const periods: Period[] = ['weekly', 'monthly', 'yearly'];

export default function NutritionAnalyticsScreen({ navigation }: Props) {
  const [activePeriod, setActivePeriod] = useState<Period>('weekly');

  const chartBars = [
    { label: 'Mon', value: 85 },
    { label: 'Tue', value: 92 },
    { label: 'Wed', value: 78 },
    { label: 'Thu', value: 95 },
    { label: 'Fri', value: 88 },
    { label: 'Sat', value: 70 },
    { label: 'Sun', value: 90 },
  ];

  const macroData = [
    { label: 'Protein', value: 65, color: colors.accentGreen },
    { label: 'Carbs', value: 55, color: colors.accentOrange },
    { label: 'Fat', value: 45, color: colors.info },
  ];

  const averageStats = {
    calories: '2,050',
    protein: '135g',
    carbs: '210g',
    fat: '55g',
    water: '6.5 cups',
  };

  const maxValue = Math.max(...chartBars.map((b) => b.value));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Analytics</Text>

        <View style={styles.tabs}>
          {periods.map((p) => (
            <Pressable
              key={p}
              style={[styles.tab, activePeriod === p && styles.tabActive]}
              onPress={() => setActivePeriod(p)}
            >
              <Text style={[styles.tabText, activePeriod === p && styles.tabTextActive]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Calories</Text>
          <View style={styles.chart}>
            {chartBars.map((bar) => (
              <View key={bar.label} style={styles.barCol}>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, { height: `${(bar.value / maxValue) * 100}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={styles.barLabel}>{bar.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.macroCard}>
          <Text style={styles.sectionTitle}>Macro Breakdown</Text>
          {macroData.map((m) => (
            <View key={m.label} style={styles.macroRow}>
              <Text style={styles.macroLabel}>{m.label}</Text>
              <View style={styles.macroBarBg}>
                <View style={[styles.macroBar, { width: `${m.value}%`, backgroundColor: m.color }]} />
              </View>
              <Text style={styles.macroValue}>{m.value}%</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.averagesCard}>
          <Text style={styles.sectionTitle}>Average Daily Stats</Text>
          <View style={styles.avgGrid}>
            <StatisticCard title="Calories" value={averageStats.calories} style={styles.avgItem} />
            <StatisticCard title="Protein" value={averageStats.protein} style={styles.avgItem} />
            <StatisticCard title="Carbs" value={averageStats.carbs} style={styles.avgItem} />
            <StatisticCard title="Fat" value={averageStats.fat} style={styles.avgItem} />
            <StatisticCard title="Water" value={averageStats.water} style={styles.avgItem} />
          </View>
        </Card>

        <Card style={styles.goalRateCard}>
          <Text style={styles.sectionTitle}>Goal Completion Rate</Text>
          <Text style={styles.goalRateValue}>82%</Text>
          <Text style={styles.goalRateSub}>of daily nutrition goals met this {activePeriod}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.md },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: 2, marginBottom: spacing.lg },
  tab: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: colors.textInverse },
  chartCard: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  barCol: { flex: 1, alignItems: 'center' },
  barContainer: { width: '60%', height: 140, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
  barLabel: { ...typography.tiny, color: colors.textMuted, marginTop: spacing.xs },
  macroCard: { padding: spacing.md, marginBottom: spacing.md },
  macroRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  macroLabel: { ...typography.bodySmall, color: colors.textSecondary, width: 60 },
  macroBarBg: { flex: 1, height: 8, backgroundColor: colors.surfaceTertiary, borderRadius: 4, marginHorizontal: spacing.sm },
  macroBar: { height: '100%', borderRadius: 4 },
  macroValue: { ...typography.caption, color: colors.textMuted, width: 36, textAlign: 'right' },
  averagesCard: { padding: spacing.md, marginBottom: spacing.md },
  avgGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  avgItem: { width: '47%', padding: spacing.sm },
  goalRateCard: { padding: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  goalRateValue: { ...typography.kpi, color: colors.success, marginBottom: spacing.xs },
  goalRateSub: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
});
