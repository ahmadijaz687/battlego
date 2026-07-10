import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface NutritionRingProps {
  calories: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: ViewStyle;
}

export function NutritionRing({
  calories,
  goal,
  size = 80,
  strokeWidth = 6,
  color = colors.primary,
  style,
}: NutritionRingProps) {
  const progress = (calories / goal) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressValue = useSharedValue(0);

  React.useEffect(() => {
    progressValue.value = withTiming(progress, { duration: 1000 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (progressValue.value / 100) * circumference,
  }));

  return (
    <View style={[styles.container, style]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.content}>
        <Text style={styles.value}>{Math.round(calories)}</Text>
        <Text style={styles.unit}>cal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  content: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  value: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  unit: { color: colors.textMuted, fontSize: 10 },
});