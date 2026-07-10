import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface EmptyStateProps {
  title: string
  message: string
  icon?: string
  actionLabel?: string
  onAction?: () => void
}

const colors = {
  text: '#212121',
  textSecondary: '#757575',
  primary: '#6C63FF',
  white: '#FFFFFF',
}

function EmptyState({
  title,
  message,
  icon = '📭',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
})

export default React.memo(EmptyState)
