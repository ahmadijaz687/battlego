import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface BarData {
  label: string
  value: number
}

interface ChartsProps {
  data: BarData[]
  height?: number
  color?: string
  showValues?: boolean
}

const colors = {
  primary: '#6C63FF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
}

function Charts({ data, height = 200, color = colors.primary, showValues = false }: ChartsProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <View style={styles.container}>
      <View style={[styles.chartArea, { height }]}>
        {showValues ? (
          <View style={styles.valuesColumn}>
            {data.map((item, i) => (
              <Text key={i} style={[styles.valueLabel, { marginTop: i > 0 ? 0 : 0 }]}>
                {item.value}
              </Text>
            ))}
          </View>
        ) : null}
        <View style={styles.barsContainer}>
          {data.map((item, i) => {
            const barHeight = (item.value / maxValue) * (height - 20)
            return (
              <View key={i} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(barHeight, 4),
                      backgroundColor: color,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  valuesColumn: {
    marginRight: 8,
    justifyContent: 'space-between',
    height: '100%',
  },
  valueLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '60%',
    minWidth: 8,
    maxWidth: 40,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
})

export default React.memo(Charts)
