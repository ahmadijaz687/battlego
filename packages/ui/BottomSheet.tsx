import React, { ReactNode, useEffect, useRef } from 'react'
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  PanResponder,
} from 'react-native'

interface BottomSheetProps {
  isVisible: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  height?: number
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const colors = {
  overlay: 'rgba(0,0,0,0.5)',
  white: '#FFFFFF',
  text: '#212121',
  border: '#E0E0E0',
}

function BottomSheet({ isVisible, onClose, children, title, height = SCREEN_HEIGHT * 0.5 }: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(height)).current

  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start()
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible, height, translateY])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 10,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy)
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > height * 0.3) {
          onClose()
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    }),
  ).current

  if (!isVisible) return null

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
        accessible
        accessibilityLabel="Close"
        accessibilityRole="button"
      />
      <Animated.View
        style={[
          styles.sheet,
          { height, transform: [{ translateY }] },
        ]}
        {...panResponder.panHandlers}
        accessibilityViewIsModal
      >
        <View style={styles.handle} />
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
})

export default React.memo(BottomSheet)
