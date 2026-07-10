import React, { useState } from 'react';
import { Pressable, Text, View, Modal, StyleSheet, ViewStyle, Platform, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Button } from './Button';

interface TimePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  style?: ViewStyle;
}

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export function TimePicker({ label, value, onChange, style }: TimePickerProps) {
  const [visible, setVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(value.getHours());
  const [selectedMinute, setSelectedMinute] = useState(value.getMinutes());

  const handleConfirm = () => {
    const newDate = new Date(value);
    newDate.setHours(selectedHour, selectedMinute);
    onChange(newDate);
    setVisible(false);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable onPress={() => setVisible(true)} style={styles.button} accessibilityRole="button" accessibilityLabel={label ? `${label}: ${formatTime(value)}` : formatTime(value)}>
        <Text style={styles.buttonText}>{formatTime(value)}</Text>
        <Text style={styles.icon}>🕐</Text>
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modal}>
            <Text style={styles.title}>Select Time</Text>
            <View style={styles.pickers}>
              <ScrollView style={styles.column} showsVerticalScrollIndicator={false}>
                {hours.map((h) => {
                  const ampm = h >= 12 ? 'PM' : 'AM';
                  const display = h % 12 || 12;
                  return (
                    <Pressable
                      key={h}
                      onPress={() => setSelectedHour(h)}
                      style={[styles.item, selectedHour === h && styles.itemSelected]}
                    >
                      <Text style={[styles.itemText, selectedHour === h && styles.itemTextSelected]}>
                        {display} {ampm}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <ScrollView style={styles.column} showsVerticalScrollIndicator={false}>
                {minutes.map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setSelectedMinute(m)}
                    style={[styles.item, selectedMinute === m && styles.itemSelected]}
                  >
                    <Text style={[styles.itemText, selectedMinute === m && styles.itemTextSelected]}>
                      {m.toString().padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View style={styles.actions}>
              <Button title="Cancel" variant="ghost" onPress={() => setVisible(false)} />
              <Button title="Confirm" variant="primary" onPress={handleConfirm} />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.small, color: colors.textSecondary, marginBottom: spacing.xs },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.smd,
    minHeight: 48,
  },
  buttonText: { ...typography.bodySmall, color: colors.textPrimary },
  icon: { fontSize: 18, marginLeft: spacing.sm },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', paddingHorizontal: spacing.lg },
  modal: {
    backgroundColor: colors.surfaceModal,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: 420,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  title: { ...typography.h4, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.md },
  pickers: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  column: { flex: 1, maxHeight: 280 },
  item: { paddingVertical: spacing.smd, paddingHorizontal: spacing.md, borderRadius: borderRadius.sm, alignItems: 'center' },
  itemSelected: { backgroundColor: colors.primary },
  itemText: { ...typography.bodySmall, color: colors.textPrimary },
  itemTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
});
