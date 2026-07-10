import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { SocialStackParamList } from '../../types/navigation';
import SocialScreen from '../../screens/social/SocialScreen';
import StoriesScreen from '../../screens/social/StoriesScreen';
import FriendsScreen from '../../screens/social/FriendsScreen';
import MessagesScreen from '../../screens/social/MessagesScreen';
import CommunitiesScreen from '../../screens/social/CommunitiesScreen';
import NotificationsScreen from '../../screens/social/NotificationsScreen';
import ChatScreen from '../../screens/social/ChatScreen';
import CommunityDetailsScreen from '../../screens/social/CommunityDetailsScreen';
import CreatePostScreen from '../../screens/social/CreatePostScreen';
import PostDetailsScreen from '../../screens/social/PostDetailsScreen';

const Stack = createNativeStackNavigator<SocialStackParamList>();

export function SocialStackNavigator() {
  return (
    <Stack.Navigator
      id="SocialStack"
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Social" component={SocialScreen} options={{ title: 'Social' }} />
      <Stack.Screen name="Stories" component={StoriesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Friends" component={FriendsScreen} options={{ title: 'Friends' }} />
      <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: 'Messages' }} />
      <Stack.Screen name="Communities" component={CommunitiesScreen} options={{ title: 'Communities' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="CommunityDetails" component={CommunityDetailsScreen} options={{ title: 'Community' }} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Create Post' }} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} options={{ title: 'Post' }} />
    </Stack.Navigator>
  );
}
