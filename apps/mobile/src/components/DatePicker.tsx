import React, { useState } from 'react';
import { Pressable, Text, View, Modal, StyleSheet, ViewStyle, Platform } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Button } from './Button';

interface DatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  style?: ViewStyle;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const days = getDaysInMonth(year, month);
  const result: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) result.push(null);
  for (let d = 1; d <= days; d++) result.push(d);
  return result;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function DatePicker({ label, value, onChange, style }: DatePickerProps) {
  const [visible, setVisible] = useState(false);
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());

  const handleSelect = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    onChange(newDate);
    setVisible(false);
  };

  const cells = getMonthDays(viewYear, viewMonth);

  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable onPress={() => setVisible(true)} style={styles.button} accessibilityRole="button" accessibilityLabel={label ? `${label}: ${formatDate(value)}` : formatDate(value)}>
        <Text style={styles.buttonText}>{formatDate(value)}</Text>
        <Text style={styles.icon}>📅</Text>
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modal}>
            <View style={styles.monthNav}>
              <Pressable onPress={() => { if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); } else setViewMonth(viewMonth - 1); }} style={styles.navButton}>
                <Text style={styles.navText}>←</Text>
              </Pressable>
              <Text style={styles.monthTitle}>{MONTHS[viewMonth]} {viewYear}</Text>
              <Pressable onPress={() => { if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); } else setViewMonth(viewMonth + 1); }} style={styles.navButton}>
                <Text style={styles.navText}>→</Text>
              </Pressable>
            </View>
            <View style={styles.weekRow}>
              {DAYS.map((d) => <Text key={d} style={styles.weekDay}>{d}</Text>)}
            </View>
            <View style={styles.daysGrid}>
              {cells.map((day, i) => (
                <View key={i} style={styles.dayCell}>
                  {day != null && (
                    <Pressable
                      onPress={() => handleSelect(day)}
                      style={[styles.dayButton, value.getDate() === day && value.getMonth() === viewMonth && value.getFullYear() === viewYear && styles.daySelected]}
                    >
                      <Text style={[styles.dayText, value.getDate() === day && value.getMonth() === viewMonth && value.getFullYear() === viewYear && styles.dayTextSelected]}>{day}</Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
            <Button title="Cancel" variant="ghost" onPress={() => setVisible(false)} />
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
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  navButton: { padding: spacing.sm },
  navText: { fontSize: 20, color: colors.primary, fontWeight: '600' },
  monthTitle: { ...typography.h4, color: colors.textPrimary },
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  weekDay: { flex: 1, textAlign: 'center', ...typography.caption, color: colors.textMuted },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, padding: 2 },
  dayButton: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius.full },
  daySelected: { backgroundColor: colors.primary },
  dayText: { ...typography.small, color: colors.textPrimary },
  dayTextSelected: { color: '#FFFFFF', fontWeight: '700' },
});
