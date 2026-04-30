import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';

const COLUMN_LABELS: Record<string, string> = {
  name: '姓名',
  department: '部门',
  month: '月份',
  wechat_added: '加微',
  interaction: '互动',
  demand: '需求',
  deal: '成交',
};

type DataTableProps = {
  records: Record<string, unknown>[];
  columns: string[];
};

const PAGE_SIZE = 20;

export function DataTable({ records, columns }: DataTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const paged = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View>
          <View style={styles.row}>
            {columns.map((col) => (
              <View key={col} style={styles.headerCell}>
                <Text style={styles.headerText}>
                  {COLUMN_LABELS[col] || col}
                </Text>
              </View>
            ))}
          </View>
          {paged.map((row, i) => (
            <View
              key={i}
              style={[styles.row, i % 2 === 0 && styles.rowEven]}
            >
              {columns.map((col) => (
                <View key={col} style={styles.cell}>
                  <Text
                    style={[
                      styles.cellText,
                      col === 'deal' && styles.cellBold,
                    ]}
                    numberOfLines={1}
                  >
                    {String(row[col] ?? '')}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <Text style={styles.pageInfo}>
            共 {records.length} 条，第 {page}/{totalPages} 页
          </Text>
          <View style={styles.pageButtons}>
            <TouchableOpacity
              disabled={page <= 1}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
            >
              <Text
                style={[
                  styles.pageBtnText,
                  page <= 1 && styles.pageBtnTextDisabled,
                ]}
              >
                上一页
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={page >= totalPages}
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={[
                styles.pageBtn,
                page >= totalPages && styles.pageBtnDisabled,
              ]}
            >
              <Text
                style={[
                  styles.pageBtnText,
                  page >= totalPages && styles.pageBtnTextDisabled,
                ]}
              >
                下一页
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: colors.chartBorder },
  rowEven: { backgroundColor: colors.chartRowAlt },
  headerCell: { paddingHorizontal: 12, paddingVertical: 8, minWidth: 70, backgroundColor: colors.chartHeaderBg },
  headerText: { fontSize: 12, fontWeight: '500', color: colors.primary },
  cell: { paddingHorizontal: 12, paddingVertical: 6, minWidth: 70 },
  cellText: { fontSize: 12, color: colors.textPrimary },
  cellBold: { fontWeight: '600', color: colors.primary },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: colors.chartBorder,
    marginTop: 4,
  },
  pageInfo: { fontSize: 11, color: colors.textMuted },
  pageButtons: { flexDirection: 'row', gap: 6 },
  pageBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, borderWidth: 0.5, borderColor: colors.border },
  pageBtnDisabled: { opacity: 0.4 },
  pageBtnText: { fontSize: 11, color: colors.textPrimary },
  pageBtnTextDisabled: { color: colors.textMuted },
});
