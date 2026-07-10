import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

interface LoadingProps {
  message?: string
  size?: 'small' | 'large'
}

const colors = {
  overlay: 'rgba(0,0,0,0.4)',
  white: '#FFFFFF',
  text: '#212121',
  primary: '#6C63FF',
}

function Loading({ message, size = 'large' }: LoadingProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={colors.primary} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  message: {
    fontSize: 15,
    color: colors.text,
    marginTop: 16,
    fontWeight: '500',
  },
})

export default React.memo(Loading)
