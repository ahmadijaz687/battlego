import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AIStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AIStackParamList, 'AIBodyAnalysis'>;

interface AnalysisResult {
  bodyFat: number;
  muscleSymmetry: number;
  postureScore: number;
  suggestions: string[];
}

export default function AIBodyAnalysisScreen({ navigation }: Props) {
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [sidePhoto, setSidePhoto] = useState<string | null>(null);
  const [backPhoto, setBackPhoto] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handlePickPhoto = (position: 'front' | 'side' | 'back') => {
    const uri = `https://picsum.photos/400/600?${position}`;
    if (position === 'front') setFrontPhoto(uri);
    else if (position === 'side') setSidePhoto(uri);
    else setBackPhoto(uri);
  };

  const handleAnalyze = () => {
    setProcessing(true);
    setTimeout(() => {
      setResult({
        bodyFat: 18.5,
        muscleSymmetry: 82,
        postureScore: 74,
        suggestions: [
          'Focus on upper back development for better posture',
          'Increase hamstring and glute work for lower body balance',
          'Consider adding more pulling exercises to even out push/pull ratio',
          'Incorporate core stability work for improved midline control',
        ],
      });
      setProcessing(false);
    }, 2000);
  };

  const hasPhotos = !!frontPhoto || !!sidePhoto || !!backPhoto;

  const renderPhotoSlot = (label: string, position: 'front' | 'side' | 'back', photo: string | null) => (
    <Pressable style={styles.photoSlot} onPress={() => handlePickPhoto(position)}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.photoImage} resizeMode="cover" />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Ionicons name="camera" size={28} color={colors.textMuted} />
          <Text style={styles.photoLabel}>{label}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Body Analysis</Text>
        </View>

        <Text style={styles.instruction}>Upload photos for AI-powered body composition analysis</Text>

        <View style={styles.photoGrid}>
          {renderPhotoSlot('Front', 'front', frontPhoto)}
          {renderPhotoSlot('Side', 'side', sidePhoto)}
          {renderPhotoSlot('Back', 'back', backPhoto)}
        </View>

        <View style={styles.actionRow}>
          <Button
            title="From Gallery"
            variant="outline"
            style={styles.actionBtn}
            onPress={() => { setFrontPhoto('https://picsum.photos/400/600?front'); }}
          />
          <Button
            title="Take Photo"
            variant="outline"
            style={styles.actionBtn}
            onPress={() => { setFrontPhoto('https://picsum.photos/400/600?front'); }}
          />
        </View>

        {hasPhotos && !processing && !result && (
          <Button title="Analyze My Body" style={styles.analyzeBtn} onPress={handleAnalyze} />
        )}

        {processing && (
          <Card style={styles.processingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingText}>Analyzing your photos...</Text>
            <Text style={styles.processingSub}>AI is estimating body composition</Text>
          </Card>
        )}

        {result && (
          <View>
            <Card style={styles.resultCard}>
              <Text style={styles.sectionTitle}>Analysis Results</Text>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Estimated Body Fat</Text>
                <Text style={[styles.resultValue, { color: colors.accentOrange }]}>{result.bodyFat}%</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Muscle Symmetry</Text>
                <View style={styles.scoreRow}>
                  <View style={styles.scoreBarBg}>
                    <View style={[styles.scoreBarFill, { width: `${result.muscleSymmetry}%`, backgroundColor: result.muscleSymmetry > 80 ? colors.success : colors.accentOrange }]} />
                  </View>
                  <Text style={styles.scoreText}>{result.muscleSymmetry}%</Text>
                </View>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Posture Score</Text>
                <View style={styles.scoreRow}>
                  <View style={styles.scoreBarBg}>
                    <View style={[styles.scoreBarFill, { width: `${result.postureScore}%`, backgroundColor: result.postureScore > 80 ? colors.success : colors.accentOrange }]} />
                  </View>
                  <Text style={styles.scoreText}>{result.postureScore}%</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.suggestionsCard}>
              <Text style={styles.sectionTitle}>Suggestions</Text>
              {result.suggestions.map((s, i) => (
                <View key={i} style={styles.suggestionRow}>
                  <Ionicons name="bulb" size={16} color={colors.accentYellow} />
                  <Text style={styles.suggestionText}>{s}</Text>
                </View>
              ))}
            </Card>

            <Button title="Analyze Again" variant="outline" style={styles.againBtn} onPress={() => setResult(null)} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary },
  instruction: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.lg },
  photoGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  photoSlot: { flex: 1, aspectRatio: 0.5, borderRadius: borderRadius.md, overflow: 'hidden', backgroundColor: colors.surfaceTertiary },
  photoImage: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.xs },
  photoLabel: { ...typography.caption, color: colors.textMuted },
  actionRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  actionBtn: { flex: 1 },
  analyzeBtn: { marginBottom: spacing.lg },
  processingCard: { padding: spacing.xl, alignItems: 'center', marginBottom: spacing.md },
  processingText: { ...typography.body, color: colors.textPrimary, marginTop: spacing.md },
  processingSub: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  resultCard: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  resultLabel: { ...typography.bodySmall, color: colors.textSecondary, flex: 1 },
  resultValue: { ...typography.body, fontWeight: '700' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  scoreBarBg: { flex: 1, height: 6, backgroundColor: colors.surfaceTertiary, borderRadius: 3, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 3 },
  scoreText: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '700', width: 40, textAlign: 'right' },
  suggestionsCard: { padding: spacing.md, marginBottom: spacing.md },
  suggestionRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'flex-start' },
  suggestionText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1 },
  againBtn: { marginTop: spacing.sm },
});
