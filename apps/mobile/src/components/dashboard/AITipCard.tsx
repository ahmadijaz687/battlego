import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';
import { AITip } from '../../types/dashboard';

interface AITipCardProps {
  tip: AITip;
}

export function AITipCard({ tip }: AITipCardProps) {
  const emoji = {
    workout: '💪',
    nutrition: '🥗',
    recovery: '😴',
    motivation: '🎯',
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.icon}>{emoji[tip.category]}</Text>
        <Text style={styles.title}>AI Tip</Text>
      </View>
      <Text style={styles.tip}>{tip.tip}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  icon: { fontSize: 20, marginRight: spacing.xs },
  title: { color: colors.textSecondary, fontSize: 14 },
  tip: { color: colors.textPrimary, fontSize: 14, lineHeight: 20 },
});