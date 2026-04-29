import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import type { SessionInfo } from '../types/chat';

type SessionItemProps = {
  session: SessionInfo;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}小时前`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}天前`;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function SessionItem({
  session,
  isActive,
  onSelect,
  onDelete,
}: SessionItemProps) {
  const handleDelete = () => {
    Alert.alert('删除对话', '确定删除此对话？此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => onDelete(session.id),
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.card, isActive && styles.cardActive]}
      onPress={() => onSelect(session.id)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {session.title || `对话 (${session.message_count} 条消息)`}
        </Text>
        <Text style={styles.meta}>
          {session.message_count} 条消息 · {formatDate(session.created_at)}
        </Text>
      </View>
      {isActive && (
        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>当前</Text>
        </View>
      )}
      <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
        <Trash2 size={16} color="#ccc" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  cardActive: { borderLeftColor: '#4F46E5' },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: '#111' },
  meta: { fontSize: 12, color: '#999', marginTop: 4 },
  activeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  activeBadgeText: { fontSize: 11, color: '#4F46E5', fontWeight: '600' },
  deleteBtn: { padding: 8 },
});
