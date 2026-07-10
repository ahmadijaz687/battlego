import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius, motion } from '../theme';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { useWorkoutStore } from '../store/workoutStore';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutDetails'>;

export default function WorkoutDetailsScreen({ navigation, route }: Props) {
  const { templateId } = route.params;
  const { currentSession: session, isLoading, error, loadCurrentSession } = useWorkoutStore();

  useEffect(() => {
    loadCurrentSession();
  }, []);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(12)).current;
  const contentOpacities = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const contentTranslateYs = [
    useRef(new Animated.Value(12)).current,
    useRef(new Animated.Value(12)).current,
    useRef(new Animated.Value(12)).current,
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(headerTranslate, { toValue: 0, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
    [0, 1, 2].forEach((i) => {
      Animated.sequence([
        Animated.delay(i * 60),
        Animated.parallel([
          Animated.timing(contentOpacities[i], { toValue: 1, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(contentTranslateYs[i], { toValue: 0, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]),
      ]).start();
    });
  }, []);

  const handleStartWorkout = () => {
    navigation.navigate('WorkoutSession', { workoutId: templateId || 'new' });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !session) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load workout details</Text>
        <Button title="Go Back" variant="outline" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const exerciseCount = session.exercises?.length || 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslate }] }}>
          <View style={styles.imagePlaceholder}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
              style={styles.gradientOverlay}
            />
            <View style={styles.headerContent}>
              <Text style={styles.templateName}>{session.name}</Text>
              <Badge label={session.type} variant="warning" />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: contentOpacities[0], transform: [{ translateY: contentTranslateYs[0] }] }}>
          <Card variant="surface" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {session.type === 'strength' ? 'Strength-focused workout session.' : session.type === 'cardio' ? 'Cardio-focused workout session.' : 'Mixed workout session.'}
            </Text>
          </Card>
        </Animated.View>

        <Animated.View style={{ opacity: contentOpacities[1], transform: [{ translateY: contentTranslateYs[1] }] }}>
          <Card variant="surface" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Exercises ({exerciseCount})</Text>
            {session.exercises.map((ex, idx) => (
              <View key={ex.id || idx} style={styles.exerciseRow}>
                <Text style={styles.exerciseText}>Exercise {idx + 1}</Text>
                <Text style={styles.exerciseDetail}>{ex.sets?.length || 0} sets</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        <Animated.View style={{ opacity: contentOpacities[2], transform: [{ translateY: contentTranslateYs[2] }] }}>
          <Card variant="surface" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>Duration</Text>
              <Text style={styles.scheduleValue}>{session.duration || '30'} minutes</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>Type</Text>
              <Badge label={session.type} variant="warning" size="sm" />
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      <View style={styles.stickyFooter}>
        <Button title="Start Workout" variant="primary" onPress={handleStartWorkout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  imagePlaceholder: {
    height: 200,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  gradientOverlay: { flex: 1 },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  templateName: { ...typography.h2, color: colors.textPrimary },
  sectionCard: { marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  description: { color: colors.textSecondary, lineHeight: 22 },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseText: { color: colors.textPrimary, fontWeight: '600' },
  exerciseDetail: { color: colors.textMuted, fontSize: 12 },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  scheduleLabel: { color: colors.textSecondary },
  scheduleValue: { color: colors.textPrimary },
  stickyFooter: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.md },
  errorText: { ...typography.h3, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md },
});
