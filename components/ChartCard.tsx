import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BarChart3, Table2, Maximize2 } from 'lucide-react-native';
import { ChartWebView } from './ChartWebView';
import { DataTable } from './DataTable';

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
            <BarChart3 size={14} color={view === 'chart' ? '#4F46E5' : '#888'} />
            <Text style={[styles.tabText, view === 'chart' && styles.tabTextActive]}>
              图表
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, view === 'table' && styles.tabActive]}
            onPress={() => setView('table')}
          >
            <Table2 size={14} color={view === 'table' ? '#4F46E5' : '#888'} />
            <Text style={[styles.tabText, view === 'table' && styles.tabTextActive]}>
              数据表
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {view === 'chart' && hasChart && <ChartWebView html={chartHtml!} />}

      {(view === 'table' || !hasChart) &&
        hasData &&
        records &&
        columns && <DataTable records={records} columns={columns} />}

      {(hasChart || hasData) && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {records ? `${records.length} 行数据` : ''}
          </Text>
          {onExpand && hasChart && (
            <TouchableOpacity onPress={onExpand} style={styles.expandBtn}>
              <Maximize2 size={14} color="#4F46E5" />
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
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
    borderRadius: 14,
    overflow: 'hidden',
    maxWidth: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
    gap: 6,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  tabActive: { backgroundColor: '#EEF2FF' },
  tabText: { fontSize: 11, color: '#888' },
  tabTextActive: { color: '#4F46E5', fontWeight: '500' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#f0f0f0',
  },
  footerText: { fontSize: 11, color: '#bbb' },
  expandBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expandText: { fontSize: 11, color: '#4F46E5', fontWeight: '500' },
});
