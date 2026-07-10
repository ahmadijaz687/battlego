import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useNutritionStore } from '../../store/nutritionStore';
import { ProgressRing } from '../../components/ProgressRing';
import { PremiumCard } from '../../components/PremiumCard';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'WaterLog'>;

const quickAmounts = [250, 500, 750, 1000];

export default function WaterLogScreen({ navigation }: Props) {
  const { waterLogs, fetchWaterLogs, createWaterLog } = useNutritionStore();
  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    fetchWaterLogs();
  }, []);

  const handleQuickAdd = (amount: number) => {
    createWaterLog(amount);
  };

  const handleCustomAdd = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      createWaterLog(amount);
      setCustomAmount('');
    }
  };

  const goal = 2500;
  const current = waterLogs?.reduce((sum, log) => sum + log.amount, 0) || 0;
  const progress = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Water Log</Text>
      </View>

      <PremiumCard variant="elevated" style={styles.waterCard}>
        <View style={styles.waterSection}>
          <ProgressRing progress={progress} size={140} strokeWidth={8} color={colors.accent}>
            <Text style={styles.waterPercent}>{progress}%</Text>
          </ProgressRing>
          <Text style={styles.waterLabel}>{current} / {goal} ml</Text>
        </View>
      </PremiumCard>

      <PremiumCard variant="glass" style={styles.quickSection}>
        <Text style={styles.sectionLabel}>Quick Add</Text>
        <View style={styles.quickGrid}>
          {quickAmounts.map((amount) => (
            <Chip
              key={amount}
              label={`${amount}ml`}
              onPress={() => handleQuickAdd(amount)}
            />
          ))}
        </View>
      </PremiumCard>

      <PremiumCard variant="glass" style={styles.customCard}>
        <Text style={styles.customLabel}>Custom Amount (ml)</Text>
        <View style={styles.customRow}>
          <TextInput
            style={styles.customInput}
            value={customAmount}
            onChangeText={setCustomAmount}
            keyboardType="numeric"
            placeholder="Enter amount..."
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Custom water amount"
          />
          <Button title="Add" variant="primary" size="sm" onPress={handleCustomAdd} />
        </View>
      </PremiumCard>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  waterCard: { padding: spacing.lg, alignItems: 'center', marginBottom: spacing.xl },
  waterSection: { alignItems: 'center' },
  waterPercent: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  waterLabel: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.sm },
  quickSection: { marginBottom: spacing.xl, padding: spacing.md },
  sectionLabel: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  customCard: { padding: spacing.md },
  customLabel: { color: colors.textSecondary, marginBottom: spacing.sm },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  customInput: {
    flex: 1,
    backgroundColor: colors.surfaceGlass,
    color: colors.textPrimary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    fontSize: 14,
  },
});