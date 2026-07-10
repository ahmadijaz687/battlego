import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius } from '../../theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
  barWidth?: number;
  maxValue?: number;
  showLabels?: boolean;
  showValues?: boolean;
  style?: ViewStyle;
}

function AnimatedBar({
  item,
  index,
  barWidth,
  max,
  svgHeight,
  showLabels,
  showValues,
}: {
  item: BarData;
  index: number;
  barWidth: number;
  max: number;
  svgHeight: number;
  showLabels: boolean;
  showValues: boolean;
}) {
  const progressSV = useSharedValue(0);

  useEffect(() => {
    progressSV.value = withTiming(Math.min(item.value / max, 1), {
      duration: 600 + index * 80,
      easing: Easing.out(Easing.cubic),
    });
  }, [item.value, max, index]);

  const maxHeight = svgHeight - 8;
  const x = index * (barWidth + spacing.sm) + spacing.sm;

  const animatedProps = useAnimatedProps(() => {
    const h = interpolate(progressSV.value, [0, 1], [0, maxHeight], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return {
      height: h,
      y: svgHeight - h,
    };
  });

  return (
    <>
      <AnimatedRect
        x={x}
        width={barWidth}
        rx={6}
        ry={6}
        fill={item.color || colors.primary}
        animatedProps={animatedProps}
      />
      {showValues && (
        <Text
          style={[
            styles.valueLabel,
            { left: x, bottom: svgHeight + 4, width: barWidth },
          ]}
        >
          {item.value}
        </Text>
      )}
      {showLabels && (
        <Text
          style={[
            styles.label,
            { left: x, top: svgHeight + 4, width: barWidth },
          ]}
        >
          {item.label}
        </Text>
      )}
    </>
  );
}

export function BarChart({
  data,
  height = 160,
  barWidth = 28,
  maxValue,
  showLabels = true,
  showValues = true,
  style,
}: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const svgHeight = height;
  const svgWidth = Math.max(data.length * (barWidth + spacing.sm), 200);

  return (
    <Animated.View entering={FadeIn.duration(400)} style={style}>
      <Svg width={svgWidth} height={svgHeight + (showLabels ? 24 : 0)}>
        <Defs>
          <LinearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.primary} stopOpacity="1" />
            <Stop offset="1" stopColor={colors.primaryDark} stopOpacity="0.8" />
          </LinearGradient>
        </Defs>
        {data.map((item, i) => (
          <AnimatedBar
            key={i}
            item={item}
            index={i}
            barWidth={barWidth}
            max={max}
            svgHeight={svgHeight}
            showLabels={showLabels}
            showValues={showValues}
          />
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    textAlign: 'center',
    ...typography.tiny,
    color: colors.textSecondary,
  },
  valueLabel: {
    position: 'absolute',
    textAlign: 'center',
    ...typography.tiny,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
