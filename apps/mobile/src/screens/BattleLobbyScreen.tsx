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

type Props = NativeStackScreenProps<RootStackParamList, 'BattleLobby'>;

export default function BattleLobbyScreen({ navigation }: Props) {
  const [countdown, setCountdown] = useState(30);
  const [isReady, setIsReady] = useState(false);
  const { battles, isLoading, fetchBattles, acceptBattle, error } = useBattleStore();

  useEffect(() => {
    fetchBattles();
  }, []);

  const battle = battles?.[0];

  useEffect(() => {
    if (countdown <= 0) {
      navigation.replace('BattleSession');
      return;
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, navigation]);

  const handleJoin = () => {
    if (battle) {
      acceptBattle(battle.id);
    }
    setIsReady(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load battle data</Text>
          <Button title="Go Back" variant="outline" onPress={() => navigation.goBack()} style={styles.cancelButton} />
        </View>
      </SafeAreaView>
    );
  }

  if (!battle) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>No active battles found</Text>
          <Button title="Go Back" variant="outline" onPress={() => navigation.goBack()} style={styles.cancelButton} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.vsContainer}>
          <View style={styles.playerCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={colors.primary} />
            </View>
            <Text style={styles.playerName}>You</Text>
            <Text style={styles.playerStat}>Level 12</Text>
          </View>
          <View style={styles.vsCircle}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <View style={styles.playerCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={colors.accent} />
            </View>
            <Text style={styles.playerName}>{(battle as any)?.opponent?.name || 'Opponent'}</Text>
            <Text style={styles.playerStat}>Level 10</Text>
          </View>
        </View>

        <Card variant="surface" style={styles.infoCard}>
          <Text style={styles.infoTitle}>Battle: {(battle as any).type || battle.goal}</Text>
          <Text style={styles.infoDesc}>
            Complete the most workout volume (sets x reps x weight) to win. You have 30 minutes.
          </Text>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.detailText}>30:00</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="barbell-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.detailText}>Any exercise counts</Text>
          </View>
        </Card>

        <View style={styles.countdownSection}>
          <Text style={styles.countdownLabel}>Battle starts in</Text>
          <Text style={styles.countdownTimer}>{countdown}s</Text>
        </View>

        <Button
          title={isReady ? 'Ready!' : 'Mark Ready'}
          variant={isReady ? 'primary' : 'outline'}
          onPress={handleJoin}
          style={styles.readyButton}
        />

        {isReady && (
        <Button
          title="Start Battle Now"
          variant="outline"
          style={styles.startButton}
          onPress={() => navigation.replace('BattleSession')}
        />
        )}

        <Button
          title="Cancel"
          variant="ghost"
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, alignItems: 'center' },
  vsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: spacing.xl },
  playerCard: { alignItems: 'center', flex: 1 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  playerName: { ...typography.h3, color: colors.textPrimary },
  playerStat: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  vsCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginHorizontal: spacing.md },
  vsText: { ...typography.h2, color: colors.textInverse, fontWeight: '800' },
  infoCard: { width: '100%', padding: spacing.md, marginBottom: spacing.xl },
  infoTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
  infoDesc: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  detailText: { ...typography.body, color: colors.textSecondary },
  countdownSection: { alignItems: 'center', marginBottom: spacing.xl },
  countdownLabel: { ...typography.body, color: colors.textSecondary },
  countdownTimer: { ...typography.h1, color: colors.primary, fontSize: 48, marginTop: spacing.sm },
  readyButton: { width: '100%', marginBottom: spacing.sm },
  startButton: { width: '100%', marginBottom: spacing.sm },
  cancelButton: { width: '100%' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.md },
  errorText: { ...typography.h3, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md },
});
