import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface Workout {
  name: string
  type: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  exercises: number
}

interface WorkoutCardProps {
  workout: Workout
  onPress: () => void
}

const colors = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  white: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  surface: '#F5F5F5',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
}

const difficultyColors = {
  beginner: colors.success,
  intermediate: colors.warning,
  advanced: colors.error,
}

const typeIcons: Record<string, string> = {
  strength: '💪',
  cardio: '🏃',
  yoga: '🧘',
  hiit: '⚡',
  stretching: '🤸',
}

function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const diffColor = difficultyColors[workout.difficulty] || colors.primary

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.typeIcon}>{typeIcons[workout.type.toLowerCase()] || '🏋️'}</Text>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>
            {workout.name}
          </Text>
          <Text style={styles.type}>{workout.type}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: diffColor + '20' }]}>
          <Text style={[styles.difficultyText, { color: diffColor }]}>
            {workout.difficulty}
          </Text>
        </View>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{workout.duration}</Text>
          <Text style={styles.statLabel}>min</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{workout.exercises}</Text>
          <Text style={styles.statLabel}>exercises</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  type: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
})

export default React.memo(WorkoutCard)
