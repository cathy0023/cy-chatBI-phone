import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { getPhaseLabel, type LoadingPhase } from '../types/chat';

type LoadingIndicatorProps = {
  phase?: LoadingPhase;
};

export function LoadingIndicator({ phase }: LoadingIndicatorProps) {
  const label = getPhaseLabel(phase) || 'AI 正在分析数据...';

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#4F46E5" />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '500',
  },
});
