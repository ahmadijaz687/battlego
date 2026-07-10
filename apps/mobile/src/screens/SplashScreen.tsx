import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../theme';
import { useAuthStore } from '../store/authStore';
import { getItem, storageKeys } from '../utils/storage';
import { getAccessToken } from '../services/apiClient';

export default function SplashScreen() {
  const { login } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      const user = getItem<{ id: string; email: string; name: string }>(storageKeys.auth.user);
      const token = getAccessToken();
      if (user && token) {
        login(user);
      }
    };
    init();
  }, [login]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(232, 38, 46, 0.18)', 'transparent', 'transparent']}
        style={styles.gradient}
        locations={[0, 0.5, 1]}
      />
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <View style={styles.logoTile}>
            <Text style={styles.logoText}>FB</Text>
          </View>
        </View>
        <Text style={styles.title}>FITNESS BATTLE</Text>
        <Text style={styles.subtitle}>v2.0</Text>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  gradient: {
    position: 'absolute',
    top: -200,
    left: -100,
    right: -100,
    height: 500,
  },
  content: {
    alignItems: 'center',
  },
  logoWrap: {
    marginBottom: spacing.xl,
  },
  logoTile: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  loader: {
    marginTop: spacing.xl,
  },
});
