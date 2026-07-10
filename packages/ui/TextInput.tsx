import React from 'react'
import { View, TextInput as RNTextInput, Text, StyleSheet } from 'react-native'

interface TextInputProps {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  error?: string
  multiline?: boolean
  secureTextEntry?: boolean
  icon?: string
}

const colors = {
  border: '#E0E0E0',
  error: '#F44336',
  text: '#212121',
  textSecondary: '#757575',
  white: '#FFFFFF',
  primary: '#6C63FF',
}

function TextInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  secureTextEntry = false,
  icon,
}: TextInputProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          { borderColor: error ? colors.error : colors.border },
          multiline && { minHeight: 100 },
        ]}
      >
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <RNTextInput
          style={[styles.input, multiline && { minHeight: 90, textAlignVertical: 'top' }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          accessible
          accessibilityLabel={label || placeholder || 'Text input'}
          accessibilityRole="text"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    fontWeight: '500',
  },
})

export default React.memo(TextInput)
