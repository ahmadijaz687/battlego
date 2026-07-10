import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useBattleStore } from '../store/battleStore';

type Props = NativeStackScreenProps<RootStackParamList, 'BattleSession'>;

export default function BattleSessionScreen({ navigation }: Props) {
  const [timeLeft, setTimeLeft] = useState(1800);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(420);
  const [isActive, setIsActive] = useState(true);
  const { battles, isLoading, fetchBattles, updateBattleScore } = useBattleStore();

  useEffect(() => {
    fetchBattles();
  }, []);

  const battle = battles?.[0];

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleLogSet = (points?: number) => {
    const score = points || Math.floor(Math.random() * 50) + 30;
    setMyScore((s) => s + score);
    if (battle) {
      updateBattleScore(battle.id, myScore + score);
    }
  };

  const handleEndBattle = () => {
    setIsActive(false);
    navigation.replace('WorkoutSummary', { workoutId: battle?.id || 'battle' });
  };

  const myPercent = myScore + opponentScore > 0 ? (myScore / (myScore + opponentScore)) * 100 : 50;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.timerSection}>
          <Ionicons name="time-outline" size={24} color={colors.primary} />
          <Text style={styles.timer}>{minutes}:{seconds.toString().padStart(2, '0')}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreCol}>
            <Text style={styles.scoreLabel}>You</Text>
            <Text style={styles.scoreValue}>{myScore}</Text>
          </View>
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.scoreCol}>
            <Text style={styles.scoreLabel}>{(battle as any)?.opponent?.name || 'Opponent'}</Text>
            <Text style={[styles.scoreValue, { color: colors.accent }]}>{opponentScore}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${myPercent}%` }]} />
          </View>
          <Text style={styles.percentText}>
            {myPercent.toFixed(0)}% - {(100 - myPercent).toFixed(0)}%
          </Text>
        </View>

        <Card variant="surface" style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Quick Log</Text>
          <View style={styles.actionGrid}>
            <Button title="+ Light Set" size="sm" variant="outline" style={styles.actionBtn} onPress={() => handleLogSet(30)} />
            <Button title="+ Medium Set" size="sm" variant="outline" style={styles.actionBtn} onPress={() => handleLogSet(50)} />
            <Button title="+ Heavy Set" size="sm" variant="outline" style={styles.actionBtn} onPress={() => handleLogSet(80)} />
            <Button title="+ Cardio" size="sm" variant="outline" style={styles.actionBtn} onPress={() => handleLogSet(40)} />
          </View>
        </Card>

        <Button title="End Battle" variant="outline" style={styles.endButton} onPress={handleEndBattle} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  timerSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  timer: { ...typography.h1, color: colors.primary, fontSize: 36 },
  scoreContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  scoreCol: { alignItems: 'center', flex: 1 },
  scoreLabel: { ...typography.bodySmall, color: colors.textSecondary },
  scoreValue: { ...typography.h1, color: colors.primary, fontSize: 40, marginTop: 4 },
  vsText: { ...typography.h3, color: colors.textMuted, fontWeight: '800', marginHorizontal: spacing.md },
  progressContainer: { marginBottom: spacing.xl },
  progressBar: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: spacing.sm },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  percentText: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  actionsCard: { padding: spacing.md, marginBottom: spacing.xl },
  actionsTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actionBtn: { flex: 1, minWidth: '45%' },
  endButton: { borderColor: colors.error },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
