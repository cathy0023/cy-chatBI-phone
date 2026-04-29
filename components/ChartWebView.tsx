import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

type ChartWebViewProps = {
  html: string;
  height?: number;
};

export function ChartWebView({ html, height = 280 }: ChartWebViewProps) {
  return (
    <WebView
      source={{ html }}
      style={[styles.webview, { height }]}
      scrollEnabled={false}
      originWhitelist={['*']}
      javaScriptEnabled
      domStorageEnabled
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    borderRadius: 12,
    backgroundColor: '#fafafa',
  },
});
