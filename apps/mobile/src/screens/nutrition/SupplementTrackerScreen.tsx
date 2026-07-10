import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { Badge } from '../../components/Badge';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'SupplementTracker'>;

const supplements = [
  { id: '1', name: 'Whey Protein', dosage: '30g', time: 'Post-workout', taken: false },
  { id: '2', name: 'Creatine', dosage: '5g', time: 'With water', taken: true },
  { id: '3', name: 'Vitamin D3', dosage: '1 capsule', time: 'Morning', taken: true },
];

export default function SupplementTrackerScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Supplements</Text>
        <Pressable accessibilityLabel="Add supplement">
          <Ionicons name="add" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <FlatList
        data={supplements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PremiumCard variant="glass" style={styles.supplementCard}>
            <View style={styles.supplementRow}>
              <View style={[styles.checkbox, item.taken && styles.checked]}>
                {item.taken && <Ionicons name="checkmark" size={16} color={colors.background} />}
              </View>
              <View style={styles.supplementInfo}>
                <Text style={styles.supplementName}>{item.name}</Text>
                <Text style={styles.supplementDosage}>{item.dosage} • {item.time}</Text>
              </View>
              <Badge label={item.taken ? 'Taken' : 'Pending'} variant={item.taken ? 'success' : 'default'} size="sm" />
            </View>
          </PremiumCard>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary },
  list: { paddingBottom: spacing.md },
  supplementCard: { padding: spacing.md, marginBottom: spacing.sm },
  supplementRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: colors.primary, borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  checked: { backgroundColor: colors.primary },
  supplementInfo: { flex: 1, marginLeft: spacing.md },
  supplementName: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  supplementDosage: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },
});