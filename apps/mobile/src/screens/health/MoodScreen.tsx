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

type Props = NativeStackScreenProps<RootStackParamList, 'Mood'>;

const MOOD_EMOJIS = ['😢', '😟', '😐', '🙂', '😄'];
const STRESS_LEVELS = ['Low', 'Medium', 'High'];

export default function MoodScreen({ navigation }: Props) {
  const { moodLogs, isLoading, error, fetchMoodLogs, logMood } = useHealthStore();

  useEffect(() => {
    fetchMoodLogs(7);
  }, []);
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const average =
    moodLogs && moodLogs.length > 0
      ? (moodLogs.reduce((s, l) => s + l.mood, 0) / moodLogs.length).toFixed(1)
      : '--';

  const handleSave = async () => {
    setSaveError(null);
    setSaving(true);
    try {
      logMood({
        date: new Date().toISOString().split('T')[0],
        mood,
        energy: energy ?? undefined,
        stress: stress ?? undefined,
        note: note.trim() || undefined,
      });
      setMood(3);
      setStress(null);
      setEnergy(null);
      setNote('');
    } catch {
      setSaveError('Failed to log mood');
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
          <Text style={styles.title}>Mood</Text>
        </View>

        <PremiumCard variant="glass" style={styles.logCard}>
          <Text style={styles.cardTitle}>Log Mood</Text>
          {saveError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{saveError}</Text>
            </View>
          )}
          <Text style={styles.label}>How are you feeling?</Text>
          <View style={styles.moodRow}>
            {MOOD_EMOJIS.map((emoji, i) => (
              <Pressable
                key={i}
                style={[styles.moodBtn, mood === i + 1 && styles.moodActive]}
                onPress={() => setMood(i + 1)}
              >
                <Text style={styles.moodEmoji}>{emoji}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.label}>Stress Level</Text>
          <View style={styles.stressRow}>
            {STRESS_LEVELS.map((level, i) => (
              <Pressable
                key={level}
                style={[styles.stressBtn, stress === i && styles.stressActive]}
                onPress={() => setStress(stress === i ? null : i)}
              >
                <Text style={[styles.stressText, stress === i && styles.stressTextActive]}>{level}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.label}>Energy Level (1-5)</Text>
          <View style={styles.energyRow}>
            {[1, 2, 3, 4, 5].map((e) => (
              <Pressable
                key={e}
                style={[styles.energyBtn, energy === e && styles.energyActive]}
                onPress={() => setEnergy(energy === e ? null : e)}
              >
                <Text style={[styles.energyText, energy === e && styles.energyTextActive]}>{e}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="How was your day?"
            placeholderTextColor={colors.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
          />
          <Button title="Log Mood" loading={saving} onPress={handleSave} />
        </PremiumCard>

        <Text style={styles.sectionLabel}>Recent Mood</Text>
        {isLoading ? (
          <View style={{ gap: spacing.md }}>
            <Skeleton height={280} borderRadius={12} />
            <Skeleton height={60} borderRadius={12} />
            <Skeleton height={60} borderRadius={12} />
            <Skeleton height={60} borderRadius={12} />
          </View>
        ) : error ? (
          <EmptyState icon="⚠️" title="Failed to load mood data" />
        ) : !moodLogs || moodLogs.length === 0 ? (
          <EmptyState icon="😊" title="No mood data" description="Log your first mood" />
        ) : (
          <>
            <PremiumCard variant="glass" style={styles.avgCard}>
              <Text style={styles.avgValue}>{average}</Text>
              <Text style={styles.avgLabel}>Avg Mood (7 days)</Text>
            </PremiumCard>
            {moodLogs.map((log) => (
              <PremiumCard key={log.id} variant="glass" style={styles.logItem}>
                <View style={styles.logRow}>
                  <Text style={styles.logDate}>{new Date(log.date).toLocaleDateString()}</Text>
                  <View style={styles.logRight}>
                    <Text style={styles.logMood}>{MOOD_EMOJIS[log.mood - 1] || '😐'}</Text>
                    {log.stress !== null && <Text style={styles.logStress}>Stress: {STRESS_LEVELS[log.stress]}</Text>}
                  </View>
                </View>
                {log.note && <Text style={styles.logNote}>{log.note}</Text>}
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
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  moodBtn: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  moodActive: { backgroundColor: colors.primary + '30', borderColor: colors.primary },
  moodEmoji: { fontSize: 28 },
  stressRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  stressBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stressActive: { backgroundColor: colors.warning + '30', borderColor: colors.warning },
  stressText: { color: colors.textPrimary },
  stressTextActive: { color: colors.warning, fontWeight: '700' },
  energyRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  energyBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  energyActive: { backgroundColor: colors.primary + '30', borderColor: colors.primary },
  energyText: { color: colors.textPrimary, fontWeight: '600' },
  energyTextActive: { color: colors.primary },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  sectionLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  avgCard: { padding: spacing.md, marginBottom: spacing.md, alignItems: 'center' },
  avgValue: { ...typography.kpi, color: colors.primary },
  avgLabel: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.xs },
  logItem: { padding: spacing.md, marginBottom: spacing.sm },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logDate: { color: colors.textPrimary },
  logRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logMood: { fontSize: 20 },
  logStress: { color: colors.textSecondary, fontSize: 12 },
  logNote: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs, fontStyle: 'italic' },
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
