import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Animated,
  Easing,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, motion } from '../theme';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../hooks/useAuth';
import { useGamificationStore } from '../store/gamificationStore';
import { useHabitStore } from '../store/habitStore';
import { useHealthStore } from '../store/healthStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import { LevelCard } from '../components/dashboard/LevelCard';
import { StreakCard } from '../components/dashboard/StreakCard';
import { CaloriesCard } from '../components/dashboard/CaloriesCard';
import { StepsCard } from '../components/dashboard/StepsCard';
import { ActiveMinutesCard } from '../components/dashboard/ActiveMinutesCard';
import { WaterIntakeCard } from '../components/dashboard/WaterIntakeCard';
import { NutritionSummaryCard } from '../components/dashboard/NutritionSummaryCard';
import { UpcomingWorkoutCard } from '../components/dashboard/UpcomingWorkoutCard';
import { UpcomingBattleCard } from '../components/dashboard/UpcomingBattleCard';
import { LeaderboardPreview } from '../components/dashboard/LeaderboardPreview';
import { FriendActivityCard } from '../components/dashboard/FriendActivityCard';
import { AITipCard } from '../components/dashboard/AITipCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { Button } from '../components/Button';

import type { UserStats, NutritionSummary, UpcomingWorkout, UpcomingBattle, LeaderboardEntry, FriendActivity, AITip } from '../types/dashboard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const defaultStats: UserStats = {
  level: 1, xp: 0, xpToNextLevel: 1000, streak: 0,
  calories: { current: 0, goal: 2200, burned: 0 },
  steps: { current: 0, goal: 10000 },
  activeMinutes: { current: 0, goal: 60 },
  waterIntake: { current: 0, goal: 2500 },
};

const defaultNutrition: NutritionSummary = { calories: 0, protein: 0, carbs: 0, fat: 0 };

export default function HomeScreen({ navigation }: Props) {
  const { user, logout: logoutStore } = useAuthStore();
  const logoutMutation = useLogout();
  const [refreshing, setRefreshing] = useState(false);

  const { profile, isLoading: levelLoading, error: levelError, loadProfile } = useGamificationStore();
  const { habitStats, isLoading: habitLoading, error: habitError, fetchHabitStats } = useHabitStore();
  const { healthSummary, isLoading: healthLoading, error: healthError, fetchHealthSummary } = useHealthStore();

  useEffect(() => {
    loadProfile();
    fetchHabitStats();
    fetchHealthSummary(1);
  }, []);

  const sectionCount = 8;
  const opacities = useRef(Array.from({ length: sectionCount }, () => new Animated.Value(0))).current;
  const translateYs = useRef(Array.from({ length: sectionCount }, () => new Animated.Value(24))).current;

  useEffect(() => {
    for (let i = 0; i < sectionCount; i++) {
      Animated.sequence([
        Animated.delay(i * 60),
        Animated.parallel([
          Animated.timing(opacities[i], { toValue: 1, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(translateYs[i], { toValue: 0, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    logoutStore();
  }, [logoutMutation, logoutStore]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    loadProfile();
    fetchHabitStats();
    fetchHealthSummary(1);
    setRefreshing(false);
  }, [loadProfile, fetchHabitStats, fetchHealthSummary]);

  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'workout': navigation.navigate('WorkoutHome'); break;
      case 'battle': navigation.navigate('Social'); break;
      case 'food': navigation.navigate('NutritionDashboard'); break;
      case 'water': navigation.navigate('WaterLog'); break;
    }
  }, [navigation]);

  const stats: UserStats = profile ? {
    level: profile.level,
    xp: profile.xp,
    xpToNextLevel: profile.nextLevelXp,
    streak: habitStats?.bestStreak ?? 0,
    calories: { current: (healthSummary as any)?.nutrition?.calories ?? 0, goal: 2200, burned: (healthSummary as any)?.workout?.caloriesBurned ?? 0 },
    steps: { current: 0, goal: 10000 },
    activeMinutes: (healthSummary as any)?.workout?.activeMinutes ?? 0,
    waterIntake: { current: (healthSummary as any)?.nutrition?.water ?? 0, goal: 2500 },
  } : defaultStats;

  const leaderboard: LeaderboardEntry[] = [];

  const Section = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <Animated.View
      style={{
        opacity: opacities[delay] ?? 1,
        transform: [{ translateY: translateYs[delay] ?? 0 }],
        marginBottom: spacing.md,
      }}
    >
      {children}
    </Animated.View>
  );

  if (levelLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const hasAnyError = levelError || habitError || healthError;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <Section delay={0}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hey, {user?.name || 'Champion'}!</Text>
              <Text style={styles.subGreeting}>Let's crush it today</Text>
            </View>
            <Pressable
              style={styles.iconButton}
              accessibilityLabel="Notifications"
              accessibilityRole="button"
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
              <View style={styles.badgeDot} />
            </Pressable>
          </View>
        </Section>

        {hasAnyError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>Some data couldn't load. Pull to refresh.</Text>
          </View>
        )}

        <Section delay={1}>
          <LevelCard stats={stats} />
          <StreakCard stats={stats} />
        </Section>

        <Section delay={2}>
          <View style={styles.kpiGrid}>
            <CaloriesCard current={stats.calories.current} goal={stats.calories.goal} burned={stats.calories.burned} />
            <StepsCard current={stats.steps.current} goal={stats.steps.goal} />
            <ActiveMinutesCard current={stats.activeMinutes.current} goal={stats.activeMinutes.goal} />
            <WaterIntakeCard current={stats.waterIntake.current} goal={stats.waterIntake.goal} />
          </View>
        </Section>

        <Section delay={3}>
          <QuickActions onActionPress={handleQuickAction} />
        </Section>

        <Section delay={4}>
          <NutritionSummaryCard nutrition={(healthSummary as any)?.nutrition ? { calories: (healthSummary as any).nutrition.calories ?? 0, protein: 0, carbs: 0, fat: 0 } : defaultNutrition} />
        </Section>

        <Section delay={5}>
          <UpcomingWorkoutCard workout={(healthSummary as any)?.workout?.lastWorkout ? { id: (healthSummary as any).workout.lastWorkout.id ?? '', name: (healthSummary as any).workout.lastWorkout.name ?? 'No upcoming workout', time: '', duration: 0, type: '' } : { id: '', name: 'No upcoming workout', time: '', duration: 0, type: '' }} />
          <UpcomingBattleCard battle={{ id: '', opponent: { name: 'Challenge a friend', id: '' }, workout: '', time: '', prize: '' }} />
        </Section>

        <Section delay={6}>
          {leaderboard.length > 0 && <LeaderboardPreview entries={leaderboard} />}
          <FriendActivityCard activities={[]} />
        </Section>

        <Section delay={7}>
          <AITipCard tip={{ id: '1', tip: 'Complete your first workout to get personalized AI coaching.', category: 'motivation' }} />
          <Button
            title="Logout"
            variant="outline"
            style={styles.logoutButton}
            onPress={handleLogout}
            accessibilityLabel="Log out of your account"
          />
        </Section>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: { ...typography.h2, color: colors.textPrimary },
  subGreeting: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  logoutButton: { marginTop: spacing.lg, borderColor: colors.error },
  errorBanner: {
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: 14, textAlign: 'center' },
});
