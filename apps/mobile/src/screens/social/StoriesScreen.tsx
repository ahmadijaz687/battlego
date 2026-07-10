import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { EmptyState } from '../../components/EmptyState';
import { useSocialStore } from '../../store/socialStore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Stories'>;

export default function StoriesScreen({ navigation }: Props) {
  const { stories, fetchStories, isLoading } = useSocialStore();
  const [activeStory, setActiveStory] = useState<string | null>(null);

  useEffect(() => { fetchStories(); }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Close">
          <Ionicons name="close" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Stories</Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.storyItem} onPress={() => setActiveStory(item.id)}>
              <PremiumCard variant="elevated" style={styles.storyPreview}>
                {item.image && <Image source={{ uri: item.image }} style={styles.storyImage} />}
                <Text style={styles.storyUser}>{item.userName}</Text>
              </PremiumCard>
            </Pressable>
          )}
          numColumns={2}
          contentContainerStyle={styles.grid}
          ListEmptyComponent={<EmptyState icon="📸" title="No stories" description="Stories from friends will appear here" />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  grid: { paddingBottom: spacing.md },
  storyItem: { flex: 1, aspectRatio: 1, margin: spacing.xs / 2 },
  storyPreview: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  storyImage: { flex: 1, backgroundColor: colors.surface },
  storyUser: { position: 'absolute', bottom: spacing.xs, left: spacing.xs, color: colors.background, fontWeight: '600' },
});