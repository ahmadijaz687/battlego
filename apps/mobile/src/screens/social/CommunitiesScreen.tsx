import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { Badge } from '../../components/Badge';
import { SearchBar } from '../../components/SearchBar';
import { EmptyState } from '../../components/EmptyState';
import { useSocialStore } from '../../store/socialStore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Communities'>;

export default function CommunitiesScreen({ navigation }: Props) {
  const { communities, fetchCommunities, isLoading } = useSocialStore();

  useEffect(() => { fetchCommunities(); }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Communities</Text>
        <Pressable accessibilityLabel="Create community">
          <Ionicons name="add" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <SearchBar placeholder="Search communities..." style={styles.search} />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={communities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PremiumCard variant="glass" pressable onPress={() => navigation.navigate('CommunityDetails', { communityId: item.id })} style={styles.communityCard}>
              <View style={styles.communityIcon}>
                <Ionicons name="people" size={24} color={colors.primary} />
              </View>
              <View style={styles.communityInfo}>
                <Text style={styles.communityName}>{item.name}</Text>
                <Text style={styles.communityDesc} numberOfLines={2}>{item.description}</Text>
                <Badge label={`${item.memberCount} members`} variant="default" size="sm" />
              </View>
            </PremiumCard>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState icon="🌍" title="No communities yet" description="Create or join a community" />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary },
  search: { marginBottom: spacing.md },
  list: { paddingBottom: spacing.md },
  communityCard: { flexDirection: 'row', padding: spacing.md, marginBottom: spacing.sm },
  communityIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surfaceGlass, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  communityInfo: { flex: 1 },
  communityName: { color: colors.textPrimary, fontWeight: '600', fontSize: 16 },
  communityDesc: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },
});