import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing } from '../theme';

interface WorkoutCalendarProps {
  completedDays: string[];
  plannedDays: string[];
  onDatePress?: (date: string) => void;
}

export function WorkoutCalendar({ completedDays, plannedDays, onDatePress }: WorkoutCalendarProps) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = `2026-06-${String(i + 1).padStart(2, '0')}`;
    const isCompleted = completedDays.includes(date);
    const isPlanned = plannedDays.includes(date);
    return { date, isCompleted, isPlanned };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Month</Text>
      <View style={styles.grid}>
        {days.map((day) => (
          <Pressable
            key={day.date}
            style={[
              styles.day,
              day.isCompleted && styles.completedDay,
              day.isPlanned && !day.isCompleted && styles.plannedDay,
            ]}
            onPress={() => onDatePress?.(day.date)}
          >
            <Text style={styles.dayText}>{day.date.split('-')[2]}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  day: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedDay: { backgroundColor: colors.success },
  plannedDay: { backgroundColor: colors.primary },
  dayText: { color: colors.textPrimary, fontSize: 12 },
});