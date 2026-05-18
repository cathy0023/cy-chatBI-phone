import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ChartWebView } from './ChartWebView';
import { DataTable } from './DataTable';
import { colors } from '../theme/colors';

type ChartCardProps = {
  chartHtml?: string;
  records?: Record<string, unknown>[];
  columns?: string[];
  sql?: string;
  title?: string;
  onExpand?: () => void;
};

export function ChartCard({
  chartHtml,
  records,
  columns,
  sql,
  onExpand,
}: ChartCardProps) {
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const hasData = (records?.length ?? 0) > 0;
  const hasChart = !!chartHtml;

  return (
    <View style={styles.card}>
      {hasData && hasChart && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, view === 'chart' && styles.tabActive]}
            onPress={() => setView('chart')}
          >
            <Feather name="bar-chart-2" size={14} color={view === 'chart' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, view === 'chart' && styles.tabTextActive]}>
              图表
            </Text>
            {view === 'chart' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, view === 'table' && styles.tabActive]}
            onPress={() => setView('table')}
          >
            <Feather name="grid" size={14} color={view === 'table' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, view === 'table' && styles.tabTextActive]}>
              数据表
            </Text>
            {view === 'table' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>
      )}

      {/* 内嵌画布区域 — 深色背景让图表/表格有被包裹的层次感 */}
      <View style={styles.chartBody}>
        {view === 'chart' && hasChart && <ChartWebView html={chartHtml!} />}
        {(view === 'table' || !hasChart) &&
          hasData &&
          records &&
          columns && <DataTable records={records} columns={columns} />}
      </View>

      {(hasChart || hasData) && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {records ? `${records.length} 行数据` : ''}
          </Text>
          {onExpand && hasChart && (
            <TouchableOpacity onPress={onExpand} style={styles.expandBtn}>
              <Feather name="maximize" size={14} color={colors.primary} />
              <Text style={styles.expandText}>全屏查看</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.chartBg,
    borderWidth: 1,
    borderColor: colors.chartBorder,
    borderRadius: 16,
    overflow: 'hidden',
    maxWidth: '92%',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.chartBorder,
    backgroundColor: colors.chartBg,
    gap: 6,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  tabActive: { backgroundColor: colors.chartTabActive },
  tabIndicator: {
    position: 'absolute',
    bottom: -9,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: colors.primary,
  },
  tabText: { fontSize: 11, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '500' },
  chartBody: {
    backgroundColor: colors.chartAreaBg,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.chartBorder,
  },
  footerText: { fontSize: 11, color: colors.textMuted },
  expandBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expandText: { fontSize: 11, color: colors.primary, fontWeight: '500' },
});
