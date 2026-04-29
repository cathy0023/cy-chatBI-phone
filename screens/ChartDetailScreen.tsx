import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { ChartWebView } from '../components/ChartWebView';
import { DataTable } from '../components/DataTable';
import type { StackParamList } from '../navigation/types';

type ChartDetailRoute = RouteProp<StackParamList, 'ChartDetail'>;

type ChartDetailProps = {
  route: ChartDetailRoute;
};

export function ChartDetailScreen({ route }: ChartDetailProps) {
  const { chartHtml, records, columns } = route.params;
  const [showData, setShowData] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.chartArea}>
        <ChartWebView html={chartHtml} height={400} />
      </View>

      {records && columns && records.length > 0 && (
        <TouchableOpacity
          style={styles.dataToggle}
          onPress={() => setShowData(!showData)}
        >
          <Text style={styles.dataToggleText}>
            数据明细 {showData ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      )}

      {showData && records && columns && (
        <View style={styles.dataArea}>
          <DataTable records={records} columns={columns} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chartArea: { padding: 16 },
  dataToggle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e5e5',
  },
  dataToggleText: { fontSize: 13, fontWeight: '600', color: '#333' },
  dataArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
