import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoadingIndicator } from './LoadingIndicator';
import { ChartCard } from './ChartCard';
import type { ChatMessage } from '../types/chat';

type MessageItemProps = {
  message: ChatMessage;
  onExpandChart?: (message: ChatMessage) => void;
};

export function MessageItem({ message, onExpandChart }: MessageItemProps) {
  const isUser = message.role === 'user';
  const isLoading =
    message.phase &&
    message.phase !== 'done' &&
    message.phase !== 'error';
  const hasData =
    (message.records?.length ?? 0) > 0 || !!message.chartHtml;

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.containerUser : styles.containerAssistant,
      ]}
    >
      {isUser && (
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.content}</Text>
        </View>
      )}

      {!isUser && (
        <View style={styles.assistantContent}>
          {isLoading && <LoadingIndicator phase={message.phase} />}

          {message.content && !isLoading && (
            <View style={styles.assistantBubble}>
              <Text style={styles.assistantText}>{message.content}</Text>
            </View>
          )}

          {hasData && message.phase === 'done' && (
            <ChartCard
              chartHtml={message.chartHtml}
              records={message.records}
              columns={message.columns}
              sql={message.sql}
              onExpand={
                onExpandChart ? () => onExpandChart(message) : undefined
              }
            />
          )}

          {!message.content && !isLoading && !hasData && (
            <View style={styles.assistantBubble}>
              <Text style={styles.placeholder}>...</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  containerUser: { alignItems: 'flex-end' },
  containerAssistant: { alignItems: 'flex-start' },
  userBubble: {
    backgroundColor: '#4F46E5',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '75%',
  },
  userText: { fontSize: 15, color: '#fff', lineHeight: 22 },
  assistantContent: {
    maxWidth: '85%',
    gap: 8,
  },
  assistantBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  assistantText: { fontSize: 14, color: '#333', lineHeight: 22 },
  placeholder: { fontSize: 14, color: '#999' },
});
