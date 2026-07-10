import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import Avatar from '../components/Avatar';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const [displayName, setDisplayName] = useState('John Doe');
  const [username, setUsername] = useState('johndoe');
  const [bio, setBio] = useState('Fitness enthusiast | Gym rat 🏋️');
  const [instagram, setInstagram] = useState('@johndoe_fit');
  const [twitter, setTwitter] = useState('@johndoe');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('72');
  const [goals, setGoals] = useState('Build muscle and improve endurance');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [coverUri, setCoverUri] = useState<string | null>(null);

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.title}>Edit Profile</Text>
          <Button title="Save" onPress={handleSave} />
        </View>

        <View style={styles.coverSection}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder} />
          )}
          <Pressable style={styles.coverOverlay} onPress={() => setCoverUri('https://picsum.photos/400/150')} accessibilityLabel="Change cover image">
            <Ionicons name="camera" size={20} color={colors.textPrimary} />
            <Text style={styles.coverText}>Change Cover</Text>
          </Pressable>
          <View style={styles.avatarContainer}>
            <Avatar name="JD" size={80} />
            <Pressable style={styles.avatarOverlay} onPress={() => setAvatarUri('https://picsum.photos/200')} accessibilityLabel="Change avatar">
              <Ionicons name="camera" size={18} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.inputLabel}>Display Name</Text>
          <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} placeholderTextColor={colors.textMuted} />

          <Text style={styles.inputLabel}>Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" placeholderTextColor={colors.textMuted} />

          <Text style={styles.inputLabel}>Bio</Text>
          <TextInput style={[styles.input, styles.textArea]} value={bio} onChangeText={setBio} multiline placeholderTextColor={colors.textMuted} />

          <Text style={styles.sectionLabel}>Social Links</Text>

          <Text style={styles.inputLabel}>Instagram</Text>
          <TextInput style={styles.input} value={instagram} onChangeText={setInstagram} placeholderTextColor={colors.textMuted} />

          <Text style={styles.inputLabel}>Twitter / X</Text>
          <TextInput style={styles.input} value={twitter} onChangeText={setTwitter} placeholderTextColor={colors.textMuted} />

          <Text style={styles.sectionLabel}>Body Stats</Text>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" placeholderTextColor={colors.textMuted} />
            </View>
            <View style={styles.half}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <Text style={styles.inputLabel}>Fitness Goals</Text>
          <TextInput style={[styles.input, styles.textArea]} value={goals} onChangeText={setGoals} multiline placeholderTextColor={colors.textMuted} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  cancelText: { ...typography.body, color: colors.textSecondary },
  title: { ...typography.h2, color: colors.textPrimary },
  coverSection: { height: 180, position: 'relative', marginBottom: 40 },
  coverImage: { width: '100%', height: 140 },
  coverPlaceholder: { width: '100%', height: 140, backgroundColor: colors.surfaceTertiary },
  coverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 140, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  coverText: { ...typography.bodySmall, color: colors.textPrimary },
  avatarContainer: { position: 'absolute', bottom: 0, left: spacing.md, zIndex: 1 },
  avatarOverlay: { position: 'absolute', bottom: 0, right: -4, backgroundColor: colors.primary, borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.background },
  formCard: { margin: spacing.md, padding: spacing.md },
  inputLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: '600', marginTop: spacing.sm },
  input: { backgroundColor: colors.surfaceTertiary, borderRadius: borderRadius.sm, padding: spacing.sm, ...typography.body, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  sectionLabel: { ...typography.h4, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
});
