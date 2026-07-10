import React from 'react'
import { View, TextInput as RNTextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  onSubmit?: () => void
  onClear?: () => void
}

const colors = {
  border: '#E0E0E0',
  textSecondary: '#757575',
  text: '#212121',
  white: '#FFFFFF',
  primary: '#6C63FF',
}

function SearchBar({ value, onChangeText, placeholder = 'Search...', onSubmit, onClear }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <RNTextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        accessibilityLabel="Search"
        accessibilityRole="search"
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={onClear || (() => onChangeText(''))}
          style={styles.clearBtn}
          accessible
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 6,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
})

export default React.memo(SearchBar)
