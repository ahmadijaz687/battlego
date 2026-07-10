import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { useGamificationStore } from '../store/gamificationStore';
import { PremiumCard } from '../components/PremiumCard';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Achievements'>;

export default function AchievementsScreen({ navigation }: Props) {
  const { achievements, userAchievements, fetchAchievements, fetchUserAchievements, isLoading, error } = useGamificationStore();

  useEffect(() => { fetchAchievements(); fetchUserAchievements(); }, []);

  const unlockedIds = new Set((userAchievements || []).map((ua) => ua.achievement_id));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Achievements</Text>
      </View>

      <Text style={styles.statsText}>
        {unlockedIds.size} / {achievements?.length || 0} unlocked
      </Text>

      {isLoading ? (
        <View style={{ gap: spacing.sm }}>
          <Skeleton height={60} borderRadius={12} />
          <Skeleton height={60} borderRadius={12} />
          <Skeleton height={60} borderRadius={12} />
          <Skeleton height={60} borderRadius={12} />
          <Skeleton height={60} borderRadius={12} />
        </View>
      ) : error ? (
        <EmptyState icon="⚠️" title="Failed to load achievements" />
      ) : !achievements || achievements.length === 0 ? (
        <EmptyState icon="🏆" title="No achievements available" />
      ) : (
        <FlatList
          data={achievements}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const unlocked = unlockedIds.has(item.id);
            return (
              <PremiumCard variant={unlocked ? 'elevated' : 'glass'} style={styles.achievementCard}>
                <View style={styles.cardRow}>
                  <View style={styles.iconCol}>
                    <Text style={styles.achievementIcon}>{unlocked ? item.achievement.icon : '🔒'}</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={[styles.achievementName, !unlocked && styles.textMuted]}>{item.achievement.name}</Text>
                    <Text style={styles.achievementDesc}>{item.achievement.description}</Text>
                    <Text style={styles.xpReward}>+{item.achievement.xp_reward} XP</Text>
                  </View>
                  {unlocked && <Ionicons name="checkmark-circle" size={24} color={colors.success} />}
                </View>
              </PremiumCard>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  statsText: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg, textAlign: 'center' },
  list: { paddingBottom: spacing.md },
  achievementCard: { padding: spacing.md, marginBottom: spacing.sm },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconCol: { width: 48, alignItems: 'center' },
  achievementIcon: { fontSize: 28 },
  infoCol: { flex: 1 },
  achievementName: { ...typography.h3, color: colors.textPrimary },
  textMuted: { opacity: 0.5 },
  achievementDesc: { color: colors.textSecondary, fontSize: 13, marginTop: spacing.xs },
  xpReward: { color: colors.primary, fontSize: 12, marginTop: spacing.xs, fontWeight: '600' },
});
