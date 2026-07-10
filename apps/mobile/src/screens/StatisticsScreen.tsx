import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Card } from '../components/Card';
import { StatisticCard } from '../components/StatisticCard';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Statistics'>;

export default function StatisticsScreen({ navigation }: Props) {
  const workoutStats = [
    { title: 'Total Workouts', value: '142' },
    { title: 'This Week', value: '5' },
    { title: 'Total Hours', value: '89' },
    { title: 'Avg Duration', value: '37 min' },
  ];

  const battleStats = [
    { title: 'Battles Won', value: '23' },
    { title: 'Battles Lost', value: '8' },
    { title: 'Win Rate', value: '74%' },
    { title: 'Current Streak', value: '3' },
  ];

  const nutritionStats = [
    { title: 'Avg Calories', value: '2,150' },
    { title: 'Goal Hit Rate', value: '78%' },
    { title: 'Water Avg', value: '6.2 cups' },
    { title: 'Log Streak', value: '12 days' },
  ];

  const chartData = [
    { label: 'Mon', value: 85 },
    { label: 'Tue', value: 92 },
    { label: 'Wed', value: 70 },
    { label: 'Thu', value: 95 },
    { label: 'Fri', value: 88 },
    { label: 'Sat', value: 60 },
    { label: 'Sun', value: 75 },
  ];

  const maxVal = Math.max(...chartData.map((d) => d.value));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Statistics</Text>

        <Card style={styles.xpCard}>
          <View style={styles.xpRow}>
            <View>
              <Text style={styles.xpLevel}>Level 24</Text>
              <Text style={styles.xpValue}>12,450 XP</Text>
              <Text style={styles.xpNext}>2,550 XP to next level</Text>
            </View>
            <View style={styles.xpRing}>
              <Text style={styles.xpPercent}>83%</Text>
            </View>
          </View>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: '83%' }]} />
          </View>
        </Card>

        <Card style={styles.streakCard}>
          <View style={styles.streakRow}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View>
              <Text style={styles.streakValue}>15 Day Streak</Text>
              <Text style={styles.streakLabel}>Best: 32 days</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Workouts</Text>
        <View style={styles.statsGrid}>
          {workoutStats.map((s) => (
            <StatisticCard key={s.title} title={s.title} value={s.value} style={styles.statCard} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Battles</Text>
        <View style={styles.statsGrid}>
          {battleStats.map((s) => (
            <StatisticCard key={s.title} title={s.title} value={s.value} style={styles.statCard} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Nutrition</Text>
        <View style={styles.statsGrid}>
          {nutritionStats.map((s) => (
            <StatisticCard key={s.title} title={s.title} value={s.value} style={styles.statCard} />
          ))}
        </View>

        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.chart}>
            {chartData.map((d) => (
              <View key={d.label} style={styles.barCol}>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, { height: `${(d.value / maxVal) * 100}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={styles.barLabel}>{d.label}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg },
  xpCard: { padding: spacing.md, marginBottom: spacing.md },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  xpLevel: { ...typography.h3, color: colors.textPrimary },
  xpValue: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  xpNext: { ...typography.caption, color: colors.textMuted },
  xpRing: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primarySoft, justifyContent: 'center', alignItems: 'center' },
  xpPercent: { ...typography.body, color: colors.primary, fontWeight: '700' },
  xpBarBg: { height: 6, backgroundColor: colors.surfaceTertiary, borderRadius: 3, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  streakCard: { padding: spacing.md, marginBottom: spacing.md },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  streakEmoji: { fontSize: 36 },
  streakValue: { ...typography.h3, color: colors.textPrimary },
  streakLabel: { ...typography.bodySmall, color: colors.textMuted },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm, marginTop: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  statCard: { width: '47%', padding: spacing.sm },
  chartCard: { padding: spacing.md, marginBottom: spacing.md },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140 },
  barCol: { flex: 1, alignItems: 'center' },
  barContainer: { width: '60%', height: 120, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
  barLabel: { ...typography.tiny, color: colors.textMuted, marginTop: spacing.xs },
});
