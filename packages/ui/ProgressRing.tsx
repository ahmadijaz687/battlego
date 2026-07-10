import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
}

const colors = {
  primary: '#6C63FF',
  border: '#E0E0E0',
  text: '#212121',
}

function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  color = colors.primary,
  label,
}: ProgressRingProps) {
  const clamped = Math.min(Math.max(progress, 0), 1)
  const circumference = 2 * Math.PI * ((size - strokeWidth) / 2)
  const filledLength = circumference * clamped
  const emptyLength = circumference - filledLength

  const dashArray = `${filledLength} ${emptyLength}`
  const rotation = -90

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: colors.border,
          },
        ]}
      />
      <View style={[styles.fill, { width: size, height: size, borderRadius: size / 2 }]}>
        <View
          style={[
            styles.halfCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              transform: [{ rotate: `${rotation}deg` }],
            },
          ]}
        />
      </View>
      <View style={styles.center}>
        <Text style={[styles.percent, { fontSize: size * 0.25, color }]}>
          {Math.round(clamped * 100)}%
        </Text>
        {label ? (
          <Text style={[styles.label, { fontSize: size * 0.12 }]}>{label}</Text>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
  },
  fill: {
    position: 'absolute',
    overflow: 'hidden',
  },
  halfCircle: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    fontWeight: '700',
  },
  label: {
    color: '#757575',
    marginTop: 2,
  },
})

export default React.memo(ProgressRing)
