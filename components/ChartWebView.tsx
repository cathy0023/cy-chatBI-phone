import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { API_BASE } from '../constants/api';
import { colors } from '../theme/colors';

type ChartWebViewProps = {
  html: string;
  height?: number;
};

export function ChartWebView({ html, height = 280 }: ChartWebViewProps) {
  // Fix: replace percentage-based heights with explicit pixel value
  // Handle both "height:100%" and "height: 100%" (with/without spaces)
  const fixedHtml = html
    .replace(/html\s*,\s*body\s*\{[^}]*height\s*:\s*100%/g, (match) =>
      match.replace(/height\s*:\s*100%/, `height:${height}px`)
    )
    .replace(/#chart\s*\{[^}]*height\s*:\s*100%/g, (match) =>
      match.replace(/height\s*:\s*100%/, `height:${height}px`)
    );

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        source={{ html: fixedHtml, baseUrl: `${API_BASE}/` }}
        style={styles.webview}
        scrollEnabled={false}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        mixedContentMode="always"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
});
