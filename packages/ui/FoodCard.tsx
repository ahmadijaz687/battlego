import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface Food {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  brand?: string
}

interface FoodCardProps {
  food: Food
  onPress?: () => void
  onAdd?: () => void
}

const colors = {
  primary: '#6C63FF',
  white: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  success: '#4CAF50',
}

function FoodCard({ food, onPress, onAdd }: FoodCardProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.7} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {food.name}
          </Text>
          {food.brand ? (
            <Text style={styles.brand} numberOfLines={1}>
              {food.brand}
            </Text>
          ) : null}
        </View>
        <Text style={styles.serving}>{food.servingSize}</Text>
      </View>
      <View style={styles.macros}>
        <View style={styles.macro}>
          <Text style={styles.macroValue}>{food.calories}</Text>
          <Text style={styles.macroLabel}>cal</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.macro}>
          <Text style={styles.macroValue}>{food.protein}g</Text>
          <Text style={styles.macroLabel}>protein</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.macro}>
          <Text style={styles.macroValue}>{food.carbs}g</Text>
          <Text style={styles.macroLabel}>carbs</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.macro}>
          <Text style={styles.macroValue}>{food.fat}g</Text>
          <Text style={styles.macroLabel}>fat</Text>
        </View>
      </View>
      {onAdd ? (
        <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  header: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  brand: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  serving: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 12,
  },
  macro: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  macroLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  addBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
})

export default React.memo(FoodCard)
