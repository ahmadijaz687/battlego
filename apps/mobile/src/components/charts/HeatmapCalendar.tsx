import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing, typography } from '../../theme';

interface HeatmapDay {
  date: string;
  count: number;
}

interface HeatmapCalendarProps {
  data: HeatmapDay[];
  weeks?: number;
  cellSize?: number;
  gap?: number;
  style?: ViewStyle;
}

const INTENSITY_LEVELS = [
  colors.surface,
  'rgba(255,31,61,0.2)',
  'rgba(255,31,61,0.4)',
  'rgba(255,31,61,0.65)',
  colors.primary,
];

function getIntensity(count: number): number {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

function AnimatedCell({
  intensity,
  size,
  delay,
}: {
  intensity: number;
  size: number;
  delay: number;
}) {
  const opacity = useSharedValue(0);
  const scaleSV = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })
    );
    scaleSV.value = withDelay(
      delay,
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scaleSV.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: 3,
          backgroundColor: INTENSITY_LEVELS[intensity],
        },
        animStyle,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`${INTENSITY_LEVELS[intensity]} intensity level`}
    />
  );
}

export function HeatmapCalendar({
  data,
  weeks = 12,
  cellSize = 14,
  gap = 3,
  style,
}: HeatmapCalendarProps) {
  const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', ''];
  const totalCells = weeks * 7;

  const cellMap = useMemo(() => {
    const map = new Map<string, HeatmapDay>();
    data.forEach((d) => map.set(d.date, d));
    return map;
  }, [data]);

  const cells = useMemo(() => {
    const result: { count: number; date: string }[] = [];
    const today = new Date();
    for (let i = totalCells - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const day = cellMap.get(dateStr);
      result.push({ count: day?.count ?? 0, date: dateStr });
    }
    return result;
  }, [data, totalCells, cellMap]);

  const gridWidth = weeks * (cellSize + gap);

  return (
    <View style={style}>
      <View style={[styles.grid, { width: gridWidth }]}>
        <View style={styles.dayLabels}>
          {dayLabels.map((label, i) => (
            <Text key={i} style={[styles.dayLabel, { height: cellSize + gap }]}>
              {label}
            </Text>
          ))}
        </View>
        <View style={styles.cellsContainer}>
          {Array.from({ length: weeks }).map((_, week) => (
            <View key={week} style={{ gap }}>
              {Array.from({ length: 7 }).map((_, day) => {
                const idx = week * 7 + day;
                const cell = cells[idx];
                const intensity = getIntensity(cell?.count ?? 0);

                return (
                  <AnimatedCell
                    key={`${week}-${day}`}
                    intensity={intensity}
                    size={cellSize}
                    delay={idx * 8}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Less</Text>
        {INTENSITY_LEVELS.map((bgColor, i) => (
          <View
            key={i}
            style={[
              styles.legendCell,
              {
                width: cellSize,
                height: cellSize,
                backgroundColor: bgColor,
                borderRadius: 3,
              },
            ]}
          />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
  },
  dayLabels: {
    marginRight: spacing.xs,
    justifyContent: 'space-between',
  },
  dayLabel: {
    ...typography.tiny,
    color: colors.textMuted,
    textAlign: 'right',
    width: 28,
    fontSize: 10,
  },
  cellsContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  legendLabel: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  legendCell: {
    borderWidth: 0.5,
    borderColor: colors.border,
  },
});
