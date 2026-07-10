import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Text } from 'react-native';
import { colors } from '../theme';

interface CelebrationProps {
  visible: boolean;
  message?: string;
  onFinish?: () => void;
}

export function Celebration({ visible, message = 'Great Job!', onFinish }: CelebrationProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
        Animated.delay(1500),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onFinish?.());
    }
  }, [visible, scale, opacity, onFinish]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  emoji: { fontSize: 48 },
  message: { color: colors.textPrimary, fontSize: 18, fontWeight: '600', marginTop: 8 },
});