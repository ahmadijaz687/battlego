import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SocialStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<SocialStackParamList, 'CreatePost'>;

const visibilityOptions = ['Public', 'Friends', 'Private'] as const;

export default function CreatePostScreen({ navigation }: Props) {
  const [caption, setCaption] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<typeof visibilityOptions[number]>('Public');
  const [attachments, setAttachments] = useState<string[]>([]);

  const canPost = caption.trim().length > 0;

  const handlePickImage = () => {
    setImageUri('https://picsum.photos/400/300');
  };

  const handleTakePhoto = () => {
    setImageUri('https://picsum.photos/400/301');
  };

  const toggleAttachment = (type: string) => {
    setAttachments((prev) => prev.includes(type) ? prev.filter((a) => a !== type) : [...prev, type]);
  };

  const handlePost = () => {
    navigation.goBack();
  };

  const attachmentOptions = [
    { key: 'workout', label: 'Workout', icon: 'fitness' },
    { key: 'meal', label: 'Meal', icon: 'restaurant' },
    { key: 'battle', label: 'Battle', icon: 'trophy' },
  ] as const;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Cancel">
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.title}>Create Post</Text>
          <Button title="Post" disabled={!canPost} onPress={handlePost} />
        </View>

        <TextField
          value={caption}
          onChangeText={setCaption}
          placeholder="What's on your mind?"
          multiline
          containerStyle={styles.captionField}
          style={styles.captionInput}
        />

        {imageUri && (
          <Card style={styles.imagePreview}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
            <Pressable style={styles.removeImage} onPress={() => setImageUri(null)} accessibilityLabel="Remove image">
              <Ionicons name="close-circle" size={24} color={colors.error} />
            </Pressable>
          </Card>
        )}

        <View style={styles.imageActions}>
          <Pressable style={styles.imageBtn} onPress={handlePickImage}>
            <Ionicons name="images" size={22} color={colors.primary} />
            <Text style={styles.imageBtnText}>Gallery</Text>
          </Pressable>
          <Pressable style={styles.imageBtn} onPress={handleTakePhoto}>
            <Ionicons name="camera" size={22} color={colors.primary} />
            <Text style={styles.imageBtnText}>Camera</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Attachments</Text>
        <View style={styles.attachmentRow}>
          {attachmentOptions.map((opt) => (
            <Pressable
              key={opt.key}
              style={[styles.attachmentChip, attachments.includes(opt.key) && styles.attachmentChipActive]}
              onPress={() => toggleAttachment(opt.key)}
            >
              <Ionicons name={opt.icon as any} size={18} color={attachments.includes(opt.key) ? colors.textInverse : colors.textSecondary} />
              <Text style={[styles.attachmentText, attachments.includes(opt.key) && styles.attachmentTextActive]}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Visibility</Text>
        <View style={styles.visibilityRow}>
          {visibilityOptions.map((v) => (
            <Pressable
              key={v}
              style={[styles.visibilityChip, visibility === v && styles.visibilityChipActive]}
              onPress={() => setVisibility(v)}
            >
              <Ionicons
                name={v === 'Public' ? 'globe' : v === 'Friends' ? 'people' : 'lock-closed'}
                size={16}
                color={visibility === v ? colors.textInverse : colors.textSecondary}
              />
              <Text style={[styles.visibilityText, visibility === v && styles.visibilityTextActive, { marginLeft: 4 }]}>{v}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  cancelText: { ...typography.body, color: colors.textSecondary },
  title: { ...typography.h2, color: colors.textPrimary },
  captionField: { marginBottom: spacing.md },
  captionInput: { minHeight: 120, textAlignVertical: 'top' },
  imagePreview: { padding: spacing.xs, marginBottom: spacing.md, position: 'relative' },
  previewImage: { width: '100%', height: 200, borderRadius: borderRadius.md },
  removeImage: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  imageActions: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  imageBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border },
  imageBtnText: { ...typography.bodySmall, color: colors.textSecondary },
  sectionLabel: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600', marginBottom: spacing.sm },
  attachmentRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  attachmentChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  attachmentChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  attachmentText: { ...typography.bodySmall, color: colors.textSecondary },
  attachmentTextActive: { color: colors.textInverse },
  visibilityRow: { flexDirection: 'row', gap: spacing.sm },
  visibilityChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  visibilityChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  visibilityText: { ...typography.bodySmall, color: colors.textSecondary },
  visibilityTextActive: { color: colors.textInverse },
});
