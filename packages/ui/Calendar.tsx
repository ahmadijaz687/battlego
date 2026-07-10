import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface CalendarProps {
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  markedDates?: Record<string, { color: string }>
  minDate?: Date
  maxDate?: Date
}

const colors = {
  primary: '#6C63FF',
  white: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  surface: '#F5F5F5',
  disabled: '#BDBDBD',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function Calendar({ selectedDate, onDateSelect, markedDates, minDate, maxDate }: CalendarProps) {
  const today = useMemo(() => new Date(), [])
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth())
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear())

  const daysInMonth = useMemo(
    () => new Date(currentYear, currentMonth + 1, 0).getDate(),
    [currentMonth, currentYear],
  )
  const firstDayOfMonth = useMemo(
    () => new Date(currentYear, currentMonth, 1).getDay(),
    [currentMonth, currentYear],
  )

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const isDisabled = (date: Date) => {
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true
    return false
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const renderDays = () => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />)
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d)
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const marked = markedDates?.[dateKey]
      const disabled = isDisabled(date)
      const selected = isSelected(date)

      days.push(
        <TouchableOpacity
          key={d}
          onPress={() => !disabled && onDateSelect(date)}
          disabled={disabled}
          style={[
            styles.dayCell,
            selected && styles.selectedCell,
            disabled && { opacity: 0.3 },
          ]}
        >
          <Text
            style={[
              styles.dayText,
              selected && { color: colors.white },
              disabled && { color: colors.disabled },
            ]}
          >
            {d}
          </Text>
          {marked ? (
            <View
              style={[
                styles.dot,
                { backgroundColor: marked.color || colors.primary },
              ]}
            />
          ) : null}
        </TouchableOpacity>,
      )
    }
    return days
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrevMonth}>
          <Text style={styles.arrow}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {MONTHS[currentMonth]} {currentYear}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.arrow}>▶</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekRow}>
        {DAYS.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.daysGrid}>{renderDays()}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  arrow: {
    fontSize: 16,
    color: colors.primary,
    padding: 8,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  selectedCell: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  dot: {
    position: 'absolute',
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
})

export default React.memo(Calendar)
