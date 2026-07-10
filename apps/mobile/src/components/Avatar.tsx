import React from 'react';
import { View, Image as RNImage, Text, StyleSheet } from 'react-native';
import { colors, componentSize } from '../theme';

interface AvatarProps {
  size?: keyof typeof componentSize.avatar | number;
  uri?: string;
  name?: string;
  online?: boolean;
  showOnlineIndicator?: boolean;
}

function getSize(size: keyof typeof componentSize.avatar | number): number {
  if (typeof size === 'number') return size;
  return componentSize.avatar[size] || componentSize.avatar.md;
}

function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0]?.substring(0, 2).toUpperCase() || '';
}

function Avatar({ size = 'md', uri, name, online = false, showOnlineIndicator = false }: AvatarProps) {
  const dimension = getSize(size);
  const initials = getInitials(name);
  const onlineDotSize = Math.max(dimension * 0.28, 8);
  const label = name || 'User avatar';

  return (
    <View style={[styles.container, { width: dimension, height: dimension }]} accessible accessibilityLabel={label}>
      {uri ? (
        <RNImage
          source={{ uri }}
          style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
          accessibilityLabel={label}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: dimension, height: dimension, borderRadius: dimension / 2 },
          ]}
          accessible
          accessibilityLabel={label}
        >
          {initials ? (
            <Text style={[styles.initials, { fontSize: dimension * 0.38 }]}>{initials}</Text>
          ) : (
            <RNImage
              source={require('../../assets/icon.png')}
              style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
              accessibilityLabel={label}
            />
          )}
        </View>
      )}
      {showOnlineIndicator && (
        <View
          style={[
            styles.onlineDot,
            {
              width: onlineDotSize,
              height: onlineDotSize,
              borderRadius: onlineDotSize / 2,
              right: 0,
              bottom: 0,
              backgroundColor: online ? colors.statusActive : colors.statusInactive,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'visible', position: 'relative' },
  fallback: { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  initials: { color: '#FFFFFF', fontWeight: '700' },
  onlineDot: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.background,
  },
});

export default React.memo(Avatar);
