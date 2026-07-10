import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface ProgressBarProps {
  progress: number
  height?: number
  color?: string
  backgroundColor?: string
  label?: string
  showPercent?: boolean
}

const colors = {
  primary: '#6C63FF',
  border: '#E0E0E0',
  text: '#212121',
  textSecondary: '#757575',
}

function ProgressBar({
  progress,
  height = 8,
  color = colors.primary,
  backgroundColor = colors.border,
  label,
  showPercent = false,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1)

  return (
    <View style={styles.container}>
      {label || showPercent ? (
        <View style={styles.header}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          {showPercent ? (
            <Text style={styles.percent}>{Math.round(clamped * 100)}%</Text>
          ) : null}
        </View>
      ) : null}
      <View style={[styles.track, { height, backgroundColor, borderRadius: height / 2 }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clamped * 100}%`,
              height,
              backgroundColor: color,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  percent: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
})

export default React.memo(ProgressBar)
