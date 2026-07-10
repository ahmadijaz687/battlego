import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { useNutritionStore } from '../../store/nutritionStore';
import { PremiumCard } from '../../components/PremiumCard';
import { Badge } from '../../components/Badge';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'WeightTracking'>;

export default function WeightTrackingScreen({ navigation }: Props) {
  const { weightLogs, isLoading, fetchWeightLogs, createWeightLog } = useNutritionStore();
  const [weightInput, setWeightInput] = useState('');
  const [goalWeight, setGoalWeight] = useState('170');

  useEffect(() => {
    fetchWeightLogs();
  }, []);

  const latest = weightLogs && weightLogs.length > 0 ? weightLogs[0] : null;
  const currentWeight = latest ? `${latest.weight}` : '—';
  const unit = latest?.unit || 'lbs';

  const goalType: 'lose' | 'maintain' | 'gain' = 'lose';

  const handleAddWeight = () => {
    const weight = parseFloat(weightInput);
    if (weight > 0) {
      createWeightLog({ date: new Date().toISOString().split('T')[0], weight, unit });
      setWeightInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Weight Tracking</Text>
      </View>

      <PremiumCard variant="gradient" style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{currentWeight} {unit}</Text>
        <Text style={styles.summaryLabel}>Current Weight</Text>
        <View style={styles.metaRow}>
          <Badge label={`${goalType} goal`} variant={goalType === 'lose' ? 'error' : goalType === 'maintain' ? 'warning' : 'success'} size="sm" />
        </View>
        <TextField placeholder="Goal weight" value={goalWeight} onChangeText={setGoalWeight} style={styles.goalInput} />
      </PremiumCard>

      <PremiumCard variant="glass" style={styles.addCard}>
        <View style={styles.addRow}>
          <TextField
            placeholder="Enter weight"
            value={weightInput}
            onChangeText={setWeightInput}
            keyboardType="numeric"
            style={styles.weightInput}
          />
          <Button
            title="Log"
            variant="primary"
            size="sm"
            onPress={handleAddWeight}
            loading={isLoading}
          />
        </View>
      </PremiumCard>

      <Text style={styles.historyTitle}>History</Text>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={weightLogs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PremiumCard variant="glass" style={styles.logCard}>
              <Text style={styles.logWeight}>{item.weight} {item.unit}</Text>
              <Text style={styles.logDate}>{item.date}</Text>
            </PremiumCard>
          )}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  summaryCard: { padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg },
  summaryValue: { ...typography.kpi, color: colors.textPrimary, fontSize: 36 },
  summaryLabel: { color: colors.textSecondary, marginTop: spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  goalInput: { marginTop: spacing.sm, minWidth: 100 },
  addCard: { padding: spacing.md, marginBottom: spacing.lg },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  weightInput: { flex: 1 },
  loadingText: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },
  historyTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  list: { marginBottom: spacing.md },
  logCard: { padding: spacing.md, marginBottom: spacing.sm },
  logWeight: { color: colors.textPrimary, fontSize: 18, fontWeight: '600' },
  logDate: { color: colors.textSecondary, fontSize: 12 },
});