import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LoadingIndicator } from './LoadingIndicator';
import { ChartCard } from './ChartCard';
import { MarkdownText } from './MarkdownText';
import { colors } from '../theme/colors';
import { animations } from '../theme/animations';
import type { ChatMessage } from '../types/chat';

type MessageItemProps = {
  message: ChatMessage;
  onExpandChart?: (message: ChatMessage) => void;
  index: number;
};

export function MessageItem({ message, onExpandChart, index }: MessageItemProps) {
  const isUser = message.role === 'user';
  const isLoading =
    message.phase &&
    message.phase !== 'done' &&
    message.phase !== 'error';
  const hasData =
    (message.records?.length ?? 0) > 0 || !!message.chartHtml;

  const slideAnim = useRef(new Animated.Value(isUser ? animations.messageSlideDistance : -animations.messageSlideDistance)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(animations.messageScaleFrom)).current;

  const staggerDelay = Math.min(index * 50, 200);

  useEffect(() => {
    const anims: Animated.CompositeAnimation[] = [
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animations.durationNormal,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: animations.durationNormal,
        useNativeDriver: true,
      }),
    ];

    if (isUser) {
      anims.push(
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animations.durationNormal,
          useNativeDriver: true,
        }),
      );
    }

    Animated.sequence([
      Animated.delay(staggerDelay),
      Animated.parallel(anims),
    ]).start();
  }, []);

  const userAnimatedStyle = {
    transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
    opacity: opacityAnim,
  };

  const assistantAnimatedStyle = {
    transform: [{ translateX: slideAnim }],
    opacity: opacityAnim,
  };

  if (isUser) {
    return (
      <Animated.View
        style={[
          styles.container,
          styles.containerUser,
          userAnimatedStyle,
        ]}
      >
        <LinearGradient
          colors={[colors.userBubbleFrom, colors.userBubbleTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.userBubble}
        >
          <Text style={styles.userText}>{message.content}</Text>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        styles.containerAssistant,
        assistantAnimatedStyle,
      ]}
    >
      <View style={styles.assistantContent}>
        {isLoading && <LoadingIndicator phase={message.phase} />}

        {message.content && !isLoading && (
          <View style={styles.assistantBubble}>
            <View style={styles.decorativeBar} />
            <View style={styles.assistantBubbleContent}>
              <MarkdownText>{message.content}</MarkdownText>
            </View>
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
            <View style={styles.decorativeBar} />
            <View style={styles.assistantBubbleContent}>
              <Text style={styles.placeholder}>...</Text>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  containerUser: {
    alignItems: 'flex-end',
  },
  containerAssistant: {
    alignItems: 'flex-start',
  },

  // User bubble
  userBubble: {
    borderRadius: 20,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderColor: colors.userBubbleBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '75%',
  },
  userText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },

  // Assistant
  assistantContent: {
    width: '92%',
    gap: 8,
  },
  assistantBubble: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.chartBorder,
    borderRadius: 20,
    borderTopLeftRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  decorativeBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: 10,
    alignSelf: 'stretch',
  },
  assistantBubbleContent: {
    flex: 1,
  },
  placeholder: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
