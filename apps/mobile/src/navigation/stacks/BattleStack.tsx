import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { BattleStackParamList } from '../../types/navigation';
import BattleScreen from '../../screens/BattleScreen';
import BattleLobbyScreen from '../../screens/BattleLobbyScreen';
import BattleSessionScreen from '../../screens/BattleSessionScreen';
import LeaderboardScreen from '../../screens/LeaderboardScreen';
import BattlePassScreen from '../../screens/BattlePassScreen';
import BattleCreateScreen from '../../screens/BattleCreateScreen';
import DiscoverBattlesScreen from '../../screens/DiscoverBattlesScreen';
import BattleDetailsScreen from '../../screens/BattleDetailsScreen';

const Stack = createNativeStackNavigator<BattleStackParamList>();

export function BattleStackNavigator() {
  return (
    <Stack.Navigator
      id="BattleStack"
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Battle" component={BattleScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BattleLobby" component={BattleLobbyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BattleSession" component={BattleSessionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BattlePass" component={BattlePassScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BattleCreate" component={BattleCreateScreen} options={{ title: 'Create Battle' }} />
      <Stack.Screen name="DiscoverBattles" component={DiscoverBattlesScreen} options={{ title: 'Discover Battles' }} />
      <Stack.Screen name="BattleDetails" component={BattleDetailsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
