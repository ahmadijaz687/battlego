import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Pressable, ViewStyle, PanResponder } from 'react-native';
import { colors, borderRadius, spacing, motion, zIndex } from '../theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | string;
  style?: ViewStyle;
}

export function BottomSheet({ visible, onClose, children, height = '50%', style }: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: motion.duration.slow, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: motion.duration.normal, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: Dimensions.get('window').height, duration: motion.duration.slow, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: motion.duration.normal, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > Dimensions.get('window').height * 0.3) {
          onClose();
        } else {
          Animated.timing(translateY, { toValue: 0, duration: motion.duration.normal, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.overlay, { opacity }]} pointerEvents={visible ? 'auto' : 'none'}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[styles.sheet, { height: typeof height === 'string' ? undefined : height }, { transform: [{ translateY }] }, style]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: zIndex.modal },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: colors.surfaceTertiary,
    borderTopLeftRadius: borderRadius.bottomSheet,
    borderTopRightRadius: borderRadius.bottomSheet,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
});