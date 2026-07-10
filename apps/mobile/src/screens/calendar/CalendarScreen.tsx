import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

interface CalendarDay {
  date: Date;
  key: string;
  dayOfMonth: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  hasWorkout: boolean;
  hasMeal: boolean;
  hasWater: boolean;
}

function generateCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const days: CalendarDay[] = [];

  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, -startPad + i + 1);
    days.push({
      date: d,
      key: d.toISOString(),
      dayOfMonth: d.getDate(),
      isToday: false,
      isCurrentMonth: false,
      hasWorkout: false,
      hasMeal: false,
      hasWater: false,
    });
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    const today = new Date();
    days.push({
      date: d,
      key: d.toISOString(),
      dayOfMonth: i,
      isToday: d.toDateString() === today.toDateString(),
      isCurrentMonth: true,
      hasWorkout: Math.random() > 0.6,
      hasMeal: Math.random() > 0.4,
      hasWater: Math.random() > 0.3,
    });
  }

  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, days.length - lastDay.getDate() + 1);
    days.push({
      date: d,
      key: d.toISOString(),
      dayOfMonth: d.getDate(),
      isToday: false,
      isCurrentMonth: false,
      hasWorkout: false,
      hasMeal: false,
      hasWater: false,
    });
  }

  return days;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState<'workouts' | 'nutrition'>('workouts');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateCalendarDays(year, month);

  const prevMonth = useCallback(() => setCurrentDate(new Date(year, month - 1)), [year, month]);
  const nextMonth = useCallback(() => setCurrentDate(new Date(year, month + 1)), [year, month]);

  const selectedDays = days.filter((d) => d.isCurrentMonth && (selectedTab === 'workouts' ? d.hasWorkout : d.hasMeal));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, selectedTab === 'workouts' && styles.tabActive]}
          onPress={() => setSelectedTab('workouts')}
        >
          <Ionicons name="barbell-outline" size={16} color={selectedTab === 'workouts' ? colors.primary : colors.textMuted} />
          <Text style={[styles.tabText, selectedTab === 'workouts' && styles.tabTextActive]}>Workouts</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === 'nutrition' && styles.tabActive]}
          onPress={() => setSelectedTab('nutrition')}
        >
          <Ionicons name="nutrition-outline" size={16} color={selectedTab === 'nutrition' ? colors.primary : colors.textMuted} />
          <Text style={[styles.tabText, selectedTab === 'nutrition' && styles.tabTextActive]}>Nutrition</Text>
        </Pressable>
      </View>

      <View style={styles.monthNav}>
        <Pressable onPress={prevMonth} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
        <Pressable onPress={nextMonth} hitSlop={8}>
          <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.calendarGrid}>
        {DAY_HEADERS.map((h) => (
          <View key={h} style={styles.dayHeaderCell}>
            <Text style={styles.dayHeaderText}>{h}</Text>
          </View>
        ))}
        {days.map((day) => (
          <Pressable
            key={day.key}
            style={[
              styles.dayCell,
              !day.isCurrentMonth && styles.dayCellOutside,
              day.isToday && styles.dayCellToday,
            ]}
            onPress={() => {
              if (selectedTab === 'workouts') {
                navigation.navigate('WorkoutHistory');
              } else {
                navigation.navigate('MealHistory');
              }
            }}
          >
            <Text style={[styles.dayCellText, !day.isCurrentMonth && styles.dayCellTextOutside, day.isToday && styles.dayCellTextToday]}>
              {day.dayOfMonth}
            </Text>
            {day.isCurrentMonth && (
              <View style={styles.dotRow}>
                {day.hasWorkout && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
                {day.hasWater && <View style={[styles.dot, { backgroundColor: colors.info }]} />}
                {day.hasMeal && <View style={[styles.dot, { backgroundColor: colors.success }]} />}
              </View>
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Workout</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.info }]} />
          <Text style={styles.legendText}>Water</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Meal</Text>
        </View>
      </View>

      <ScrollView style={styles.eventList}>
        <Text style={styles.eventListTitle}>
          {selectedTab === 'workouts' ? 'Workouts' : 'Meals'} on active days
        </Text>
        {selectedDays.length === 0 ? (
          <Text style={styles.emptyText}>No {selectedTab} logged this month</Text>
        ) : (
          selectedDays.slice(0, 5).map((day) => (
            <Pressable
              key={day.key}
              style={styles.eventCard}
              onPress={() => {
                if (selectedTab === 'workouts') {
                  navigation.navigate('WorkoutDetails', { templateId: day.key });
                } else {
                  navigation.navigate('MealDetails', { mealId: day.key });
                }
              }}
            >
              <View style={styles.eventCardLeft}>
                <Text style={styles.eventDay}>{day.date.getDate()}</Text>
                <Text style={styles.eventMonth}>{MONTHS[day.date.getMonth()].slice(0, 3)}</Text>
              </View>
              <View style={styles.eventCardRight}>
                <Text style={styles.eventTitle}>
                  {selectedTab === 'workouts' ? 'Morning Workout' : 'Daily Meals'}
                </Text>
                <Text style={styles.eventSubtitle}>
                  {day.hasWater ? 'Water logged' : 'No water'} · {
                    selectedTab === 'workouts' ? `${Math.floor(Math.random() * 45 + 15)} min` : `${Math.floor(Math.random() * 4 + 1)} meals`
                  }
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  title: { fontSize: typography.h2.fontSize, fontWeight: '700', color: colors.textPrimary },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
  tab: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.full, backgroundColor: colors.surface },
  tabActive: { backgroundColor: colors.primary + '20' },
  tabText: { fontSize: 14, color: colors.textMuted, fontWeight: '500' },
  tabTextActive: { color: colors.primary },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  monthTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md },
  dayHeaderCell: { width: '14.28%', alignItems: 'center', paddingVertical: spacing.xs },
  dayHeaderText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  dayCell: { width: '14.28%', alignItems: 'center', paddingVertical: spacing.xs, minHeight: 44, justifyContent: 'center' },
  dayCellOutside: { opacity: 0.3 },
  dayCellToday: { backgroundColor: colors.primary + '20', borderRadius: borderRadius.md },
  dayCellText: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  dayCellTextOutside: { color: colors.textMuted },
  dayCellTextToday: { color: colors.primary, fontWeight: '700' },
  dotRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg, paddingVertical: spacing.sm, marginHorizontal: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: colors.textMuted },
  eventList: { flex: 1, paddingHorizontal: spacing.lg, marginTop: spacing.sm },
  eventListTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.sm },
  emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: spacing.lg },
  eventCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  eventCardLeft: { alignItems: 'center', marginRight: spacing.md, minWidth: 40 },
  eventDay: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  eventMonth: { fontSize: 11, color: colors.textMuted, textTransform: 'uppercase' },
  eventCardRight: { flex: 1 },
  eventTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  eventSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
