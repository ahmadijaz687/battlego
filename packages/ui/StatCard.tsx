import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon: string
  trend?: 'up' | 'down' | 'flat'
  color?: string
}

const colors = {
  primary: '#6C63FF',
  white: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
}

const trendIcons = {
  up: '↑',
  down: '↓',
  flat: '→',
}

const trendColors = {
  up: colors.success,
  down: colors.error,
  flat: colors.warning,
}

function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  color = colors.primary,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Text style={[styles.icon, { color }]}>{icon}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>
          {value}
          {unit ? <Text style={styles.unit}> {unit}</Text> : null}
        </Text>
        {trend ? (
          <Text style={[styles.trend, { color: trendColors[trend] }]}>
            {trendIcons[trend]}
          </Text>
        ) : null}
      </View>
    </View>
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
  },
  unit: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  trend: {
    fontSize: 18,
    fontWeight: '700',
  },
})

export default React.memo(StatCard)
