import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface TabsProps {
  tabs: string[]
  activeIndex: number
  onChange: (index: number) => void
  variant?: 'underline' | 'filled'
}

const colors = {
  primary: '#6C63FF',
  white: '#FFFFFF',
  border: '#E0E0E0',
  text: '#212121',
  textSecondary: '#757575',
  surface: '#F5F5F5',
}

function Tabs({ tabs, activeIndex, onChange, variant = 'underline' }: TabsProps) {
  return (
    <View style={[styles.container, variant === 'filled' && styles.filledContainer]}>
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(index)}
            accessible
            accessibilityLabel={tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={[
              styles.tab,
              variant === 'filled' && styles.filledTab,
              variant === 'filled' && isActive && { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: isActive ? colors.primary : colors.textSecondary },
                variant === 'filled' && { color: isActive ? colors.white : colors.textSecondary },
              ]}
            >
              {tab}
            </Text>
            {variant === 'underline' && isActive ? (
              <View style={styles.indicator} />
            ) : null}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filledContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    borderBottomWidth: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  filledTab: {
    borderRadius: 10,
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: -1,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
})

export default React.memo(Tabs)
