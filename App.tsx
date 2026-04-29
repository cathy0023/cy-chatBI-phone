import 'react-native-gesture-handler';
import React from 'react';
import { ChatProvider } from './context/ChatContext';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <ChatProvider>
      <AppNavigator />
    </ChatProvider>
  );
}
