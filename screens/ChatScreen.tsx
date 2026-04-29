import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { History } from 'lucide-react-native';
import { useChatContext } from '../context/ChatContext';
import { MessageItem } from '../components/MessageItem';
import { ChatInput } from '../components/ChatInput';
import type { StackParamList } from '../navigation/types';
import type { ChatMessage } from '../types/chat';

type ChatScreenNav = NativeStackNavigationProp<StackParamList, 'Chat'>;

export function ChatScreen() {
  const navigation = useNavigation<ChatScreenNav>();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    sessionId,
  } = useChatContext();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleExpandChart = (message: ChatMessage) => {
    if (message.chartHtml) {
      navigation.navigate('ChartDetail', {
        chartHtml: message.chartHtml,
        title: message.content?.slice(0, 30),
        records: message.records,
        columns: message.columns,
      });
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <MessageItem message={item} onExpandChart={handleExpandChart} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>C</Text>
          </View>
          <View>
            <Text style={styles.navTitle}>ChatBI</Text>
            <Text style={styles.navSubtitle}>AI 销售数据分析</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate('SessionList')}
        >
          <History size={22} color="#666" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={
          messages.length === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              开始对话，提出您的数据分析问题
            </Text>
          </View>
        }
      />

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
  },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  navTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  navSubtitle: { fontSize: 12, color: '#999' },
  historyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  errorBar: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorText: { fontSize: 13, color: '#dc2626' },
  messageList: { flex: 1 },
  emptyContainer: { flex: 1 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { fontSize: 14, color: '#999' },
});
