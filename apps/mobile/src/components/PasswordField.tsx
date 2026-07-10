import React, { useState } from 'react';
import { View, StyleSheet, TextInputProps, Pressable } from 'react-native';
import { TextField } from './TextField';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

interface PasswordFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export function PasswordField({ label = 'Password', error, containerStyle, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={containerStyle}>
      <TextField
        label={label}
        error={error}
        secureTextEntry={!visible}
        icon="lock-closed"
        rightIcon={
          <Pressable onPress={() => setVisible(!visible)} hitSlop={8} accessibilityLabel={visible ? 'Hide password' : 'Show password'} accessibilityRole="button">
            <Ionicons name={visible ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
          </Pressable>
        }
        {...props}
      />
    </View>
  );
}