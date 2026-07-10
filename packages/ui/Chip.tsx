import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface ChipProps {
  label: string
  variant?: 'filled' | 'outlined'
  color?: string
  onPress?: () => void
  onDelete?: () => void
  icon?: string
}

const colors = {
  primary: '#6C63FF',
  white: '#FFFFFF',
  border: '#E0E0E0',
}

function Chip({
  label,
  variant = 'filled',
  color = colors.primary,
  onPress,
  onDelete,
  icon,
}: ChipProps) {
  const isFilled = variant === 'filled'

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.chip,
        {
          backgroundColor: isFilled ? color : 'transparent',
          borderColor: isFilled ? color : color,
          borderWidth: 1.5,
        },
      ]}
    >
      {icon ? <Text style={[styles.icon, isFilled && { color: colors.white }]}>{icon}</Text> : null}
      <Text
        style={[
          styles.label,
          { color: isFilled ? colors.white : color },
        ]}
      >
        {label}
      </Text>
      {onDelete ? (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Text style={[styles.deleteIcon, { color: isFilled ? colors.white : color }]}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  deleteBtn: {
    marginLeft: 6,
    padding: 2,
  },
  deleteIcon: {
    fontSize: 12,
    fontWeight: '700',
  },
})

export default React.memo(Chip)
