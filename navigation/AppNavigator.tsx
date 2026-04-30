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
      <Stack.Navigator
        initialRouteName="Chat"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0B1120' },
        }}
      >
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
        />
        <Stack.Screen
          name="SessionList"
          component={SessionListScreen}
        />
        <Stack.Screen
          name="ChartDetail"
          component={ChartDetailScreen}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
