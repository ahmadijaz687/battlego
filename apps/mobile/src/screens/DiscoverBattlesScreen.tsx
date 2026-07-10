import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BattleStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { SearchBar } from '../components/SearchBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<BattleStackParamList, 'DiscoverBattles'>;

interface DiscoverBattle {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  participants: number;
  maxParticipants: number;
  startDate: string;
  joined: boolean;
}

const mockBattles: DiscoverBattle[] = [
  { id: '1', title: '30 Day Push-up Challenge', category: 'Strength', difficulty: 'Intermediate', participants: 12, maxParticipants: 20, startDate: '2024-08-01', joined: false },
  { id: '2', title: 'Summer 5K Run', category: 'Cardio', difficulty: 'Beginner', participants: 8, maxParticipants: 30, startDate: '2024-08-05', joined: true },
  { id: '3', title: 'Weight Loss Sprint', category: 'Weight Loss', difficulty: 'Intermediate', participants: 15, maxParticipants: 15, startDate: '2024-07-20', joined: false },
  { id: '4', title: 'Yoga Streak Challenge', category: 'Flexibility', difficulty: 'Beginner', participants: 5, maxParticipants: 25, startDate: '2024-08-10', joined: false },
  { id: '5', title: 'Plank Hold Battle', category: 'Core', difficulty: 'Advanced', participants: 3, maxParticipants: 10, startDate: '2024-07-25', joined: false },
];

const categories = ['All', 'Strength', 'Cardio', 'Weight Loss', 'Flexibility', 'Core'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function DiscoverBattlesScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [battles, setBattles] = useState(mockBattles);

  const filtered = battles.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'All' || b.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleJoin = (battleId: string) => {
    setBattles((prev) => prev.map((b) => (b.id === battleId ? { ...b, joined: !b.joined } : b)));
  };

  const renderBattle = ({ item }: { item: DiscoverBattle }) => (
    <Pressable onPress={() => navigation.navigate('BattleDetails', { battleId: item.id })}>
      <Card style={styles.battleCard}>
        <View style={styles.battleHeader}>
          <Text style={styles.battleTitle}>{item.title}</Text>
          <Chip label={item.difficulty} />
        </View>
        <View style={styles.battleMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="fitness" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{item.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{item.participants}/{item.maxParticipants}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{item.startDate}</Text>
          </View>
        </View>
        <Button
          title={item.joined ? 'Joined' : 'Join'}
          variant={item.joined ? 'primary' : 'outline'}
          style={styles.joinBtn}
          onPress={() => handleJoin(item.id)}
        />
      </Card>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Battles</Text>
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search battles..." containerStyle={styles.searchBar} />

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Category</Text>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.filterChip, categoryFilter === item && styles.filterChipActive]}
              onPress={() => setCategoryFilter(item)}
            >
              <Text style={[styles.filterChipText, categoryFilter === item && styles.filterChipTextActive]}>{item}</Text>
            </Pressable>
          )}
        />
        <Text style={styles.filterLabel}>Difficulty</Text>
        <FlatList
          horizontal
          data={difficulties}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.filterChip, difficultyFilter === item && styles.filterChipActive]}
              onPress={() => setDifficultyFilter(item)}
            >
              <Text style={[styles.filterChipText, difficultyFilter === item && styles.filterChipTextActive]}>{item}</Text>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        renderItem={renderBattle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="⚔️" title="No battles found" description="Try different filters or check back later" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  searchBar: { marginHorizontal: spacing.md, marginBottom: spacing.sm },
  filterSection: { marginBottom: spacing.md },
  filterLabel: { ...typography.caption, color: colors.textSecondary, marginHorizontal: spacing.md, marginBottom: spacing.xs, textTransform: 'uppercase', fontWeight: '600' },
  filterRow: { paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.sm },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { ...typography.caption, color: colors.textSecondary },
  filterChipTextActive: { color: colors.textInverse },
  list: { paddingHorizontal: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },
  battleCard: { padding: spacing.md },
  battleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  battleTitle: { ...typography.h4, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  battleMeta: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { ...typography.caption, color: colors.textSecondary },
  joinBtn: { alignSelf: 'flex-start' },
});
