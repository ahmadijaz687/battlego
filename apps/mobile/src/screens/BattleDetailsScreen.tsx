import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';
import { Toast } from '../components/Toast';
import Avatar from '../components/Avatar';
import { useBattleStore } from '../store/battleStore';

type Props = NativeStackScreenProps<RootStackParamList, 'BattleDetails'>;

export default function BattleDetailsScreen({ route, navigation }: Props) {
  const battleId = route.params?.battleId ?? '';
  const { currentBattle, isLoading, fetchBattleDetails, error } = useBattleStore();
  const battle = currentBattle as any;
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

  useEffect(() => {
    fetchBattleDetails(battleId);
  }, [battleId]);

  const standings = battle?.standings ?? [];
  const maxProgress = useMemo(
    () => standings.reduce((max, s) => Math.max(max, s.progressValue || 0), 0),
    [standings]
  );

  const daysLeft = useMemo(() => {
    if (!battle?.endDate) return null;
    const ms = new Date(battle.endDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / 864e5));
  }, [battle?.endDate]);

  const statusVariant = battle?.status === 'active' ? 'success' : battle?.status === 'completed' ? 'primary' : 'warning';

  const handleInvite = useCallback(() => {
    const code = battle?.inviteCode || battleId;
    setToast({ visible: true, message: `Invite code copied: ${code}` });
  }, [battle?.inviteCode, battleId]);

  const rankColor = (rank: number) =>
    rank === 1 ? colors.accentYellow : rank === 2 ? colors.textSecondary : rank === 3 ? colors.accentOrange : colors.textMuted;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back" hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.topBarTitle}>Battle</Text>
          <View style={{ width: 22 }} />
        </View>
        <View style={styles.scroll}>
          <Skeleton height={200} borderRadius={borderRadius.card} />
          <Skeleton height={80} borderRadius={borderRadius.card} style={styles.skelRow} />
          <Skeleton height={80} borderRadius={borderRadius.card} style={styles.skelRow} />
          <Skeleton height={80} borderRadius={borderRadius.card} style={styles.skelRow} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !battle) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back" hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.topBarTitle}>Battle</Text>
          <View style={{ width: 22 }} />
        </View>
        <EmptyState
          icon="⚠️"
          title="Failed to load battle"
          description="We couldn't fetch the latest standings."
          action={{ label: 'Retry', onPress: () => fetchBattleDetails(battleId) }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back" hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.topBarTitle} numberOfLines={1}>Battle</Text>
        <Pressable onPress={handleInvite} accessibilityRole="button" accessibilityLabel="Invite friends" hitSlop={8}>
          <Ionicons name="person-add-outline" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card variant="elevated" style={styles.hero}>
          <View style={styles.heroHeader}>
            <Ionicons name="flame" size={22} color={colors.primary} />
            {battle.status && <Badge label={battle.status} variant={statusVariant} />}
          </View>
          <Text style={styles.title}>{battle.title || 'Battle'}</Text>
          {battle.description && <Text style={styles.description}>{battle.description}</Text>}

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{daysLeft ?? '—'}</Text>
              <Text style={styles.metaLabel}>Days left</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{battle.participants.length}</Text>
              <Text style={styles.metaLabel}>Players</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{battle.standings.length}</Text>
              <Text style={styles.metaLabel}>Ranked</Text>
            </View>
          </View>

          {battle.goal && (
            <View style={styles.goalRow}>
              <Ionicons name="flag-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.goalText}>
                {battle.goal}:{' '}
                <Text style={styles.goalStrong}>
                  {battle.targetValue?.toLocaleString()}{battle.unit ? ` ${battle.unit}` : ''}
                </Text>
              </Text>
            </View>
          )}
        </Card>

        <SectionHeader title="Standings" subtitle="Live ranking by progress" />
        {standings.length === 0 ? (
          <EmptyState icon="🏁" title="No standings yet" description="Check back once participants start logging." />
        ) : (
          standings.map((p) => {
            const isYou = p.userId === battle.participants[0]?.user.id;
            const percent = maxProgress > 0 ? Math.round((p.progressValue / maxProgress) * 100) : 0;
            return (
              <Card key={p.userId} variant="surface" style={[styles.row, p.isWinner && styles.rowWinner]}>
                <View style={styles.rankWrap}>
                  <Text style={[styles.rank, { color: rankColor(p.rank) }]}>{p.rank}</Text>
                </View>
                <Avatar size="md" name={p.name} uri={undefined} />
                <View style={styles.rowBody}>
                  <View style={styles.rowTop}>
                    <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.score}>{p.progressValue.toLocaleString()}{battle.unit ? ` ${battle.unit}` : ''}</Text>
                  </View>
                  <ProgressBar
                    progress={percent}
                    height={6}
                    color={p.isWinner ? colors.accentYellow : colors.primary}
                    backgroundColor={colors.surfaceTertiary}
                    style={styles.rowProgress}
                  />
                  <Text style={styles.rowMeta}>
                    {percent}% of leader{p.isWinner ? ' · Winner 🏆' : ''}
                  </Text>
                </View>
              </Card>
            );
          })
        )}

        <View style={styles.actions}>
          <Button title="Invite Friends" variant="primary" fullWidth onPress={handleInvite} />
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        variant="success"
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  topBarTitle: { ...typography.h4, color: colors.textPrimary, flex: 1, textAlign: 'center', marginHorizontal: spacing.sm },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  skelRow: { marginTop: spacing.sm },
  hero: { padding: spacing.lg },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  title: { ...typography.h2, color: colors.textPrimary },
  description: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.md,
  },
  metaItem: { flex: 1, alignItems: 'center' },
  metaDivider: { width: 1, height: 28, backgroundColor: colors.border },
  metaValue: { ...typography.h4, color: colors.textPrimary },
  metaLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  goalText: { ...typography.small, color: colors.textSecondary },
  goalStrong: { color: colors.textPrimary, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.smd, marginBottom: spacing.sm, gap: spacing.smd },
  rowWinner: { borderColor: colors.accentYellow },
  rankWrap: { width: 24, alignItems: 'center' },
  rank: { ...typography.h4, fontWeight: '800' },
  rowBody: { flex: 1 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600', flex: 1, marginRight: spacing.sm },
  score: { ...typography.small, color: colors.textPrimary, fontWeight: '700' },
  rowProgress: { marginTop: spacing.sm },
  rowMeta: { ...typography.caption, color: colors.textMuted, marginTop: 6 },
  actions: { marginTop: spacing.lg, gap: spacing.sm },
});
