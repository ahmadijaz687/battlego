import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { HomeStackParamList } from '../../types/navigation';
import HomeScreen from '../../screens/HomeScreen';
import NotificationsScreen from '../../screens/social/NotificationsScreen';
import AchievementsScreen from '../../screens/AchievementsScreen';
import LeaderboardScreen from '../../screens/LeaderboardScreen';
import AnalyticsScreen from '../../screens/AnalyticsScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      id="HomeStack"
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: 'Achievements' }} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
    </Stack.Navigator>
  );
}
