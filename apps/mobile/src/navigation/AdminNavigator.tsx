import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { AdminStackParamList } from '../types/navigation';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminWorkoutsScreen from '../screens/admin/AdminWorkoutsScreen';
import AdminExercisesScreen from '../screens/admin/AdminExercisesScreen';
import AdminFoodsScreen from '../screens/admin/AdminFoodsScreen';
import AdminBattlesScreen from '../screens/admin/AdminBattlesScreen';
import AdminReportsScreen from '../screens/admin/AdminReportsScreen';
import AdminLogsScreen from '../screens/admin/AdminLogsScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminNavigator() {
  return (
    <Stack.Navigator
      id="AdminStack"
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin' }} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Users' }} />
      <Stack.Screen name="AdminWorkouts" component={AdminWorkoutsScreen} options={{ title: 'Workouts' }} />
      <Stack.Screen name="AdminExercises" component={AdminExercisesScreen} options={{ title: 'Exercises' }} />
      <Stack.Screen name="AdminFoods" component={AdminFoodsScreen} options={{ title: 'Foods' }} />
      <Stack.Screen name="AdminBattles" component={AdminBattlesScreen} options={{ title: 'Battles' }} />
      <Stack.Screen name="AdminReports" component={AdminReportsScreen} options={{ title: 'Reports' }} />
      <Stack.Screen name="AdminLogs" component={AdminLogsScreen} options={{ title: 'Logs' }} />
    </Stack.Navigator>
  );
}
