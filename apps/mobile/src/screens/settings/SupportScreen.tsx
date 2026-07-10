import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ProfileStackParamList, 'SettingsSupport'>;

const faqs = [
  { question: 'How do I start a battle?', answer: 'Go to the Battle tab and tap "New Battle" to challenge a friend or join a public battle.' },
  { question: 'Can I change my username?', answer: 'Yes, go to Settings > Account to update your username.' },
  { question: 'How is my XP calculated?', answer: 'XP is earned by completing workouts, winning battles, and maintaining streaks.' },
  { question: 'Is my data secure?', answer: 'All data is encrypted in transit and at rest. We follow industry best practices for security.' },
  { question: 'How do I cancel my subscription?', answer: 'Go to Settings > Account > Subscription to manage or cancel your subscription.' },
];

export default function SupportScreen({ navigation }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Support" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>FAQ</Text>
          {faqs.map((faq, index) => (
            <View key={index}>
              <Pressable
                style={styles.faqRow}
                onPress={() => toggleFaq(index)}
                accessibilityRole="button"
                accessibilityLabel={faq.question}
                accessibilityState={{ expanded: expandedIndex === index }}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
              {expandedIndex === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
              {index < faqs.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Button title="Contact Support" variant="primary" onPress={() => {}} style={styles.supportButton} />
          <Button title="Send Feedback" variant="outline" onPress={() => {}} style={styles.supportButton} />
          <Button title="Report a Bug" variant="outline" onPress={() => {}} style={styles.supportButton} />
          <Button title="Feature Request" variant="outline" onPress={() => {}} style={styles.supportButton} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  card: { padding: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
  faqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  faqQuestion: { ...typography.body, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  faqAnswer: { ...typography.bodySmall, color: colors.textSecondary, paddingBottom: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border },
  supportButton: { marginBottom: spacing.sm },
});
