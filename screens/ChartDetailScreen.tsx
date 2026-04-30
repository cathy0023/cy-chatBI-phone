import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { ChartWebView } from '../components/ChartWebView';
import { DataTable } from '../components/DataTable';
import { colors } from '../theme/colors';
import type { StackParamList } from '../navigation/types';

type ChartDetailRoute = RouteProp<StackParamList, 'ChartDetail'>;
type ChartDetailNav = StackNavigationProp<StackParamList, 'ChartDetail'>;

type ChartDetailProps = {
  route: ChartDetailRoute;
  navigation: ChartDetailNav;
};

export function ChartDetailScreen({ route, navigation }: ChartDetailProps) {
  const { chartHtml, records, columns } = route.params;
  const [showData, setShowData] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#0B1120', '#0D1B3E']}
      style={styles.container}
    >
      {/* Custom nav bar */}
      <View style={[styles.navBar, { paddingTop: insets.top }]}>
        <View style={styles.navContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>图表详情</Text>
        </View>
      </View>

      {/* Chart area */}
      <View style={styles.chartContainer}>
        <ChartWebView html={chartHtml} height={400} />
      </View>

      {/* Data toggle */}
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

      {/* Data area */}
      {showData && records && columns && (
        <View style={styles.dataArea}>
          <DataTable records={records} columns={columns} />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    backgroundColor: colors.navBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.navBorder,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 12,
  },
  backButton: {
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
  chartContainer: {
    flex: 1,
    padding: 16,
  },
  dataToggle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.chartBg,
    borderTopWidth: 0.5,
    borderTopColor: colors.navBorder,
  },
  dataToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dataArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
