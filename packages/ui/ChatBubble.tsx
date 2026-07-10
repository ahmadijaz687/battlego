import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface ChatBubbleProps {
  message: string
  isUser: boolean
  timestamp: string
  senderName?: string
}

const colors = {
  primary: '#6C63FF',
  white: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  surface: '#F5F5F5',
}

function ChatBubble({ message, isUser, timestamp, senderName }: ChatBubbleProps) {
  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      {!isUser && senderName ? (
        <Text style={styles.senderName}>{senderName}</Text>
      ) : null}
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.otherBubble,
        ]}
      >
        <Text style={[styles.message, isUser && { color: colors.white }]}>
          {message}
        </Text>
      </View>
      <Text style={[styles.timestamp, isUser && { textAlign: 'right' }]}>
        {timestamp}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  message: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    marginHorizontal: 4,
  },
})

export default React.memo(ChatBubble)
