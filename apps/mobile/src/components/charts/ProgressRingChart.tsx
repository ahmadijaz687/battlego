import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
  Easing,
  useDerivedValue,
  FadeIn,
} from 'react-native-reanimated';
import { colors, typography } from '../../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  animated?: boolean;
}

export function ProgressRingChart({
  progress,
  size = 120,
  strokeWidth = 10,
  color = colors.primary,
  trackColor = colors.surface,
  children,
  style,
  animated = true,
}: ProgressRingProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressSV = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      progressSV.value = withTiming(clampedProgress, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progressSV.value = clampedProgress;
    }
  }, [clampedProgress, animated]);

  const animatedProps = useAnimatedProps(() => {
    const dashOffset = interpolate(
      progressSV.value,
      [0, 100],
      [circumference, circumference * (1 - 0.75)],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    return {
      strokeDashoffset: dashOffset,
    };
  });

  const rotation = useDerivedValue(() => {
    return `${interpolate(progressSV.value, [0, 100], [0, 360])}deg`;
  });

  return (
    <Animated.View entering={FadeIn.duration(400)} style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference}`}
            animatedProps={animatedProps}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      {children && (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          {children}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
