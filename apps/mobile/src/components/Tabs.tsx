import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface TabsProps {
  tabs: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  style?: ViewStyle;
}

export function Tabs({ tabs, selectedIndex, onSelect, style }: TabsProps) {
  const indicatorPosition = React.useRef(new Animated.Value(selectedIndex)).current;

  React.useEffect(() => {
    Animated.timing(indicatorPosition, {
      toValue: selectedIndex,
      duration: 240,
      useNativeDriver: false,
    }).start();
  }, [selectedIndex]);

  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab, index) => (
        <React.Fragment key={tab}>
          <Text
            style={[styles.tab, selectedIndex === index && styles.selectedTab]}
            onPress={() => onSelect(index)}
          >
            {tab}
          </Text>
        </React.Fragment>
      ))}
      <View style={styles.indicatorContainer}>
        <Animated.View style={[styles.indicator, { left: `${(selectedIndex / tabs.length) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textMuted,
  },
  selectedTab: { color: colors.textPrimary },
  indicatorContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 },
  indicator: {
    position: 'absolute',
    width: '25%',
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
});