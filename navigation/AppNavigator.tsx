import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import type { StackParamList } from './types';
import { ChatScreen } from '../screens/ChatScreen';
import { SessionListScreen } from '../screens/SessionListScreen';
import { ChartDetailScreen } from '../screens/ChartDetailScreen';

const Stack = createStackNavigator<StackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Chat">
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SessionList"
          component={SessionListScreen}
          options={{
            title: '历史会话',
            headerTintColor: '#111',
            headerStyle: { backgroundColor: '#fff' },
          }}
        />
        <Stack.Screen
          name="ChartDetail"
          component={ChartDetailScreen}
          options={{
            title: '图表详情',
            headerTintColor: '#111',
            headerStyle: { backgroundColor: '#fff' },
          }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
