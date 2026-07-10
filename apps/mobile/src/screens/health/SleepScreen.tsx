import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useHealthStore } from '../../store/healthStore';
import { PremiumCard } from '../../components/PremiumCard';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { EmptyState } from '../../components/EmptyState';
import { Skeleton } from '../../components/Skeleton';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Sleep'>;

export default function SleepScreen({ navigation }: Props) {
  const { sleepLogs, isLoading, error, fetchSleepLogs, logSleep } = useHealthStore();

  useEffect(() => {
    fetchSleepLogs(7);
  }, []);
  const [duration, setDuration] = useState('');
  const [quality, setQuality] = useState(3);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const average =
    sleepLogs && sleepLogs.length > 0
      ? Math.round(sleepLogs.reduce((s, l) => s + l.duration, 0) / sleepLogs.length)
      : 0;

  const handleSave = async () => {
    const hours = parseFloat(duration);
    if (!hours || hours <= 0) {
      setSaveError('Please enter a valid duration');
      return;
    }
    setSaveError(null);
    setSaving(true);
    try {
      logSleep({
        date: new Date().toISOString().split('T')[0],
        duration: hours,
        quality,
      });
      setDuration('');
      setQuality(3);
    } catch {
      setSaveError('Failed to log sleep');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.title}>Sleep</Text>
        </View>

        <PremiumCard variant="glass" style={styles.logCard}>
          <Text style={styles.cardTitle}>Log Sleep</Text>
          {saveError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{saveError}</Text>
            </View>
          )}
          <Text style={styles.label}>Hours slept</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 7.5"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            value={duration}
            onChangeText={setDuration}
          />
          <Text style={styles.label}>Quality (1-5)</Text>
          <View style={styles.qualityRow}>
            {[1, 2, 3, 4, 5].map((q) => (
              <Pressable
                key={q}
                style={[styles.qualityBtn, quality === q && styles.qualityActive]}
                onPress={() => setQuality(q)}
              >
                <Text style={[styles.qualityText, quality === q && styles.qualityTextActive]}>{q}</Text>
              </Pressable>
            ))}
          </View>
          <Button title="Log Sleep" loading={saving} onPress={handleSave} />
        </PremiumCard>

        <Text style={styles.sectionLabel}>Recent Sleep</Text>
        {isLoading ? (
          <View style={{ gap: spacing.md }}>
            <Skeleton height={200} borderRadius={12} />
            <Skeleton height={60} borderRadius={12} />
            <Skeleton height={60} borderRadius={12} />
            <Skeleton height={60} borderRadius={12} />
          </View>
        ) : error ? (
          <EmptyState icon="⚠️" title="Failed to load sleep data" />
        ) : !sleepLogs || sleepLogs.length === 0 ? (
          <EmptyState icon="🛌" title="No sleep data" description="Log your first night's sleep" />
        ) : (
          <>
            <PremiumCard variant="glass" style={styles.avgCard}>
              <Text style={styles.avgValue}>{average}h</Text>
              <Text style={styles.avgLabel}>Avg Sleep (7 days)</Text>
            </PremiumCard>
            {sleepLogs.map((log) => (
              <PremiumCard key={log.id} variant="glass" style={styles.logItem}>
                <View style={styles.logRow}>
                  <Text style={styles.logDate}>{new Date(log.date).toLocaleDateString()}</Text>
                  <Text style={styles.logDuration}>{log.duration}h</Text>
                  {log.quality && <Text style={styles.logQuality}>Quality: {log.quality}/5</Text>}
                </View>
              </PremiumCard>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  logCard: { padding: spacing.md, marginBottom: spacing.lg },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  label: { color: colors.textSecondary, fontSize: 14, marginBottom: spacing.xs, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qualityRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  qualityBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qualityActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  qualityText: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  qualityTextActive: { color: colors.textInverse },
  sectionLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  avgCard: { padding: spacing.md, marginBottom: spacing.md, alignItems: 'center' },
  avgValue: { ...typography.kpi, color: colors.primary },
  avgLabel: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.xs },
  logItem: { padding: spacing.md, marginBottom: spacing.sm },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logDate: { color: colors.textPrimary },
  logDuration: { color: colors.primary, fontWeight: '700' },
  logQuality: { color: colors.textSecondary, fontSize: 12 },
  errorBanner: {
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: 14, textAlign: 'center' },
});
