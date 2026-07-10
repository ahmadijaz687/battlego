import React, { useEffect, useRef } from 'react'
import { Animated, Text, StyleSheet, Dimensions } from 'react-native'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onComplete?: () => void
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const typeColors = {
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
}

const typeIcons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
}

const colors = {
  white: '#FFFFFF',
  text: '#212121',
}

function Toast({
  message,
  type = 'info',
  duration = 3000,
  onComplete,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(-20)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onComplete?.())
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete, opacity, translateY])

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: typeColors[type], opacity, transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.icon}>{typeIcons[type]}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    maxWidth: SCREEN_WIDTH - 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.white,
  },
})

export default React.memo(Toast)
