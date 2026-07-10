import React, { useRef } from 'react';
import { Pressable, Text, Animated, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface SwitchProps {
  label?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Switch({ label, value, onValueChange, disabled = false, style }: SwitchProps) {
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  const handlePress = () => {
    if (!disabled) onValueChange(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, style]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label || 'Toggle'}
    >
      {label && <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>}
      <View style={[styles.track, value && styles.trackActive, disabled && styles.trackDisabled]}>
        <Animated.View
          style={[
            styles.thumb,
            value && styles.thumbActive,
            disabled && styles.thumbDisabled,
            { transform: [{ translateX }] },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xs },
  label: { ...typography.bodySmall, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  labelDisabled: { color: colors.textDisabled },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceTertiary,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  trackActive: { backgroundColor: colors.primary },
  trackDisabled: { opacity: 0.4 },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.textPrimary,
  },
  thumbActive: { backgroundColor: '#FFFFFF' },
  thumbDisabled: { backgroundColor: colors.textDisabled },
});
