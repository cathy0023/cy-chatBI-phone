import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import { SessionItem } from '../components/SessionItem';
import { useChatContext } from '../context/ChatContext';
import { getSessions, deleteSession } from '../services/api';
import type { StackParamList } from '../navigation/types';
import type { SessionInfo } from '../types/chat';

type SessionListNav = NativeStackNavigationProp<StackParamList, 'SessionList'>;

export function SessionListScreen() {
  const navigation = useNavigation<SessionListNav>();
  const { sessionId, loadSessionMessages, clearMessages } =
    useChatContext();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);

  const loadSessions = useCallback(async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch {
      // ignore
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions]),
  );

  const handleSelect = async (id: string) => {
    await loadSessionMessages(id);
    navigation.navigate('Chat');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (sessionId === id) {
        clearMessages();
      }
    } catch {
      // ignore
    }
  };

  const handleNew = () => {
    clearMessages();
    navigation.navigate('Chat');
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleNew} style={styles.newBtn}>
          <Plus size={16} color="#4F46E5" />
          <Text style={styles.newBtnText}>新建</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: SessionInfo }) => (
    <SessionItem
      session={item}
      isActive={sessionId === item.id}
      onSelect={handleSelect}
      onDelete={handleDelete}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>暂无对话历史</Text>
          </View>
        }
      />
      <Text style={styles.footerHint}>最多保留 20 个会话</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: { fontSize: 14, color: '#999' },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newBtnText: { fontSize: 14, color: '#4F46E5', fontWeight: '600' },
  footerHint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#ccc',
    paddingVertical: 14,
    paddingBottom: 32,
  },
});
