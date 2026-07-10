import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { MainTabParamList } from '../types/navigation';
import { HomeStackNavigator } from './stacks/HomeStack';
import { WorkoutStackNavigator } from './stacks/WorkoutStack';
import { BattleStackNavigator } from './stacks/BattleStack';
import { NutritionStackNavigator } from './stacks/NutritionStack';
import { SocialStackNavigator } from './stacks/SocialStack';
import { AIStackNavigator } from './stacks/AIStack';
import { ProfileStackNavigator } from './stacks/ProfileStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<string, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
  HomeTab: { focused: 'home', unfocused: 'home-outline' },
  WorkoutTab: { focused: 'barbell', unfocused: 'barbell-outline' },
  BattleTab: { focused: 'flash', unfocused: 'flash-outline' },
  NutritionTab: { focused: 'nutrition', unfocused: 'nutrition-outline' },
  SocialTab: { focused: 'people', unfocused: 'people-outline' },
  AITab: { focused: 'chatbubbles', unfocused: 'chatbubbles-outline' },
  ProfileTab: { focused: 'person', unfocused: 'person-outline' },
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      id="MainTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          const icons = tabIcons[route.name];
          return (
            <Ionicons
              name={focused ? icons.focused : icons.unfocused}
              size={size}
              color={focused ? colors.primary : colors.textMuted}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.navigation,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          ...typography.tiny,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="WorkoutTab" component={WorkoutStackNavigator} options={{ tabBarLabel: 'Workout' }} />
      <Tab.Screen name="BattleTab" component={BattleStackNavigator} options={{ tabBarLabel: 'Battle' }} />
      <Tab.Screen name="NutritionTab" component={NutritionStackNavigator} options={{ tabBarLabel: 'Nutrition' }} />
      <Tab.Screen name="SocialTab" component={SocialStackNavigator} options={{ tabBarLabel: 'Social' }} />
      <Tab.Screen name="AITab" component={AIStackNavigator} options={{ tabBarLabel: 'AI' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}
