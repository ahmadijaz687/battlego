import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useHealthStore } from '../../store/healthStore';
import { PremiumCard } from '../../components/PremiumCard';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Skeleton } from '../../components/Skeleton';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'HRV'>;

export default function HRVScreen({ navigation }: Props) {
  const { hrvLogs, isLoading, error, fetchHRVLogs, logHRV } = useHealthStore();

  useEffect(() => {
    fetchHRVLogs(7);
  }, []);
  const [hrv, setHrv] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const average =
    hrvLogs && hrvLogs.length > 0
      ? Math.round(hrvLogs.reduce((s, l) => s + l.hrv, 0) / hrvLogs.length)
      : 0;

  const handleSave = async () => {
    const value = parseInt(hrv, 10);
    if (!value || value <= 0) {
      setSaveError('Please enter a valid HRV value');
      return;
    }
    setSaveError(null);
    setSaving(true);
    try {
      logHRV({
        date: new Date().toISOString().split('T')[0],
        hrv: value,
      });
      setHrv('');
    } catch {
      setSaveError('Failed to log HRV');
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
          <Text style={styles.title}>HRV</Text>
        </View>

        <PremiumCard variant="glass" style={styles.logCard}>
          <Text style={styles.cardTitle}>Log HRV</Text>
          {saveError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{saveError}</Text>
            </View>
          )}
          <Text style={styles.label}>Heart Rate Variability (ms)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 65"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            value={hrv}
            onChangeText={setHrv}
          />
          <Button title="Log HRV" loading={saving} onPress={handleSave} />
        </PremiumCard>

        <Text style={styles.sectionLabel}>Recent HRV</Text>
        {isLoading ? (
          <View style={{ gap: spacing.md }}>
            <Skeleton height={180} borderRadius={12} />
            <Skeleton height={60} borderRadius={12} />
            <Skeleton height={60} borderRadius={12} />
            <Skeleton height={60} borderRadius={12} />
          </View>
        ) : error ? (
          <EmptyState icon="⚠️" title="Failed to load HRV data" />
        ) : !hrvLogs || hrvLogs.length === 0 ? (
          <EmptyState icon="❤️" title="No HRV data" description="Log your first reading" />
        ) : (
          <>
            <PremiumCard variant="glass" style={styles.avgCard}>
              <Text style={styles.avgValue}>{average}ms</Text>
              <Text style={styles.avgLabel}>Avg HRV (7 days)</Text>
            </PremiumCard>
            {hrvLogs.map((log) => (
              <PremiumCard key={log.id} variant="glass" style={styles.logItem}>
                <View style={styles.logRow}>
                  <Text style={styles.logDate}>{new Date(log.date).toLocaleDateString()}</Text>
                  <Text style={styles.logValue}>{log.hrv}ms</Text>
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
    marginBottom: spacing.md,
  },
  sectionLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  avgCard: { padding: spacing.md, marginBottom: spacing.md, alignItems: 'center' },
  avgValue: { ...typography.kpi, color: colors.primary },
  avgLabel: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.xs },
  logItem: { padding: spacing.md, marginBottom: spacing.sm },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logDate: { color: colors.textPrimary },
  logValue: { color: colors.primary, fontWeight: '700' },
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
