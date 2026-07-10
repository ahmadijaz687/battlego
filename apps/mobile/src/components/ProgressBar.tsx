import React from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { colors, borderRadius, motion } from '../theme';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function ProgressBar({ progress, height = 8, color = colors.primary, backgroundColor = colors.border, style }: ProgressBarProps) {
  const animatedProgress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: Math.min(Math.max(progress, 0), 100),
      duration: motion.duration.slow,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.track, { height, backgroundColor }, style]}>
      <Animated.View style={[styles.fill, { height, backgroundColor: color, width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: borderRadius.full, overflow: 'hidden' },
  fill: { borderRadius: borderRadius.full },
});