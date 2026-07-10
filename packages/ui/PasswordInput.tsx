import React, { useState } from 'react'
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface PasswordInputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  error?: string
  label?: string
}

const colors = {
  border: '#E0E0E0',
  error: '#F44336',
  text: '#212121',
  textSecondary: '#757575',
  white: '#FFFFFF',
  primary: '#6C63FF',
}

function PasswordInput({ value, onChangeText, placeholder, error, label }: PasswordInputProps) {
  const [secure, setSecure] = useState(true)

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          { borderColor: error ? colors.error : colors.border },
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secure}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.toggleBtn}>
          <Text style={styles.toggleIcon}>{secure ? '👁' : '👁‍🗨'}</Text>
        </TouchableOpacity>
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
  toggleBtn: {
    padding: 4,
  },
  toggleIcon: {
    fontSize: 20,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    fontWeight: '500',
  },
})

export default React.memo(PasswordInput)
