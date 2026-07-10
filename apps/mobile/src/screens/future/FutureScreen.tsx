import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';

const FUTURE_FEATURES = [
  {
    icon: 'watch-outline' as const,
    title: 'Wearable Integration',
    description: 'Connect your Apple Watch, Garmin, Fitbit, or other wearables for real-time activity tracking and health data sync.',
  },
  {
    icon: 'analytics-outline' as const,
    title: 'Advanced Analytics',
    description: 'Deep-dive into your performance with AI-powered trend analysis, recovery insights, and personalized recommendations.',
  },
  {
    icon: 'people-outline' as const,
    title: 'Group Challenges',
    description: 'Create and join community challenges with custom rules, team-based competitions, and shared goals.',
  },
  {
    icon: 'restaurant-outline' as const,
    title: 'AI Meal Planning',
    description: 'Let AI generate personalized meal plans based on your macros, preferences, allergies, and dietary restrictions.',
  },
  {
    icon: 'fitness-outline' as const,
    title: 'Form Analysis',
    description: 'Use your camera to get real-time exercise form feedback and injury prevention tips powered by computer vision.',
  },
  {
    icon: 'game-controller-outline' as const,
    title: 'Gamification 2.0',
    description: 'Enhanced RPG-style progression with character customization, skill trees, and seasonal battle passes.',
  },
];

export default function FutureScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>Exciting features on the horizon</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {FUTURE_FEATURES.map((feature, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name={feature.icon} size={28} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardDescription}>{feature.description}</Text>
            </View>
            <View style={styles.comingBadge}>
              <Text style={styles.comingBadgeText}>Soon</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { fontSize: typography.h1?.fontSize || 28, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  list: { padding: spacing.lg, gap: spacing.md },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md },
  cardIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  cardDescription: { fontSize: 13, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  comingBadge: { backgroundColor: colors.warning + '20', borderRadius: borderRadius.full, paddingVertical: 2, paddingHorizontal: spacing.sm, marginLeft: spacing.sm },
  comingBadgeText: { fontSize: 11, color: colors.warning, fontWeight: '600' },
});
