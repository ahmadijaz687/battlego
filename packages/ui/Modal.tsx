import React, { ReactNode } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal as RNModal } from 'react-native'

interface ModalProps {
  isVisible: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  actions?: ReactNode
}

const colors = {
  overlay: 'rgba(0,0,0,0.5)',
  white: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  primary: '#6C63FF',
}

function Modal({ isVisible, onClose, title, children, actions }: ModalProps) {
  return (
    <RNModal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.content}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <View style={styles.body}>{children}</View>
          {actions ? <View style={styles.actions}>{actions}</View> : null}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  body: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
})

export default React.memo(Modal)
