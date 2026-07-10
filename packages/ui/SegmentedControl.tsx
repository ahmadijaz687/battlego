import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface SegmentedControlProps {
  segments: string[]
  selectedIndex: number
  onChange: (index: number) => void
}

const colors = {
  primary: '#6C63FF',
  white: '#FFFFFF',
  border: '#E0E0E0',
  text: '#212121',
  textSecondary: '#757575',
  surface: '#F5F5F5',
}

function SegmentedControl({ segments, selectedIndex, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {segments.map((segment, index) => {
        const isActive = index === selectedIndex
        return (
          <TouchableOpacity
            key={segment}
            onPress={() => onChange(index)}
            style={[
              styles.segment,
              isActive && styles.activeSegment,
              index === 0 && styles.firstSegment,
              index === segments.length - 1 && styles.lastSegment,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: isActive ? colors.white : colors.textSecondary },
              ]}
            >
              {segment}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSegment: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  firstSegment: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  lastSegment: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
})

export default React.memo(SegmentedControl)
