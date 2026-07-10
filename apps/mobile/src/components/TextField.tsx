import React, { useState, useRef, forwardRef } from 'react';
import { TextInput, StyleSheet, View, Text, Animated, TextInputProps, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { colors, borderRadius, spacing, typography, motion } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: string;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  style?: StyleProp<TextStyle>;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(({
  label,
  error,
  icon,
  rightIcon,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const borderColor = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setFocused(true);
    Animated.timing(borderColor, { toValue: 1, duration: motion.duration.normal, useNativeDriver: false }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    Animated.timing(borderColor, { toValue: 0, duration: motion.duration.normal, useNativeDriver: false }).start();
    onBlur?.(e);
  };

  const borderAnim = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, error && styles.labelError]}>{label}</Text>}
      <Animated.View style={[styles.inputWrapper, { borderColor: borderAnim, borderWidth: 1 }]}>
        {icon && (
          <Ionicons name={icon as any} size={20} color={focused ? colors.primary : colors.textMuted} style={styles.icon} />
        )}
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { marginBottom: spacing.sm },
  label: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  labelError: { color: colors.error },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  icon: { marginRight: spacing.xs },
  rightIcon: { marginLeft: spacing.sm },
  input: {
    flex: 1,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    fontSize: 16,
  },
  errorText: { ...typography.caption, color: colors.error, marginTop: spacing.xs },
});