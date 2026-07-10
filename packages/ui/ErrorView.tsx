import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface ErrorViewProps {
  message?: string
  onRetry?: () => void
  icon?: string
}

const colors = {
  text: '#212121',
  textSecondary: '#757575',
  primary: '#6C63FF',
  white: '#FFFFFF',
}

function ErrorView({
  message = 'Something went wrong',
  onRetry,
  icon = '😵',
}: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Try Again</Text>
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
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
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
  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
})

export default React.memo(ErrorView)
