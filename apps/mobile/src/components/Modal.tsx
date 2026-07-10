import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, motion, zIndex } from '../theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  backdropColor?: string;
}

export function Modal({ visible, onClose, children, style, backdropColor = 'rgba(0,0,0,0.6)' }: ModalProps) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: motion.duration.normal, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 7, tension: 40, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: motion.duration.fast, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.9, duration: motion.duration.fast, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.overlay, { backgroundColor: backdropColor, opacity }]} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View style={[styles.modal, { transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: zIndex.modal },
  modal: {
    backgroundColor: colors.surfaceModal,
    borderRadius: borderRadius.lg,
    minWidth: 280,
    maxWidth: '80%',
  },
});