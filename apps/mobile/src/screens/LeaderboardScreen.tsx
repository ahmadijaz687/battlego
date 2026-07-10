import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { PremiumCard } from '../components/PremiumCard';
import { Ionicons } from '@expo/vector-icons';
import { useGamificationStore } from '../store/gamificationStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Leaderboard'>;

const getRankIcon = (rank: number): string => {
  if (rank === 1) return 'trophy';
  if (rank === 2) return 'medal';
  if (rank === 3) return 'medal';
  return 'ellipse';
};

const getRankColor = (rank: number): string => {
  if (rank === 1) return colors.medalGold;
  if (rank === 2) return colors.medalSilver;
  if (rank === 3) return colors.medalBronze;
  return colors.textMuted;
};

export default function LeaderboardScreen({ navigation }: Props) {
  const { leaderboard: entries, fetchLeaderboard, isLoading } = useGamificationStore();

  useEffect(() => { fetchLeaderboard(); }, []);

  const getPodiumUser = (rank: number) => {
    if (!entries || entries.length < rank) return null;
    return entries[rank - 1];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.podium}>
            {[1, 2, 3].map((rank) => {
              const user = getPodiumUser(rank);
              if (!user) return null;
              return (
                <View key={rank} style={[styles.podiumItem, rank === 1 && styles.podiumFirst]}>
                  <Ionicons name={getRankIcon(rank) as any} size={rank === 1 ? 32 : 24} color={getRankColor(rank)} />
                  <Text style={styles.podiumName}>{user.user.name.split(' ')[0]}</Text>
                  <Text style={[styles.podiumXp, rank === 1 && { fontSize: 18 }]}>{user.totalXp.toLocaleString()}</Text>
                </View>
              );
            })}
          </View>

          <FlatList
            data={entries ? entries.slice(3) : []}
            renderItem={({ item, index }: { item: { totalXp: number; level: number; user: { id: string; name: string; avatar: string | null } }; index: number }) => {
              const rank = index + 4;
              return (
                <PremiumCard variant="glass" style={styles.entryCard}>
                  <View style={styles.entryRow}>
                    <View style={styles.rankCol}>
                      <Ionicons name={getRankIcon(rank) as any} size={22} color={getRankColor(rank)} />
                      <Text style={[styles.rankText, rank <= 3 && { color: getRankColor(rank) }]}>
                        #{rank}
                      </Text>
                    </View>
                    <View style={styles.infoCol}>
                      <Text style={styles.entryName}>{item.user.name}</Text>
                      <Text style={styles.entryLevel}>Level {item.level}</Text>
                    </View>
                    <View style={styles.xpCol}>
                      <Text style={styles.xpValue}>{item.totalXp.toLocaleString()}</Text>
                      <Text style={styles.xpLabel}>XP</Text>
                    </View>
                  </View>
                </PremiumCard>
              );
            }}
            keyExtractor={(item) => item.user.id}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: spacing.md, marginBottom: spacing.xl, gap: spacing.md },
  podiumItem: { alignItems: 'center', padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, minWidth: 90 },
  podiumFirst: { minWidth: 110, paddingVertical: spacing.lg },
  podiumName: { ...typography.body, color: colors.textPrimary, fontWeight: '700', marginTop: spacing.sm },
  podiumXp: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  list: { paddingHorizontal: spacing.md, gap: spacing.sm },
  entryCard: { padding: spacing.md },
  currentUserCard: { borderColor: colors.primary, borderWidth: 1 },
  entryRow: { flexDirection: 'row', alignItems: 'center' },
  rankCol: { alignItems: 'center', width: 60 },
  rankText: { ...typography.body, color: colors.textMuted, fontWeight: '700', marginTop: 2 },
  infoCol: { flex: 1, marginLeft: spacing.md },
  entryName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  entryLevel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  xpCol: { alignItems: 'flex-end' },
  xpValue: { ...typography.body, color: colors.primary, fontWeight: '700' },
  xpLabel: { ...typography.caption, color: colors.textSecondary },
});
