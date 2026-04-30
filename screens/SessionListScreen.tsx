import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { SessionItem } from '../components/SessionItem';
import { useChatContext } from '../context/ChatContext';
import { getSessions, deleteSession } from '../services/api';
import { colors } from '../theme/colors';
import type { StackParamList } from '../navigation/types';
import type { SessionInfo } from '../types/chat';

type SessionListNav = NativeStackNavigationProp<StackParamList, 'SessionList'>;

export function SessionListScreen() {
  const navigation = useNavigation<SessionListNav>();
  const insets = useSafeAreaInsets();
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
      <LinearGradient
        colors={['#0B1120', '#0D1B3E']}
        style={StyleSheet.absoluteFill}
      />

      {/* Custom nav bar */}
      <View style={[styles.navBar, { paddingTop: insets.top }]}>
        <View style={styles.navContent}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>历史会话</Text>
        </View>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    backgroundColor: colors.navBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.navBorder,
  },
  navContent: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: { fontSize: 14, color: colors.textMuted },
});
