import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface BadgeProps {
  count: number
  variant?: 'dot' | 'number'
  color?: string
  size?: number
}

const colors = {
  error: '#F44336',
  white: '#FFFFFF',
}

function Badge({ count, variant = 'number', color = colors.error, size = 20 }: BadgeProps) {
  if (variant === 'dot') {
    return (
      <View
        style={[
          styles.dot,
          {
            backgroundColor: color,
            width: size * 0.5,
            height: size * 0.5,
            borderRadius: (size * 0.5) / 2,
          },
        ]}
      />
    )
  }

  const displayCount = count > 99 ? '99+' : count

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color,
          minWidth: size,
          height: size,
          borderRadius: size / 2,
          paddingHorizontal: count > 9 ? 6 : 0,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.55 }]}>{displayCount}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontWeight: '800',
    textAlign: 'center',
  },
})

export default React.memo(Badge)
