import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useBattleStore } from '../store/battleStore';
import type { Battle } from '../types/battle';

type Props = NativeStackScreenProps<RootStackParamList, 'Battle'>;

type Tab = 'active' | 'pending' | 'completed';

export default function BattleScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const { battles, isLoading, fetchBattles, error } = useBattleStore();

  useEffect(() => {
    fetchBattles();
  }, []);

  const filteredBattles = (battles || []).filter((b: Battle) => b.status === activeTab);

  const renderBattle = useCallback(({ item }: { item: Battle }) => {
    const b = item as any;
    const opponentName = b.opponent?.name || b.opponentId;
    const myScore = b.creatorScore;
    const opponentScore = b.opponentScore;

    return (
      <Pressable
        onPress={() => {
          if (item.status === 'pending') navigation.navigate('BattleLobby');
          else if (item.status === 'active') navigation.navigate('BattleSession');
          else navigation.navigate('BattleDetails', { battleId: item.id });
        }}
      >
        <Card variant="surface" style={styles.battleCard}>
          <View style={styles.battleHeader}>
            <View style={styles.battleInfo}>
              <Ionicons name="fitness" size={20} color={colors.primary} />
              <Text style={styles.battleType}>{b.type}</Text>
            </View>
            <Text style={styles.battleDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.battleBody}>
            <View style={styles.playerCol}>
              <Text style={styles.playerLabel}>You</Text>
              {myScore !== null && <Text style={styles.score}>{myScore}</Text>}
            </View>
            <View style={styles.vsCol}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            <View style={styles.playerCol}>
              <Text style={styles.playerLabel}>{opponentName}</Text>
              {opponentScore !== null && <Text style={styles.score}>{opponentScore}</Text>}
            </View>
          </View>
          {item.status === 'active' && myScore !== null && opponentScore !== null && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(myScore / (myScore + opponentScore)) * 100}%` }]} />
            </View>
          )}
        </Card>
      </Pressable>
    );
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Battles</Text>
        <Pressable onPress={() => navigation.navigate('Leaderboard')} accessibilityLabel="Leaderboard">
          <Ionicons name="trophy" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {(['active', 'pending', 'completed'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
            accessibilityRole="button"
            accessibilityLabel={tab}
            accessibilityState={{ selected: activeTab === tab }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <EmptyState icon="⚠️" title="Failed to load battles" description="Pull to refresh to try again" />
      ) : filteredBattles.length > 0 ? (
        <FlatList
          data={filteredBattles}
          renderItem={renderBattle}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onRefresh={fetchBattles}
          refreshing={isLoading}
        />
      ) : (
        <EmptyState icon="⚔️" title={`No ${activeTab} battles`} description="Challenge a friend to start a battle" />
      )}

      <Button
        title="Create Battle"
        variant="primary"
        fullWidth
        style={styles.fab}
        onPress={() => navigation.navigate('BattleCreate')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.md, gap: spacing.sm },
  tab: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md, alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  activeTab: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  activeTabText: { color: colors.textInverse },
  list: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: 100 },
  battleCard: { padding: spacing.md },
  battleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  battleInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  battleType: { ...typography.body, color: colors.textPrimary, fontWeight: '600', textTransform: 'capitalize' },
  battleDate: { ...typography.caption, color: colors.textMuted },
  battleBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  playerCol: { alignItems: 'center', flex: 1 },
  playerLabel: { ...typography.caption, color: colors.textSecondary },
  score: { ...typography.h2, color: colors.textPrimary, marginTop: 4 },
  vsCol: { alignItems: 'center', paddingHorizontal: spacing.lg },
  vsText: { ...typography.h3, color: colors.primary, fontWeight: '800' },
  progressBar: { height: 4, backgroundColor: colors.surfaceTertiary, borderRadius: 2, marginTop: spacing.md, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  fab: { position: 'absolute', bottom: 24, left: spacing.md, right: spacing.md },
});
