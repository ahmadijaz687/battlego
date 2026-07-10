import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Badges'>;

interface Badge {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
  description: string;
}

const badges: Badge[] = [
  { id: '1', name: 'First Workout', icon: '🏋️', rarity: 'common', unlocked: true, unlockedDate: '2024-01-15', description: 'Complete your first workout' },
  { id: '2', name: '7-Day Streak', icon: '🔥', rarity: 'common', unlocked: true, unlockedDate: '2024-02-10', description: 'Work out 7 days in a row' },
  { id: '3', name: '30-Day Streak', icon: '💪', rarity: 'rare', unlocked: true, unlockedDate: '2024-03-20', description: 'Work out 30 days in a row' },
  { id: '4', name: 'Battle Champion', icon: '🏆', rarity: 'rare', unlocked: true, unlockedDate: '2024-04-05', description: 'Win 10 battles' },
  { id: '5', name: '100 Workouts', icon: '🎯', rarity: 'epic', unlocked: false, description: 'Complete 100 workouts' },
  { id: '6', name: 'Legendary Streak', icon: '⭐', rarity: 'legendary', unlocked: false, description: 'Maintain a 365-day streak' },
  { id: '7', name: 'Social Butterfly', icon: '🦋', rarity: 'rare', unlocked: true, unlockedDate: '2024-05-12', description: 'Connect with 50 friends' },
  { id: '8', name: 'Nutrition Master', icon: '🥗', rarity: 'epic', unlocked: false, description: 'Hit nutrition goals for 30 days' },
  { id: '9', name: 'Early Adopter', icon: '🚀', rarity: 'legendary', unlocked: false, description: 'Joined in the first month' },
  { id: '10', name: 'Marathon Runner', icon: '🏃', rarity: 'epic', unlocked: false, description: 'Run a total of 100km' },
];

const rarityConfig = {
  common: { color: colors.textMuted, bgColor: colors.surfaceTertiary },
  rare: { color: colors.info, bgColor: colors.info + '20' },
  epic: { color: colors.accentPurple, bgColor: colors.accentPurple + '20' },
  legendary: { color: colors.accentOrange, bgColor: colors.accentOrange + '20' },
};

const recentlyUnlocked = badges.filter((b) => b.unlocked).slice(0, 3);

export default function BadgesScreen({ navigation }: Props) {
  const renderBadge = ({ item }: { item: Badge }) => {
    const rarity = rarityConfig[item.rarity];

    return (
      <Pressable style={[styles.badgeItem, !item.unlocked && styles.badgeLocked]}>
        <View style={[styles.badgeIconContainer, { backgroundColor: item.unlocked ? rarity.bgColor : colors.surfaceTertiary }]}>
          <Text style={[styles.badgeIcon, !item.unlocked && styles.badgeIconLocked]}>{item.icon}</Text>
        </View>
        <Text style={[styles.badgeName, !item.unlocked && styles.badgeNameLocked]}>{item.name}</Text>
        <View style={[styles.rarityBadge, { backgroundColor: rarity.bgColor }]}>
          <Text style={[styles.rarityText, { color: rarity.color }]}>{item.rarity}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Badges</Text>
        <Text style={styles.subtitle}>{badges.filter((b) => b.unlocked).length}/{badges.length} unlocked</Text>
      </View>

      <FlatList
        data={recentlyUnlocked}
        renderItem={({ item }) => (
          <Card style={styles.recentCard}>
            <View style={styles.recentRow}>
              <Text style={styles.recentIcon}>{item.icon}</Text>
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>{item.name}</Text>
                <Text style={styles.recentDate}>Earned {item.unlockedDate}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          recentlyUnlocked.length > 0 ? (
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Recently Earned</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View style={styles.allSection}>
            <Text style={styles.sectionTitle}>All Badges</Text>
            <View style={styles.badgeGrid}>
              {badges.map((badge) => (
                <View key={badge.id} style={styles.badgeWrapper}>
                  {renderBadge({ item: badge })}
                </View>
              ))}
            </View>
          </View>
        }
        contentContainerStyle={styles.content}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  recentSection: { marginBottom: spacing.sm },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
  recentCard: { padding: spacing.md, marginBottom: spacing.sm },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  recentIcon: { fontSize: 32 },
  recentInfo: { flex: 1 },
  recentName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  recentDate: { ...typography.caption, color: colors.textMuted },
  allSection: { marginTop: spacing.md },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badgeWrapper: { width: '30%' },
  badgeItem: { alignItems: 'center', padding: spacing.sm, backgroundColor: colors.surface, borderRadius: borderRadius.md, gap: spacing.xs },
  badgeLocked: { opacity: 0.5 },
  badgeIconContainer: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  badgeIcon: { fontSize: 24 },
  badgeIconLocked: { opacity: 0.4 },
  badgeName: { ...typography.caption, color: colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  badgeNameLocked: { color: colors.textMuted },
  rarityBadge: { paddingHorizontal: spacing.xs, paddingVertical: 1, borderRadius: 4 },
  rarityText: { ...typography.tiny, fontWeight: '600', textTransform: 'uppercase' },
});
