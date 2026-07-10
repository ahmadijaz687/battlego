import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/SectionHeader';
import { StatisticCard } from '../components/StatisticCard';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';
import { Toast } from '../components/Toast';
import { useHealthStore } from '../store/healthStore';
import type { HealthReading, HealthSource } from '../services/healthService';

type Props = NativeStackScreenProps<RootStackParamList, 'HealthSync'>;

type ProviderState = Record<HealthSource, boolean>;

// NOTE: Real HealthKit / Google Fit SDK integration is out of scope. The sample
// readings generated below are a PLACEHOLDER until native health SDKs are wired up.
function buildSampleReadings(source: HealthSource): HealthReading[] {
  const today = new Date().toISOString();
  return [
    { source, metric: 'steps', value: 8432, recordedAt: today },
    { source, metric: 'heartRate', value: 72, recordedAt: today },
    { source, metric: 'sleep', value: 7.5, recordedAt: today },
    { source, metric: 'weight', value: 74.2, recordedAt: today },
  ];
}

export default function HealthSyncScreen({ navigation }: Props) {
  const [connected, setConnected] = useState<ProviderState>({ apple_health: false, google_fit: false, manual: false, device: false });
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

  const { healthMetrics, isLoading: summaryLoading, error: healthError, fetchHealthMetrics, syncHealth } = useHealthStore();

  useEffect(() => {
    fetchHealthMetrics(7);
  }, []);

  const handleConnect = async (source: HealthSource) => {
    const next = { ...connected, [source]: !connected[source] };
    setConnected(next);
    if (!next[source]) return;

    try {
      const readings = buildSampleReadings(source);
      syncHealth(readings);
      setToast({
        visible: true,
        message: `${source === 'apple_health' ? 'Apple Health' : 'Google Fit'} synced — ${readings.length} reading(s) sent`,
      });
    } catch {
      setConnected((prev) => ({ ...prev, [source]: false }));
      setToast({ visible: true, message: 'Sync failed. Please try again.' });
    }
  };

  const summaryItems = [
    { key: 'steps', icon: 'footsteps-outline' as const, label: 'Steps', value: healthMetrics?.steps, unit: 'steps' },
    { key: 'heartRate', icon: 'heart-outline' as const, label: 'Heart Rate', value: healthMetrics?.heartRate, unit: 'bpm' },
    { key: 'sleep', icon: 'moon-outline' as const, label: 'Sleep', value: healthMetrics?.sleep, unit: 'hrs' },
    { key: 'weight', icon: 'scale-outline' as const, label: 'Weight', value: healthMetrics?.weight, unit: 'kg' },
  ];

  const renderProvider = (source: HealthSource, label: string, icon: any) => (
    <Card key={source} variant="surface" style={styles.providerRow}>
      <Ionicons name={icon} size={26} color={connected[source] ? colors.primary : colors.textSecondary} />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={styles.providerLabel}>{label}</Text>
        <Text style={styles.providerStatus}>
          {connected[source] ? 'Connected — sample data synced' : 'Not connected'}
        </Text>
      </View>
      <Switch
        value={connected[source]}
        onValueChange={() => handleConnect(source)}
        thumbColor={connected[source] ? colors.primary : colors.textMuted}
        trackColor={{ false: colors.surfaceTertiary, true: colors.primarySoft }}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Health Sync</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader title="Connect a provider" subtitle="Mock sync — native SDKs pending" />
        {renderProvider('apple_health', 'Apple Health', 'logo-apple')}
        {renderProvider('google_fit', 'Google Fit', 'logo-google')}

        <SectionHeader title="Last 7 days" subtitle="Aggregated from synced readings" />
        {summaryLoading ? (
          <View style={{ gap: spacing.sm }}>
            <Skeleton height={72} borderRadius={borderRadius.card} />
            <Skeleton height={72} borderRadius={borderRadius.card} />
          </View>
        ) : healthMetrics && (healthMetrics.steps !== null || healthMetrics.heartRate !== null || healthMetrics.sleep !== null || healthMetrics.weight !== null) ? (
          <View style={styles.summaryGrid}>
            {summaryItems.map((item) => (
              <StatisticCard
                key={item.key}
                title={item.label}
                value={item.value != null ? item.value : '—'}
                unit={item.value != null ? item.unit : undefined}
                icon={<Ionicons name={item.icon} size={22} color={colors.primary} />}
                style={styles.summaryCard}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="🩺"
            title="No health data yet"
            description="Connect a provider above to send sample readings and view your summary."
          />
        )}

        <Text style={styles.note}>
          Sample readings are generated locally as a placeholder until HealthKit and Google Fit SDKs are integrated.
        </Text>

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        variant={toast.message.includes('failed') ? 'error' : 'success'}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  content: { paddingBottom: spacing.xl },
  providerRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, marginBottom: spacing.sm },
  providerLabel: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  providerStatus: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  summaryCard: { width: '47%' },
  note: { ...typography.caption, color: colors.textMuted, marginTop: spacing.md, textAlign: 'center' },
});
