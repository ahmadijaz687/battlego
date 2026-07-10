import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { useGamificationStore } from '../store/gamificationStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';

type Props = NativeStackScreenProps<RootStackParamList, 'BattlePass'>;

const tierColor: Record<string, string> = {
  bronze: colors.accentOrange,
  silver: colors.textSecondary,
  gold: colors.accentYellow,
  platinum: colors.secondary,
};

export default function BattlePassScreen({ navigation }: Props) {
  const { gamificationProfile: profile, badges, fetchGamificationProfile, fetchBadges, isLoading, error } = useGamificationStore();

  useEffect(() => { fetchGamificationProfile(); fetchBadges(); }, []);

  const earnedKeys = useMemo(
    () => new Set((profile?.badges ?? []).map((b) => b.badge.key)),
    [profile?.badges]
  );

  const xpProgress = useMemo(() => {
    if (!profile || !profile.nextLevelXp) return 0;
    return Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100));
  }, [profile]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Battle Pass</Text>
      </View>

      {isLoading ? (
        <View style={{ gap: spacing.md }}>
          <Skeleton height={160} borderRadius={borderRadius.card} />
          <Skeleton height={90} borderRadius={borderRadius.card} />
          <Skeleton height={90} borderRadius={borderRadius.card} />
        </View>
      ) : error || !profile ? (
        <EmptyState
          icon="⚠️"
          title="Failed to load Battle Pass"
          description="We couldn't load your level and badges."
          action={{ label: 'Retry', onPress: () => fetchGamificationProfile() }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Card variant="elevated" style={styles.levelCard}>
            <View style={styles.levelTop}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelNumber}>{profile.level}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.levelTitle}>Level {profile.level}</Text>
                <Text style={styles.levelSub}>Total XP {profile.totalXp.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>{profile.xp.toLocaleString()} XP</Text>
              <Text style={styles.xpLabel}>{profile.nextLevelXp.toLocaleString()} XP</Text>
            </View>
            <ProgressBar progress={xpProgress} height={12} color={colors.primary} backgroundColor={colors.surfaceTertiary} />
            <Text style={styles.xpHint}>{xpProgress}% to level {profile.level + 1}</Text>
          </Card>

          <Card variant="surface" style={styles.streakCard}>
            <View style={styles.streakRow}>
              <View style={styles.flameWrap}>
                <Ionicons name="flame" size={28} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.streakValue}>{profile.streakDays} day{profile.streakDays === 1 ? '' : 's'}</Text>
                <Text style={styles.streakLabel}>Current streak — keep it burning 🔥</Text>
              </View>
            </View>
          </Card>

          <SectionHeader title="Badges" subtitle={`${earnedKeys.size} of ${badges?.length ?? 0} unlocked`} />
          {!badges || badges.length === 0 ? (
            <EmptyState icon="🏅" title="No badges available" description="Badges will appear once they're released." />
          ) : (
            <View style={styles.badgeGrid}>
              {badges.map((badge) => {
                const earned = earnedKeys.has(badge.key);
                const accent = tierColor[badge.tier] ?? colors.primary;
                return (
                  <Card key={badge.key} variant="surface" style={[styles.badgeItem, earned && { borderColor: accent }]}>
                    <View style={[styles.badgeIconWrap, { backgroundColor: earned ? accent + '22' : colors.surfaceTertiary }]}>
                      <Text style={[styles.badgeIcon, !earned && styles.badgeIconLocked]}>{badge.icon || '🏅'}</Text>
                    </View>
                    <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]} numberOfLines={2}>{badge.name}</Text>
                    <View style={[styles.badgeTier, { backgroundColor: accent + '22' }]}>
                      <Text style={[styles.badgeTierText, { color: earned ? accent : colors.textMuted }]}>{badge.tier}</Text>
                    </View>
                  </Card>
                );
              })}
            </View>
          )}

          <View style={{ height: spacing.xl }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  content: { paddingBottom: spacing.xl },
  levelCard: { padding: spacing.lg, marginBottom: spacing.md },
  levelTop: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  levelBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  levelNumber: { ...typography.h2, color: colors.primary, fontWeight: '800' },
  levelTitle: { ...typography.h3, color: colors.textPrimary },
  levelSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  xpLabel: { ...typography.caption, color: colors.textSecondary },
  xpHint: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
  streakCard: { padding: spacing.md, marginBottom: spacing.md },
  streakRow: { flexDirection: 'row', alignItems: 'center' },
  flameWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  streakValue: { ...typography.h3, color: colors.textPrimary },
  streakLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badgeItem: { width: '31%', alignItems: 'center', padding: spacing.smd, gap: spacing.xs },
  badgeIconWrap: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  badgeIcon: { fontSize: 26 },
  badgeIconLocked: { opacity: 0.4 },
  badgeName: { ...typography.caption, color: colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  badgeNameLocked: { color: colors.textMuted },
  badgeTier: { paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: 4 },
  badgeTierText: { ...typography.tiny, fontWeight: '700', textTransform: 'uppercase' },
});
