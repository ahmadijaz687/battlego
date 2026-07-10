import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { SearchBar } from '../../components/SearchBar';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { EmptyState } from '../../components/EmptyState';

interface AdminBattle {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  participants: number;
  maxParticipants: number;
  creator: string;
  createdAt: string;
}

const mockBattles: AdminBattle[] = [
  { id: '1', title: '30 Day Push-up Challenge', category: 'Strength', status: 'active', participants: 12, maxParticipants: 20, creator: 'John Doe', createdAt: '2024-07-01' },
  { id: '2', title: '5K Run Battle', category: 'Cardio', status: 'pending', participants: 5, maxParticipants: 10, creator: 'Jane Smith', createdAt: '2024-07-05' },
  { id: '3', title: 'Weight Loss Sprint', category: 'Weight Loss', status: 'active', participants: 8, maxParticipants: 15, creator: 'Mike Johnson', createdAt: '2024-07-10' },
  { id: '4', title: 'Yoga Streak', category: 'Flexibility', status: 'completed', participants: 15, maxParticipants: 15, creator: 'Sarah Wilson', createdAt: '2024-06-15' },
  { id: '5', title: 'Plank Off', category: 'Core', status: 'cancelled', participants: 3, maxParticipants: 30, creator: 'Alex Brown', createdAt: '2024-06-20' },
];

const statusFilters = ['All', 'active', 'pending', 'completed', 'cancelled'] as const;

export default function AdminBattlesScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');

  const filtered = mockBattles.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusColor = (s: string) => {
    switch (s) {
      case 'active': return colors.success;
      case 'pending': return colors.accentOrange;
      case 'completed': return colors.info;
      case 'cancelled': return colors.error;
      default: return colors.textMuted;
    }
  };

  const renderBattle = ({ item }: { item: AdminBattle }) => (
    <Card style={styles.battleCard}>
      <View style={styles.battleHeader}>
        <Text style={styles.battleTitle}>{item.title}</Text>
        <Chip label={item.status} />
      </View>
      <Text style={styles.battleMeta}>{item.category} · {item.participants}/{item.maxParticipants} participants</Text>
      <Text style={styles.battleCreator}>Created by {item.creator} · {item.createdAt}</Text>
      <View style={styles.actions}>
        {item.status !== 'completed' && item.status !== 'cancelled' && (
          <>
            <Button
              title={item.status === 'active' ? 'Force Complete' : 'Cancel'}
              variant="outline"
              style={styles.actionBtn}
              onPress={() => {}}
            />
            {item.status === 'pending' && (
              <Button title="Cancel" variant="outline" style={[styles.actionBtn, { borderColor: colors.error }]} onPress={() => {}} />
            )}
          </>
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Battles</Text>
        <Text style={styles.subtitle}>{mockBattles.length} total</Text>
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search battles..." containerStyle={styles.searchBar} />

      <View style={styles.filterRow}>
        {statusFilters.map((s) => (
          <Button
            key={s}
            title={s.charAt(0).toUpperCase() + s.slice(1)}
            variant={filter === s ? 'primary' : 'ghost'}
            style={styles.filterChip}
            onPress={() => setFilter(s)}
          />
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderBattle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="⚔️" title="No battles found" description="Try adjusting your search or filters" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary },
  searchBar: { marginHorizontal: spacing.md, marginBottom: spacing.sm },
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: spacing.sm, paddingVertical: 0 },
  list: { paddingHorizontal: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },
  battleCard: { padding: spacing.md },
  battleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  battleTitle: { ...typography.h4, color: colors.textPrimary, flex: 1 },
  battleMeta: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.xs },
  battleCreator: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { flex: 1 },
});
