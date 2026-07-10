import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import * as nutritionService from '../../services/nutritionService';
import { PremiumCard } from '../../components/PremiumCard';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'BodyMeasurements'>;

const fields = ['chest', 'waist', 'hips', 'shoulders', 'arms', 'forearms', 'thighs', 'calves', 'neck', 'bodyFat'];

export default function BodyMeasurementsScreen({ navigation }: Props) {
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = async () => {
    try {
      setIsLoading(true);
      const data = await nutritionService.getBodyMeasurements('', 30);
      setMeasurements(data || []);
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const latest = measurements && measurements.length > 0 ? measurements[0] : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Body Measurements</Text>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : !latest ? (
        <Text style={styles.loadingText}>No measurements recorded yet.</Text>
      ) : (
        <FlatList
          data={fields}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <PremiumCard variant="glass" style={styles.fieldCard}>
              <Text style={styles.fieldName}>{item}</Text>
              <Text style={styles.fieldValue}>{(latest as any)[item] || '-'} in</Text>
            </PremiumCard>
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  list: { paddingBottom: spacing.md },
  row: { flex: 1, justifyContent: 'space-between' },
  fieldCard: { flex: 1, padding: spacing.md, marginBottom: spacing.sm, marginHorizontal: spacing.xs / 2 },
  fieldName: { color: colors.textSecondary, textTransform: 'capitalize' },
  loadingText: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },
  fieldValue: { color: colors.textPrimary, fontSize: 18, fontWeight: '600', marginTop: spacing.xs },
});