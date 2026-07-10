import React from 'react';
import { NavigationContainer, DefaultTheme, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { RootStackParamList } from '../types/navigation';
import { useAuthStore } from '../store/authStore';
import { useOnboardingStatus } from '../services/profileService';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { AdminNavigator } from './AdminNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    primary: colors.primary,
  },
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['fitnessbattle://', 'https://fitnessbattle.com'],
  config: {
    screens: {
      Splash: '',
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'home',
              Achievements: 'achievements',
              Leaderboard: 'home/leaderboard',
            },
          },
          WorkoutTab: {
            screens: {
              WorkoutHome: 'workout',
              WorkoutSession: 'workout/session/:workoutId',
              WorkoutDetails: 'workout/:templateId',
              ExerciseLibrary: 'exercises',
              ExerciseDetails: 'exercises/:exerciseId',
            },
          },
          BattleTab: {
            screens: {
              Battle: 'battle',
              BattleLobby: 'battle/lobby',
              BattleSession: 'battle/session',
              Leaderboard: 'leaderboard',
              BattleCreate: 'battles/create',
              DiscoverBattles: 'battles/discover',
            },
          },
          NutritionTab: {
            screens: {
              NutritionDashboard: 'nutrition',
              FoodSearch: 'nutrition/food',
              FoodDetails: 'nutrition/food/:foodId',
              MealCreate: 'nutrition/meals/create',
              MealDetails: 'nutrition/meals/:mealId',
              WaterLog: 'nutrition/water',
              RecipeLibrary: 'nutrition/recipes',
              RecipeDetails: 'nutrition/recipes/:recipeId',
              NutritionGoals: 'nutrition/goals',
              MacroCalculator: 'nutrition/macros',
              BMICalculator: 'nutrition/bmi',
              MealPlanner: 'nutrition/planner',
            },
          },
          SocialTab: {
            screens: {
              Social: 'social',
              Stories: 'social/stories',
              Friends: 'social/friends',
              Messages: 'social/messages',
              Chat: 'social/chat/:conversationId',
              Communities: 'social/communities',
              CreatePost: 'social/create',
              PostDetails: 'social/post/:postId',
            },
          },
          AITab: {
            screens: {
              AI: 'ai',
              AIChat: 'ai/chat',
              AIWorkoutGenerator: 'ai/workout-generator',
              AINutritionPlanner: 'ai/nutrition-planner',
              AIBodyAnalysis: 'ai/body-analysis',
              AIFoodAnalysis: 'ai/food-analysis',
              AIProgressAnalysis: 'ai/progress-analysis',
              AIGoalPlanner: 'ai/goals',
            },
          },
          ProfileTab: {
            screens: {
              Profile: 'profile',
              Settings: 'profile/settings',
              EditProfile: 'profile/edit',
              Badges: 'profile/badges',
              Statistics: 'profile/statistics',
              ProgressPhotos: 'profile/progress',
              HealthIntegrations: 'profile/health',
            },
          },
        },
      },
      Admin: {
        screens: {
          AdminDashboard: 'admin',
          AdminUsers: 'admin/users',
          AdminWorkouts: 'admin/workouts',
          AdminExercises: 'admin/exercises',
          AdminFoods: 'admin/foods',
          AdminBattles: 'admin/battles',
          AdminReports: 'admin/reports',
          AdminLogs: 'admin/logs',
        },
      },
      Onboarding: 'onboarding',
    },
  },
};

function AuthGate({ children }: { children: React.ReactNode }) {
  const { data: onboardingStatus, isLoading: onboardingLoading } = useOnboardingStatus();
  const [needsOnboarding, setNeedsOnboarding] = React.useState(false);

  React.useEffect(() => {
    if (!onboardingLoading && onboardingStatus) {
      setNeedsOnboarding(!onboardingStatus.onboarded);
    }
  }, [onboardingStatus, onboardingLoading]);

  if (onboardingLoading) return null;

  if (needsOnboarding) {
    return (
      <Stack.Navigator id="OnboardingStack" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      </Stack.Navigator>
    );
  }

  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator id="SplashStack" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <Stack.Navigator
        id="RootStack"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Admin"
              component={AdminNavigator}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            options={{ headerShown: false }}
          >
            {() => (
              <Stack.Navigator
                id="AuthStack"
                screenOptions={{
                  headerStyle: { backgroundColor: colors.background },
                  headerTintColor: colors.textPrimary,
                  contentStyle: { backgroundColor: colors.background },
                  animation: 'fade',
                }}
              >
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
              </Stack.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
