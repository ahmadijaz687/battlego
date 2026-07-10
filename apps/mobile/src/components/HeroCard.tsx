import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { colors, spacing, typography, borderRadius, motion } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

interface HeroCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: string;
  style?: ViewStyle;
  glow?: boolean;
}

export function HeroCard({ title, subtitle, value, icon, style, glow = false }: HeroCardProps) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const glowOpacity = React.useRef(new Animated.Value(glow ? 1 : 0)).current;

  React.useEffect(() => {
    if (glow) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, { toValue: 0.6, duration: motion.duration.slower, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 1, duration: motion.duration.slower, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [glow]);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {glow && (
          <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
        )}
      </LinearGradient>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {value && <Text style={styles.value}>{value}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    minHeight: 120,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: borderRadius.xl,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primarySoft,
    borderRadius: borderRadius.xl,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  value: { ...typography.kpi, color: colors.textPrimary, marginTop: spacing.sm },
});