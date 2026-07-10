import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Modal } from './Modal';
import { Button } from './Button';
import { colors, spacing, typography, borderRadius } from '../theme';

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  style?: ViewStyle;
}

export function Dialog({
  visible,
  onClose,
  title,
  description,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel,
  style,
}: DialogProps) {
  return (
    <Modal visible={visible} onClose={onClose} style={style}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        <View style={styles.actions}>
          {cancelLabel && <Button title={cancelLabel} variant="ghost" onPress={onClose} />}
          <Button title={confirmLabel} onPress={onConfirm} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  description: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
});