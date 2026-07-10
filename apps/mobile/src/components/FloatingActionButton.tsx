import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../theme';

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
}

export function FloatingActionButton({ icon, onPress, style }: FloatingActionButtonProps) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});