import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { WorkoutStackParamList } from '../../types/navigation';
import WorkoutHomeScreen from '../../screens/workout/WorkoutHomeScreen';
import WorkoutSessionScreen from '../../screens/WorkoutSessionScreen';
import WorkoutTemplatesScreen from '../../screens/WorkoutTemplatesScreen';
import WorkoutBuilderScreen from '../../screens/WorkoutBuilderScreen';
import CreateWorkoutScreen from '../../screens/CreateWorkoutScreen';
import ExerciseLibraryScreen from '../../screens/ExerciseLibraryScreen';
import ExerciseDetailsScreen from '../../screens/ExerciseDetailsScreen';
import PersonalRecordsScreen from '../../screens/PersonalRecordsScreen';
import WorkoutSummaryScreen from '../../screens/WorkoutSummaryScreen';
import WorkoutDetailsScreen from '../../screens/WorkoutDetailsScreen';
import WorkoutHistoryScreen from '../../screens/WorkoutHistoryScreen';

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export function WorkoutStackNavigator() {
  return (
    <Stack.Navigator
      id="WorkoutStack"
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="WorkoutHome" component={WorkoutHomeScreen} options={{ title: 'Workouts' }} />
      <Stack.Screen name="WorkoutSession" component={WorkoutSessionScreen} options={{ title: 'Workout' }} />
      <Stack.Screen name="WorkoutTemplates" component={WorkoutTemplatesScreen} options={{ title: 'Templates' }} />
      <Stack.Screen name="WorkoutBuilder" component={WorkoutBuilderScreen} options={{ title: 'Build Workout' }} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} options={{ title: 'New Workout' }} />
      <Stack.Screen name="ExerciseLibrary" component={ExerciseLibraryScreen} options={{ title: 'Exercises' }} />
      <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsScreen} options={{ title: 'Exercise' }} />
      <Stack.Screen name="PersonalRecords" component={PersonalRecordsScreen} options={{ title: 'Records' }} />
      <Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} options={{ title: 'Workout Details' }} />
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} options={{ title: 'History' }} />
    </Stack.Navigator>
  );
}
