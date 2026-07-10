import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'ShoppingList'>;

export default function ShoppingListScreen({ navigation }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      setItems([]);
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (item: { id: string; name: string; quantity: number; unit: string; category: string; completed: boolean }) => {
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, completed: !i.completed } : i));
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }},
    ]);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setItems((prev) => [...prev, { id: Date.now().toString(), name: newName.trim(), quantity: 1, unit: 'item', category: 'Other', completed: false }]);
    setNewName('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Shopping List</Text>
      </View>

      <PremiumCard variant="glass" style={styles.addCard}>
        <View style={styles.addRow}>
          <TextInput
            style={styles.addInput}
            placeholder="Add item..."
            placeholderTextColor={colors.textMuted}
            value={newName}
            onChangeText={setNewName}
          />
          <Button title="Add" variant="primary" size="sm" onPress={handleAdd} />
        </View>
      </PremiumCard>

      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PremiumCard variant="glass" style={styles.itemCard}>
              <Pressable style={styles.itemRow} onPress={() => handleToggle(item)} onLongPress={() => handleDelete(item.id)}>
                <View style={[styles.checkbox, item.completed && styles.checked]}>
                  {item.completed && <Ionicons name="checkmark" size={16} color={colors.background} />}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, item.completed && styles.completedText]}>{item.name}</Text>
                  <View style={styles.itemMeta}>
                    <Text style={styles.metaText}>{item.quantity} {item.unit}</Text>
                    <Badge label={item.category} variant="default" size="sm" />
                  </View>
                </View>
                <Pressable onPress={() => handleDelete(item.id)} accessibilityLabel="Delete item">
                  <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </Pressable>
            </PremiumCard>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary },
  list: { paddingBottom: spacing.md },
  itemCard: { padding: spacing.md, marginBottom: spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: colors.primary, borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  checked: { backgroundColor: colors.primary },
  itemInfo: { flex: 1, marginLeft: spacing.md },
  addCard: { padding: spacing.md, marginBottom: spacing.lg },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  addInput: { flex: 1, backgroundColor: colors.surfaceGlass, color: colors.textPrimary, padding: spacing.sm, borderRadius: borderRadius.md, fontSize: 14 },
  loadingText: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },
  itemName: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  completedText: { textDecorationLine: 'line-through', color: colors.textMuted },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  metaText: { color: colors.textSecondary, fontSize: 12 },
});