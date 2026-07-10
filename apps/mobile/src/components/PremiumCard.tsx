import React, { useRef, useEffect } from 'react';
import { StyleSheet, ViewStyle, Pressable, PressableProps, Animated, View } from 'react-native';
import { colors, spacing, borderRadius, motion } from '../theme';

interface PremiumCardProps extends PressableProps {
  style?: ViewStyle;
  variant?: 'glass' | 'elevated' | 'gradient';
  glow?: boolean;
  pressable?: boolean;
  children?: React.ReactNode;
}

export function PremiumCard({ style, variant = 'glass', glow = false, pressable = false, onPress, children, ...props }: PremiumCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(glow ? 1 : 0)).current;

  useEffect(() => {
    if (glow) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, { toValue: 0.6, duration: motion.duration.slower, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 1, duration: motion.duration.slower, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [glow]);

  const handlePressIn = () => {
    Animated.timing(scale, { toValue: 0.97, duration: motion.duration.fast, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: motion.duration.fast, useNativeDriver: true }).start();
  };

  const cardStyle = [
    styles.card,
    variant === 'glass' && styles.glass,
    variant === 'elevated' && styles.elevated,
    variant === 'gradient' && styles.gradient,
    { transform: [{ scale }] },
    style,
  ];

  const content = (
    <View style={styles.inner}>
      {children}
      {glow && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glowOverlay,
            { opacity: glowOpacity },
          ]}
        />
      )}
    </View>
  );

  if (pressable && onPress) {
    return (
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} {...props}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: { borderRadius: borderRadius.card, overflow: 'hidden' },
  inner: { borderRadius: borderRadius.card, padding: spacing.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceGlass },
  glass: { backgroundColor: colors.surfaceGlass },
  elevated: { backgroundColor: colors.surfaceElevated, shadowColor: colors.glassShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  gradient: { backgroundColor: colors.surfaceGlass },
  glowOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: borderRadius.card, backgroundColor: colors.primarySoft },
});
