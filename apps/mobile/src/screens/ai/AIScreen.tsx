import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Ionicons } from '@expo/vector-icons';
import { useAIStore } from '../../store/aiStore';

type Props = NativeStackScreenProps<RootStackParamList, 'AI'>;

const quickActions = [
  { id: '1', label: 'Workout', icon: 'fitness-outline' as const, screen: 'AIWorkoutGenerator' },
  { id: '2', label: 'Nutrition', icon: 'restaurant-outline' as const, screen: 'AINutritionPlanner' },
  { id: '3', label: 'Chat', icon: 'chatbubble-outline' as const, screen: 'AIChat' },
];

export default function AIScreen({ navigation }: Props) {
  const { conversations, activePersonality, fetchPersonalities } = useAIStore();
  const recentConvos = conversations.slice(0, 3);

  useEffect(() => {
    fetchPersonalities();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Coach</Text>
        <View style={styles.headerRight}>
          {activePersonality && (
            <Badge label={activePersonality.name.split(' ').slice(0, 1).join(' ')} variant="primary" size="sm" />
          )}
          <Pressable onPress={() => navigation.navigate('AISettings')} accessibilityLabel="Settings">
            <Ionicons name="settings-outline" size={22} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <FlatList
        horizontal
        data={quickActions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate(item.screen as any)} style={styles.chip}>
            <Ionicons name={item.icon} size={18} color={colors.textPrimary} />
            <Text style={styles.chipLabel}>{item.label}</Text>
          </Pressable>
        )}
        style={styles.chipsRow}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContent}
      />

      <Text style={styles.recentTitle}>Recent Conversations</Text>
      <FlatList
        data={recentConvos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PremiumCard variant="glass" pressable onPress={() => navigation.navigate('AIChat')} style={styles.convoCard}>
            <Text style={styles.convoTitle}>{item.title}</Text>
          </PremiumCard>
        )}
        contentContainerStyle={styles.convoList}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No conversations yet</Text>
        )}
      />

      <Button title="New Chat" variant="primary" size="lg" onPress={() => navigation.navigate('AIChat')} style={styles.fab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md, paddingBottom: 80 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary },
  chipsRow: { marginBottom: spacing.lg },
  chipsContent: { paddingHorizontal: spacing.xs, gap: spacing.sm },
  recentTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  convoCard: { padding: spacing.md, marginBottom: spacing.sm },
  convoTitle: { color: colors.textPrimary, fontWeight: '600' },
  convoList: { paddingBottom: spacing.xl },
  emptyText: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
  fab: { position: 'absolute', bottom: spacing.xl, right: spacing.xl },
  chip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.surfaceGlass, borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm },
  chipLabel: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
});