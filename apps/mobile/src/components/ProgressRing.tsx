import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '../theme';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export function ProgressRing({ progress, size = 96, strokeWidth = 8, color = colors.primary, backgroundColor = colors.surfaceTertiary, children }: ProgressRingProps) {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, { toValue: Math.min(Math.max(progress, 0), 100), duration: 600, easing: (v) => v, useNativeDriver: true }).start();
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, circumference * (1 - 0.75)],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: backgroundColor }]}>
        <Animated.View
          style={[
            styles.ringFill,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              transform: [
                { rotate: animatedProgress.interpolate({ inputRange: [0, 100], outputRange: ['0deg', '360deg'] }) },
              ],
            },
          ]}
        />
      </View>
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  ring: { position: 'absolute' },
  ringFill: { position: 'absolute' },
});
