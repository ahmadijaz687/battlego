import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ProfileStackParamList, 'SettingsAbout'>;

export default function AboutScreen({ navigation }: Props) {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="About" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.appInfo}>
          <View style={styles.appIcon}>
            <Ionicons name="fitness" size={48} color={colors.primary} />
          </View>
          <Text style={styles.appName}>Fitness Battle</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.build}>Build 2026.07.01</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Developer</Text>
          <Text style={styles.devInfo}>Fitness Battle Team</Text>
          <Text style={styles.devInfo}>contact@fitnessbattle.app</Text>
        </Card>

        <Card style={styles.card}>
          <Button
            title="Licenses"
            variant="ghost"
            onPress={() => openLink('https://fitnessbattle.app/licenses')}
            style={styles.linkButton}
          />
          <View style={styles.divider} />
          <Button
            title="Privacy Policy"
            variant="ghost"
            onPress={() => openLink('https://fitnessbattle.app/privacy')}
            style={styles.linkButton}
          />
          <View style={styles.divider} />
          <Button
            title="Terms of Service"
            variant="ghost"
            onPress={() => openLink('https://fitnessbattle.app/terms')}
            style={styles.linkButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  appInfo: { alignItems: 'center', paddingVertical: spacing.xl },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appName: { ...typography.h2, color: colors.textPrimary },
  version: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  build: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  card: { padding: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
  devInfo: { ...typography.body, color: colors.textSecondary, marginBottom: 2 },
  linkButton: { justifyContent: 'flex-start' },
  divider: { height: 1, backgroundColor: colors.border },
});
