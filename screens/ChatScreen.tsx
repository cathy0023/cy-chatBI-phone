import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatContext } from '../context/ChatContext';
import { EmptyState } from '../components/EmptyState';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { MessageItem } from '../components/MessageItem';
import { ChatInput } from '../components/ChatInput';
import { colors } from '../theme/colors';
import type { StackParamList } from '../navigation/types';
import type { ChatMessage } from '../types/chat';

type ChatScreenNav = NativeStackNavigationProp<StackParamList, 'Chat'>;

const LOGO_GRADIENT = [colors.primary, colors.secondary] as const;

export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ChatScreenNav>();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    sessionId,
  } = useChatContext();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    if (messages.length > 0) {
      // Wait for content + animations to finish before scrolling
      // MessageItem animations can take up to 300ms (stagger delay + duration)
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 400);
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

  const renderItem = ({ item, index }: { item: ChatMessage; index: number }) => (
    <MessageItem message={item} onExpandChart={handleExpandChart} index={index} />
  );

  return (
    <LinearGradient
      colors={[colors.backgroundDeep, colors.backgroundNight]}
      style={styles.root}
    >
      {/* Glassmorphism Nav Bar */}
      <View
        style={[
          styles.navBar,
          {
            paddingTop: insets.top,
            backgroundColor: colors.navBg,
            borderBottomColor: colors.navBorder,
          },
        ]}
      >
        <View style={styles.navLeft}>
          {/* Logo with gradient ring */}
          <View style={styles.logoOuter}>
            <LinearGradient
              colors={LOGO_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoRing}
            >
              <View style={styles.logoInner}>
                <Text style={styles.logoText}>C</Text>
              </View>
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.navTitle}>ChatBI</Text>
            <Text style={styles.navSubtitle}>AI 销售数据分析</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.historyBtn, { backgroundColor: colors.cardBg }]}
          onPress={() => navigation.navigate('SessionList')}
          activeOpacity={0.7}
        >
          <Feather name="history" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Error bar */}
      {error && (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Loading bar */}
      {isLoading && (
        <View style={styles.loadingBar}>
          <LoadingIndicator />
        </View>
      )}

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.messageArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          contentContainerStyle={
            messages.length === 0 ? styles.emptyContainer : styles.listContent
          }
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
        />
        <ChatInput onSend={sendMessage} />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoOuter: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRing: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  logoInner: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.backgroundDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  navSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  historyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBar: {
    backgroundColor: 'rgba(248,113,113,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(248,113,113,0.2)',
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
  },
  loadingBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.navBorder,
  },
  messageArea: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 12,
  },
});