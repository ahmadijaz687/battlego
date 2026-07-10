import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, motion } from '../theme';

interface FloatingNavProps {
  active: string;
  onSelect: (name: string) => void;
}

const tabs = [
  { name: 'Workout', icon: 'barbell' },
  { name: 'Battles', icon: 'flash' },
  { name: 'Nutrition', icon: 'nutrition' },
  { name: 'AI', icon: 'chatbubbles' },
  { name: 'Profile', icon: 'person' },
] as const;

export function FloatingNav({ active, onSelect }: FloatingNavProps) {
  return (
    <BlurView intensity={40} tint="dark" style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = active === tab.name;
          return (
            <NavItem key={tab.name} tab={tab} isActive={isActive} onPress={() => onSelect(tab.name)} />
          );
        })}
      </View>
    </BlurView>
  );
}

function NavItem({ tab, isActive, onPress }: { tab: (typeof tabs)[number]; isActive: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.timing(scale, { toValue: 0.88, duration: motion.duration.fast, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  const handlePressOut = () => Animated.timing(scale, { toValue: 1, duration: motion.duration.fast, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} style={styles.item} accessibilityLabel={tab.name} accessibilityRole="tab">
        <View style={styles.iconWrap}>
          {isActive && <View style={styles.glow} />}
          <Ionicons name={tab.icon as any} size={22} color={isActive ? colors.primary : colors.textMuted} />
        </View>
        <Text style={[styles.label, isActive && styles.labelActive]}>{tab.name}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.bottomSheet,
    overflow: 'hidden',
    backgroundColor: colors.navigation,
    borderWidth: 1,
    borderColor: colors.border,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: spacing.sm,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  iconWrap: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  glow: { position: 'absolute', width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primarySoft },
  label: { ...typography.tiny, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  labelActive: { color: colors.primary, fontWeight: '700' },
});
