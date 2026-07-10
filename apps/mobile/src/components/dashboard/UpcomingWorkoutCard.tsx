import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';
import { UpcomingWorkout } from '../../types/dashboard';

interface UpcomingWorkoutCardProps {
  workout: UpcomingWorkout;
}

export function UpcomingWorkoutCard({ workout }: UpcomingWorkoutCardProps) {
  return (
    <Card>
      <Text style={styles.title}>Next Workout</Text>
      <Text style={styles.workoutName}>{workout.name}</Text>
      <View style={styles.info}>
        <Text style={styles.infoText}>{workout.type} • {workout.duration} min</Text>
        <Text style={styles.time}>{workout.time}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textSecondary, fontSize: 14 },
  workoutName: { color: colors.textPrimary, fontSize: 18, fontWeight: '600', marginTop: spacing.xs },
  info: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  infoText: { color: colors.textMuted, fontSize: 12 },
  time: { color: colors.primary, fontSize: 12 },
});