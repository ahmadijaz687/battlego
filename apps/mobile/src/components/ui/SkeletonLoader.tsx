import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  runOnJS,
  FadeIn,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing } from '../../theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius: radius = borderRadius.sm,
  style,
}: SkeletonLoaderProps) {
  const translateX = useSharedValue(-1);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, {
        duration: 1400,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
      }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(translateX.value, [-1, 1], [-200, 420]),
      },
    ],
  }));

  return (
    <View
      style={[
        styles.container,
        { width: width as any, height, borderRadius: radius },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    >
      <View style={[styles.base, { borderRadius: radius }]} />
      <Animated.View
        style={[
          styles.shimmer,
          { borderRadius: radius },
          shimmerStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 160,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});

export function ShimmerGroup({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[{ gap: spacing.sm }, style]}>
      {children}
    </View>
  );
}

function WorkoutCardSkeletonInner() {
  return (
    <View style={presetStyles.card}>
      <View style={presetStyles.cardHeader}>
        <SkeletonLoader width={48} height={48} borderRadius={borderRadius.lg} />
        <View style={presetStyles.cardHeaderText}>
          <SkeletonLoader width="70%" height={16} />
          <SkeletonLoader width="40%" height={12} style={{ marginTop: 6 }} />
        </View>
      </View>
      <View style={presetStyles.cardBody}>
        <SkeletonLoader width="100%" height={8} borderRadius={borderRadius.full} />
        <View style={presetStyles.cardStats}>
          <SkeletonLoader width={60} height={24} />
          <SkeletonLoader width={60} height={24} />
          <SkeletonLoader width={60} height={24} />
        </View>
      </View>
    </View>
  );
}

export function WorkoutCardSkeleton() {
  return (
    <Animated.View entering={FadeIn.duration(300)}>
      <WorkoutCardSkeletonInner />
    </Animated.View>
  );
}

function FeedPostSkeletonInner() {
  return (
    <View style={presetStyles.card}>
      <View style={presetStyles.cardHeader}>
        <SkeletonLoader width={40} height={40} borderRadius={20} />
        <View style={presetStyles.cardHeaderText}>
          <SkeletonLoader width="50%" height={14} />
          <SkeletonLoader width="30%" height={10} style={{ marginTop: 4 }} />
        </View>
      </View>
      <SkeletonLoader width="100%" height={180} borderRadius={borderRadius.md} style={{ marginVertical: spacing.sm }} />
      <SkeletonLoader width="90%" height={14} />
      <SkeletonLoader width="60%" height={14} style={{ marginTop: 6 }} />
      <View style={presetStyles.feedActions}>
        <SkeletonLoader width={60} height={32} borderRadius={borderRadius.full} />
        <SkeletonLoader width={60} height={32} borderRadius={borderRadius.full} />
        <SkeletonLoader width={60} height={32} borderRadius={borderRadius.full} />
      </View>
    </View>
  );
}

export function FeedPostSkeleton() {
  return (
    <Animated.View entering={FadeIn.duration(300)}>
      <FeedPostSkeletonInner />
    </Animated.View>
  );
}

function ProfileHeaderSkeletonInner() {
  return (
    <View style={presetStyles.profileHeader}>
      <SkeletonLoader width={88} height={88} borderRadius={44} />
      <SkeletonLoader width={140} height={20} style={{ marginTop: spacing.md }} />
      <SkeletonLoader width={100} height={14} style={{ marginTop: 6 }} />
      <View style={presetStyles.profileStats}>
        <View style={presetStyles.profileStatItem}>
          <SkeletonLoader width={50} height={24} />
          <SkeletonLoader width={40} height={10} style={{ marginTop: 4 }} />
        </View>
        <View style={presetStyles.profileStatItem}>
          <SkeletonLoader width={50} height={24} />
          <SkeletonLoader width={40} height={10} style={{ marginTop: 4 }} />
        </View>
        <View style={presetStyles.profileStatItem}>
          <SkeletonLoader width={50} height={24} />
          <SkeletonLoader width={40} height={10} style={{ marginTop: 4 }} />
        </View>
      </View>
    </View>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <Animated.View entering={FadeIn.duration(300)}>
      <ProfileHeaderSkeletonInner />
    </Animated.View>
  );
}

function BattleCardSkeletonInner() {
  return (
    <View style={presetStyles.card}>
      <View style={presetStyles.battleRow}>
        <SkeletonLoader width={56} height={56} borderRadius={28} />
        <View style={presetStyles.battleVs}>
          <SkeletonLoader width={36} height={36} borderRadius={18} />
        </View>
        <SkeletonLoader width={56} height={56} borderRadius={28} />
      </View>
      <SkeletonLoader width="80%" height={14} style={{ marginTop: spacing.md }} />
      <SkeletonLoader width="50%" height={12} style={{ marginTop: 6 }} />
      <SkeletonLoader width="100%" height={36} borderRadius={borderRadius.button} style={{ marginTop: spacing.md }} />
    </View>
  );
}

export function BattleCardSkeleton() {
  return (
    <Animated.View entering={FadeIn.duration(300)}>
      <BattleCardSkeletonInner />
    </Animated.View>
  );
}

function ListSkeletonInner({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[presetStyles.card, i > 0 && { marginTop: spacing.sm }]}>
          <View style={presetStyles.cardHeader}>
            <SkeletonLoader width={44} height={44} borderRadius={22} />
            <View style={presetStyles.cardHeaderText}>
              <SkeletonLoader width="65%" height={14} />
              <SkeletonLoader width="35%" height={10} style={{ marginTop: 4 }} />
            </View>
            <SkeletonLoader width={60} height={28} borderRadius={borderRadius.sm} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function ListSkeleton({ count }: { count?: number }) {
  return (
    <Animated.View entering={FadeIn.duration(300)}>
      <ListSkeletonInner count={count} />
    </Animated.View>
  );
}

const presetStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  cardBody: {
    marginTop: spacing.md,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  feedActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  profileStats: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.lg,
  },
  profileStatItem: {
    alignItems: 'center',
  },
  battleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  battleVs: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xs,
  },
});
