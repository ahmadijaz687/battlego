import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line as SvgLine } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  interpolate,
  Easing,
  useAnimatedProps,
  FadeIn,
} from 'react-native-reanimated';
import { colors, spacing, typography } from '../../theme';

interface LineData {
  label: string;
  value: number;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

function AnimatedFillPath({ d, progress }: { d: string; progress: Animated.SharedValue<number> }) {
  const animatedProps = useAnimatedProps(() => ({
    opacity: progress.value,
  }));
  return <AnimatedPath d={d} fill="url(#lineFill)" animatedProps={animatedProps} />;
}

interface LineChartProps {
  data: LineData[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  showDots?: boolean;
  showLabels?: boolean;
  showGrid?: boolean;
  style?: ViewStyle;
}

export function LineChart({
  data,
  width: chartWidth,
  height = 180,
  color = colors.primary,
  fillColor,
  showDots = true,
  showLabels = true,
  showGrid = true,
  style,
}: LineChartProps) {
  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;

  const padding = { top: 16, right: 16, bottom: showLabels ? 28 : 8, left: 8 };
  const svgWidth = chartWidth || Math.max(data.length * 48, 200);
  const svgHeight = height;
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [data]);

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * plotWidth;
    const y = padding.top + plotHeight - ((d.value - min) / range) * plotHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpx1 = prev.x + (p.x - prev.x) / 3;
    const cpx2 = prev.x + (2 * (p.x - prev.x)) / 3;
    return `${acc} C ${cpx1} ${prev.y} ${cpx2} ${p.y} ${p.x} ${p.y}`;
  }, '');

  const fillPath = pathD
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + plotHeight} L ${points[0].x} ${padding.top + plotHeight} Z`
    : '';

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = padding.top + plotHeight * (1 - ratio);
    const value = min + range * ratio;
    return { y, value: Math.round(value) };
  });

  return (
    <Animated.View entering={FadeIn.duration(400)} style={style}>
      <Svg width={svgWidth} height={svgHeight}>
        <Defs>
          <LinearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={fillColor || color} stopOpacity="0.3" />
            <Stop offset="1" stopColor={fillColor || color} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {showGrid &&
          gridLines.map((line, i) => (
            <React.Fragment key={i}>
              <SvgLine
                x1={padding.left}
                y1={line.y}
                x2={svgWidth - padding.right}
                y2={line.y}
                stroke={colors.border}
                strokeWidth={0.5}
                strokeDasharray="4 4"
              />
              <Text
                style={[styles.gridLabel, { top: line.y - 6, left: 0, width: padding.left - 4 }]}
              >
                {line.value}
              </Text>
            </React.Fragment>
          ))}

        <AnimatedFillPath d={fillPath} progress={progress} />
        <Path d={pathD} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />

        {showDots &&
          points.map((p, i) => (
            <React.Fragment key={i}>
              <Circle cx={p.x} cy={p.y} r={5} fill={colors.background} stroke={color} strokeWidth={2.5} />
              <Circle cx={p.x} cy={p.y} r={2} fill={color} />
            </React.Fragment>
          ))}
      </Svg>

      {showLabels && (
        <View style={styles.labelsRow}>
          {points.map((p, i) => (
            <Text
              key={i}
              style={[
                styles.xLabel,
                {
                  position: 'absolute',
                  left: p.x - 20,
                  width: 40,
                  textAlign: 'center',
                  top: svgHeight - 18,
                },
              ]}
            >
              {data[i].label}
            </Text>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gridLabel: {
    position: 'absolute',
    ...typography.tiny,
    color: colors.textMuted,
    textAlign: 'right',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  xLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
});
