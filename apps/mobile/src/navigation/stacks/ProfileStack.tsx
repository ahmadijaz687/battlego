import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { ProfileStackParamList } from '../../types/navigation';
import ProfileScreen from '../../screens/ProfileScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import SettingsThemeScreen from '../../screens/settings/ThemeScreen';
import SettingsLanguageScreen from '../../screens/settings/LanguageScreen';
import SettingsNotificationsScreen from '../../screens/settings/NotificationsScreen';
import SettingsPrivacyScreen from '../../screens/settings/PrivacyScreen';
import SettingsSecurityScreen from '../../screens/settings/SecurityScreen';
import SettingsUnitsScreen from '../../screens/settings/UnitsScreen';
import SettingsBackupScreen from '../../screens/settings/BackupScreen';
import SettingsAboutScreen from '../../screens/settings/AboutScreen';
import SettingsSupportScreen from '../../screens/settings/SupportScreen';
import EditProfileScreen from '../../screens/EditProfileScreen';
import BadgesScreen from '../../screens/BadgesScreen';
import StatisticsScreen from '../../screens/StatisticsScreen';
import ProgressPhotosScreen from '../../screens/ProgressPhotosScreen';
import SleepScreen from '../../screens/health/SleepScreen';
import HRVScreen from '../../screens/health/HRVScreen';
import MoodScreen from '../../screens/health/MoodScreen';
import HealthIntegrationsScreen from '../../screens/health/HealthIntegrationsScreen';
import AchievementsScreen from '../../screens/AchievementsScreen';
import HealthSyncScreen from '../../screens/HealthSyncScreen';
import BattlePassScreen from '../../screens/BattlePassScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      id="ProfileStack"
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="SettingsTheme" component={SettingsThemeScreen} options={{ title: 'Theme' }} />
      <Stack.Screen name="SettingsLanguage" component={SettingsLanguageScreen} options={{ title: 'Language' }} />
      <Stack.Screen name="SettingsNotifications" component={SettingsNotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="SettingsPrivacy" component={SettingsPrivacyScreen} options={{ title: 'Privacy' }} />
      <Stack.Screen name="SettingsSecurity" component={SettingsSecurityScreen} options={{ title: 'Security' }} />
      <Stack.Screen name="SettingsUnits" component={SettingsUnitsScreen} options={{ title: 'Units' }} />
      <Stack.Screen name="SettingsBackup" component={SettingsBackupScreen} options={{ title: 'Backup' }} />
      <Stack.Screen name="SettingsAbout" component={SettingsAboutScreen} options={{ title: 'About' }} />
      <Stack.Screen name="SettingsSupport" component={SettingsSupportScreen} options={{ title: 'Support' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="Badges" component={BadgesScreen} options={{ title: 'Badges' }} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Statistics' }} />
      <Stack.Screen name="ProgressPhotos" component={ProgressPhotosScreen} options={{ title: 'Progress Photos' }} />
      <Stack.Screen name="Sleep" component={SleepScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HRV" component={HRVScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Mood" component={MoodScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HealthIntegrations" component={HealthIntegrationsScreen} options={{ title: 'Health Integrations' }} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BattlePass" component={BattlePassScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HealthSync" component={HealthSyncScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
