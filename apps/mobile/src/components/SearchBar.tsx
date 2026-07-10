import React, { forwardRef } from 'react';
import { View, StyleSheet, TextInput, TextInputProps, ViewStyle, Pressable } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps extends TextInputProps {
  containerStyle?: ViewStyle;
  onClear?: () => void;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(({
  containerStyle,
  onClear,
  ...props
}, ref) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="search" size={20} color={colors.textMuted} style={styles.icon} />
      <TextInput
        ref={ref}
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor={colors.textMuted}
        accessibilityLabel="Search"
        accessibilityRole="search"
        {...props}
      />
      {props.value ? (
        <Pressable onPress={onClear} hitSlop={8} accessibilityLabel="Clear search" accessibilityRole="button">
          <Ionicons name="close-circle" size={20} color={colors.textMuted} style={styles.clear} />
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: { marginRight: spacing.xs },
  input: { flex: 1, color: colors.textPrimary, paddingVertical: spacing.sm, fontSize: 16 },
  clear: { marginLeft: spacing.xs },
});