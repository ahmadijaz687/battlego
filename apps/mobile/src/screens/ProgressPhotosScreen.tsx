import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProgressPhotos'>;

interface ProgressPhoto {
  id: string;
  uri: string;
  date: string;
  note: string;
}

const mockPhotos: ProgressPhoto[] = [
  { id: '1', uri: 'https://picsum.photos/400/500?1', date: '2024-01-15', note: 'Starting point' },
  { id: '2', uri: 'https://picsum.photos/400/500?2', date: '2024-02-15', note: '1 month progress' },
  { id: '3', uri: 'https://picsum.photos/400/500?3', date: '2024-03-15', note: '2 months in' },
  { id: '4', uri: 'https://picsum.photos/400/500?4', date: '2024-04-15', note: '3 months progress' },
  { id: '5', uri: 'https://picsum.photos/400/500?5', date: '2024-05-15', note: '4 months transformation' },
];

export default function ProgressPhotosScreen({ navigation }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [photos, setPhotos] = useState(mockPhotos);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const handleUpload = () => {
    const newPhoto: ProgressPhoto = {
      id: Date.now().toString(),
      uri: 'https://picsum.photos/400/500?' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      note: 'New photo',
    };
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const handleDelete = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const toggleCompare = (photoId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(photoId)) return prev.filter((id) => id !== photoId);
      if (prev.length < 2) return [...prev, photoId];
      return [photoId];
    });
  };

  const renderGridItem = ({ item }: { item: ProgressPhoto }) => (
    <Pressable
      style={[styles.photoItem, compareMode && compareIds.includes(item.id) && styles.photoItemSelected]}
      onLongPress={() => handleDelete(item.id)}
    >
      <Image source={{ uri: item.uri }} style={styles.photoImage} resizeMode="cover" />
      {compareMode && (
        <Pressable style={[styles.checkCircle, compareIds.includes(item.id) && styles.checkCircleSelected]} onPress={() => toggleCompare(item.id)}>
          {compareIds.includes(item.id) && <Ionicons name="checkmark" size={14} color={colors.textInverse} />}
        </Pressable>
      )}
      <View style={styles.photoOverlay}>
        <Text style={styles.photoDate}>{item.date}</Text>
      </View>
    </Pressable>
  );

  const renderTimelineItem = ({ item, index }: { item: ProgressPhoto; index: number }) => (
    <View style={styles.timelineItem}>
      <View style={styles.timelineDot} />
      {index < photos.length - 1 && <View style={styles.timelineLine} />}
      <Card style={styles.timelineCard}>
        <Image source={{ uri: item.uri }} style={styles.timelineImage} resizeMode="cover" />
        <Text style={styles.timelineDate}>{item.date}</Text>
        {item.note ? <Text style={styles.timelineNote}>{item.note}</Text> : null}
        <Pressable onPress={() => handleDelete(item.id)} style={styles.timelineDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </Card>
    </View>
  );

  const comparePhotos = compareIds.map((id) => photos.find((p) => p.id === id)).filter(Boolean) as ProgressPhoto[];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress Photos</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.viewToggle, viewMode === 'timeline' && styles.viewToggleActive]}
            onPress={() => setViewMode(viewMode === 'grid' ? 'timeline' : 'grid')}
            accessibilityLabel={`Switch to ${viewMode === 'grid' ? 'timeline' : 'grid'} view`}
          >
            <Ionicons name={viewMode === 'grid' ? 'list' : 'grid'} size={18} color={viewMode === 'timeline' ? colors.textInverse : colors.textPrimary} />
          </Pressable>
          <Pressable
            style={[styles.compareToggle, compareMode && styles.compareToggleActive]}
            onPress={() => { setCompareMode((p) => !p); setCompareIds([]); }}
            accessibilityLabel="Toggle compare mode"
          >
            <Ionicons name="swap-horizontal" size={18} color={compareMode ? colors.textInverse : colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      {compareMode && comparePhotos.length === 2 && (
        <Card style={styles.compareCard}>
          <View style={styles.compareRow}>
            <View style={styles.compareCol}>
              <Image source={{ uri: comparePhotos[0].uri }} style={styles.compareImage} />
              <Text style={styles.compareDate}>{comparePhotos[0].date}</Text>
            </View>
            <View style={styles.compareCol}>
              <Image source={{ uri: comparePhotos[1].uri }} style={styles.compareImage} />
              <Text style={styles.compareDate}>{comparePhotos[1].date}</Text>
            </View>
          </View>
        </Card>
      )}

      {photos.length === 0 ? (
        <EmptyState icon="📸" title="No progress photos yet" description="Take your first progress photo to track your transformation" />
      ) : viewMode === 'grid' ? (
        <FlatList
          data={photos}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
        />
      ) : (
        <FlatList
          data={photos}
          renderItem={renderTimelineItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.timelineContent}
        />
      )}

      <Button title="Upload Photo" style={styles.uploadBtn} onPress={handleUpload} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  viewToggle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  viewToggleActive: { backgroundColor: colors.primary },
  compareToggle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  compareToggleActive: { backgroundColor: colors.accentPurple },
  compareCard: { marginHorizontal: spacing.md, marginBottom: spacing.md, padding: spacing.sm },
  compareRow: { flexDirection: 'row', gap: spacing.sm },
  compareCol: { flex: 1, alignItems: 'center' },
  compareImage: { width: '100%', height: 200, borderRadius: borderRadius.md },
  compareDate: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  gridContent: { padding: spacing.md, paddingBottom: 100 },
  gridRow: { gap: spacing.sm, marginBottom: spacing.sm },
  photoItem: { flex: 1, borderRadius: borderRadius.md, overflow: 'hidden', position: 'relative', aspectRatio: 0.8 },
  photoItemSelected: { borderWidth: 2, borderColor: colors.primary },
  photoImage: { width: '100%', height: '100%' },
  checkCircle: { position: 'absolute', top: spacing.sm, right: spacing.sm, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.textPrimary },
  checkCircleSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  photoOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: spacing.xs },
  photoDate: { ...typography.tiny, color: colors.textPrimary, textAlign: 'center' },
  timelineContent: { padding: spacing.md, paddingBottom: 100 },
  timelineItem: { flexDirection: 'row', marginBottom: spacing.md },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, marginTop: 8, marginRight: spacing.sm },
  timelineLine: { position: 'absolute', left: 5, top: 20, bottom: -spacing.md, width: 2, backgroundColor: colors.border },
  timelineCard: { flex: 1, padding: spacing.sm },
  timelineImage: { width: '100%', height: 180, borderRadius: borderRadius.sm },
  timelineDate: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600', marginTop: spacing.xs },
  timelineNote: { ...typography.bodySmall, color: colors.textSecondary },
  timelineDelete: { marginTop: spacing.xs },
  deleteText: { ...typography.caption, color: colors.error },
  uploadBtn: { position: 'absolute', bottom: 24, left: spacing.md, right: spacing.md },
});
