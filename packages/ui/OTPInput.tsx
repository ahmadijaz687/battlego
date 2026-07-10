import React, { useRef } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

interface OTPInputProps {
  length: 4 | 6
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
}

const colors = {
  border: '#E0E0E0',
  primary: '#6C63FF',
  text: '#212121',
  white: '#FFFFFF',
}

function OTPInput({ length, value, onChange, onComplete }: OTPInputProps) {
  const inputs = useRef<(TextInput | null)[]>([])

  const handleChange = (text: string, index: number) => {
    const newValue = value.split('')
    newValue[index] = text
    const result = newValue.join('')
    onChange(result)

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }

    if (result.length === length && onComplete) {
      onComplete(result)
    }
  }

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  return (
    <View style={styles.container}>
      {Array.from({ length }, (_, i) => (
        <TextInput
          key={i}
          ref={(ref) => {
            inputs.current[i] = ref
          }}
          style={[
            styles.box,
            value[i] ? { borderColor: colors.primary } : { borderColor: colors.border },
          ]}
          value={value[i] || ''}
          onChangeText={(text) => handleChange(text.slice(0, 1), i)}
          onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(key, i)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  box: {
    width: 52,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 12,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    backgroundColor: colors.white,
    textAlign: 'center',
  },
})

export default React.memo(OTPInput)
