import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../theme';
import { useAuthStore } from '../store/authStore';
import { useGamificationStore } from '../store/gamificationStore';
import { Button } from '../components/Button';
import Avatar from '../components/Avatar';
import { Card } from '../components/Card';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Toast } from '../components/Toast';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const MENU_ITEMS = [
  { key: 'battlepass', label: 'Battle Pass', icon: 'ribbon-outline' as const },
  { key: 'healthsync', label: 'Health Sync', icon: 'fitness-outline' as const },
  { key: 'settings', label: 'Settings', icon: 'settings-outline' as const },
  { key: 'badges', label: 'Badges', icon: 'trophy-outline' as const },
  { key: 'statistics', label: 'Statistics', icon: 'stats-chart-outline' as const },
  { key: 'profile', label: 'Edit Profile', icon: 'person-outline' as const },
];

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout: logoutStore } = useAuthStore();
  const { level, gamificationProfile: battlePass, fetchLevel, fetchGamificationProfile, isLoading, error: levelError } = useGamificationStore();

  useEffect(() => { fetchLevel(); fetchGamificationProfile(); }, []);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; variant: 'success' | 'error' }>({
    visible: false,
    message: '',
    variant: 'success',
  });
  const { enableNotifications } = usePushNotifications();

  const handleEnableNotifications = async () => {
    const granted = await enableNotifications();
    setToast({
      visible: true,
      message: granted ? 'Notifications enabled!' : 'Could not enable notifications',
      variant: granted ? 'success' : 'error',
    });
  };

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      const { logout } = await import('../services/authService');
      await logout();
      logoutStore();
    } catch {
      setLogoutError('Failed to logout. Please try again.');
    }
  };

  const handleMenuPress = (key: string) => {
    switch (key) {
      case 'battlepass': navigation.navigate('BattlePass'); break;
      case 'healthsync': navigation.navigate('HealthSync'); break;
      case 'settings': navigation.navigate('Settings'); break;
      case 'badges': navigation.navigate('Badges'); break;
      case 'statistics': navigation.navigate('Statistics'); break;
      case 'profile': navigation.navigate('EditProfile'); break;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={['rgba(232, 38, 46, 0.22)', 'transparent']}
          style={styles.headerGradient}
          locations={[0, 0.7]}
        >
          <View style={styles.header}>
            <Avatar name={user?.name || 'User'} size={88} />
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
            {level && (
              <View style={styles.levelPill}>
                <Text style={styles.levelPillText}>Level {level.level}</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {logoutError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{logoutError}</Text>
          </View>
        )}

        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Stats</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : levelError ? (
            <Text style={styles.errorText}>Failed to load stats</Text>
          ) : (
            <>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Level</Text>
                <Text style={styles.statValue}>{level?.level ?? 1}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>XP</Text>
                <Text style={styles.statValue}>{(level?.xp ?? 0).toLocaleString()}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Next Level</Text>
                <Text style={styles.statValue}>{(level as any)?.xpToNextLevel ?? 1000} XP</Text>
              </View>
            </>
          )}
        </Card>

        {!battlePass ? (
          <Card style={styles.statsCard}>
            <Text style={styles.errorText}>Failed to load battle pass</Text>
          </Card>
        ) : battlePass && (
          <Card style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Battle Pass</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Season</Text>
              <Text style={styles.statValue}>{(battlePass as any).seasonName}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Tier</Text>
              <Text style={styles.statValue}>{(battlePass as any).tier} / {(battlePass as any).totalTiers}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Progress</Text>
              <Text style={styles.statValue}>{(battlePass as any).currentTierProgress}%</Text>
            </View>
          </Card>
        )}

        <View style={styles.menuCard}>
          <Pressable
            style={[styles.menuItem, MENU_ITEMS.length > 0 && styles.menuItemBorder]}
            onPress={handleEnableNotifications}
            accessibilityRole="button"
            accessibilityLabel="Enable notifications"
          >
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} style={styles.menuIcon} />
            <Text style={styles.menuLabel}>Enable Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
          {MENU_ITEMS.map((item, idx) => (
            <Pressable
              key={item.key}
              style={[styles.menuItem, idx < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
              onPress={() => handleMenuPress(item.key)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <Ionicons name={item.icon} size={22} color={colors.textSecondary} style={styles.menuIcon} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Button
          title="Logout"
          variant="outline"
          fullWidth
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityLabel="Log out of your account"
        />
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        variant={toast.variant}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  headerGradient: {
    marginTop: -spacing.md,
    marginHorizontal: -spacing.md,
    paddingTop: spacing.xl,
    marginBottom: spacing.md,
  },
  header: { alignItems: 'center', paddingHorizontal: spacing.md },
  name: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.md },
  email: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  levelPill: {
    marginTop: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  levelPillText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  statsCard: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statLabel: { ...typography.body, color: colors.textSecondary },
  statValue: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: { marginRight: spacing.md },
  menuLabel: { flex: 1, color: colors.textPrimary, fontSize: 16, fontWeight: '500' },
  errorBanner: {
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: 14, textAlign: 'center' },
  logoutButton: { marginTop: spacing.sm, borderColor: colors.error },
});
