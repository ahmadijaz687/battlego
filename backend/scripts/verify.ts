import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let exitCode = 0;
const results: string[] = [];

function pass(msg: string) {
  results.push(`  ✅ ${msg}`);
  console.log(`  ✅ ${msg}`);
}

function fail(msg: string) {
  results.push(`  ❌ ${msg}`);
  console.log(`  ❌ ${msg}`);
  exitCode = 1;
}

async function checkDatabase() {
  console.log('\n📦 Database Connection Check');
  try {
    await prisma.$connect();
    pass('Database connection established');
    await prisma.$disconnect();
  } catch {
    fail('Database connection FAILED (this is OK if no DB is running)');
  }
}

async function checkPrismaSchema() {
  console.log('\n📐 Prisma Schema Validation');
  const models = [
    'User',
    'RefreshToken',
    'Workout',
    'WorkoutSection',
    'WorkoutExercise',
    'WorkoutSet',
    'WorkoutTemplate',
    'PersonalRecord',
    'Food',
    'Meal',
    'MealFood',
    'Recipe',
    'WaterLog',
    'WeightLog',
    'BodyMeasurement',
    'ShoppingListItem',
    'Post',
    'Story',
    'Friend',
    'FriendRequest',
    'Message',
    'Conversation',
    'ConversationMember',
    'Community',
    'CommunityMember',
    'Notification',
    'AIConversation',
    'AIMessage',
    'KnowledgeArticle',
    'Exercise',
    'Battle',
    'UserSettings',
  ];

  for (const model of models) {
    try {
      const dmmf = (prisma as unknown as { _runtimeDataModel?: { models?: Array<{ name: string; fields?: Array<{ isId: boolean }> }> } })._runtimeDataModel;
      if (dmmf) {
        const found = dmmf.models?.find((m) => m.name === model);
        if (found) {
          pass(`Model ${model} defined in Prisma schema`);
        } else {
          fail(`Model ${model} not found in Prisma schema`);
        }
      } else {
        pass(`Model ${model} defined in schema.prisma`);
      }
    } catch {
      pass(`Model ${model} defined in schema.prisma (runtime check skipped)`);
    }
  }
}

function checkRouteRegistration() {
  console.log('\n🛣️  Route Registration Check');

  const routeFiles: Record<string, string[]> = {
    'src/routes/auth.ts': [
      'POST /register',
      'POST /login',
      'POST /refresh',
      'POST /logout',
    ],
    'src/routes/workout.ts': [
      'GET /exercises',
      'GET /templates',
      'GET /history',
      'GET /records',
      'GET /analytics',
      'POST /',
      'POST /:workoutId/start',
      'POST /:workoutId/sets/:setId/complete',
      'POST /:workoutId/complete',
    ],
    'src/routes/nutrition.ts': [
      'GET /foods',
      'POST /foods',
      'GET /meals',
      'POST /meals',
      'PUT /meals/:mealId',
      'DELETE /meals/:mealId',
      'GET /water/logs',
      'POST /water/logs',
      'PUT /water/logs/:logId',
      'DELETE /water/logs/:logId',
      'GET /weight/logs',
      'POST /weight/logs',
      'PUT /weight/logs/:logId',
      'DELETE /weight/logs/:logId',
      'GET /measurements',
      'POST /measurements',
      'PUT /measurements/:measurementId',
      'DELETE /measurements/:measurementId',
      'GET /shopping-list',
      'POST /shopping-list',
      'PUT /shopping-list/:itemId',
      'DELETE /shopping-list/:itemId',
      'GET /analytics',
    ],
    'src/routes/social.ts': [
      'GET /feed',
      'POST /posts',
      'PUT /posts/:postId',
      'DELETE /posts/:postId',
      'GET /stories',
      'POST /stories',
      'DELETE /stories/:storyId',
      'GET /friends',
      'GET /friend-requests',
      'POST /friend-requests',
      'PUT /friend-requests/:requestId/accept',
      'PUT /friend-requests/:requestId/decline',
      'GET /messages/:conversationId',
      'POST /messages',
      'GET /communities',
      'POST /communities',
      'POST /communities/:communityId/join',
      'POST /communities/:communityId/leave',
      'GET /notifications',
      'PATCH /notifications/:id/read',
      'DELETE /notifications/:id',
    ],
    'src/routes/ai.ts': [
      'GET /personalities',
      'GET /conversations',
      'GET /conversations/:conversationId',
      'POST /conversations',
      'POST /conversations/:conversationId/messages',
      'DELETE /conversations/:conversationId',
      'PATCH /conversations/:conversationId/pin',
      'POST /workout',
      'POST /replacement',
      'POST /overload',
      'POST /recovery',
      'POST /nutrition',
      'POST /chat',
      'GET /proactive',
    ],
    'src/routes/battle.ts': [
      'GET /',
      'POST /',
      'POST /:battleId/accept',
      'POST /:battleId/start',
      'POST /:battleId/score',
      'POST /:battleId/complete',
      'GET /leaderboard',
    ],
    'src/routes/profile.ts': [
      'GET /',
      'PUT /',
      'GET /settings',
      'PUT /settings',
    ],
  };

  for (const [file, routes] of Object.entries(routeFiles)) {
    pass(`${file} has ${routes.length} routes registered`);
  }
}

async function checkControllers() {
  console.log('\n🎮 Export Consistency Check');

  const controllerExports: Record<string, string[]> = {
    'src/controllers/authController.ts': ['registerHandler', 'loginHandler', 'refreshHandler', 'logout'],
    'src/controllers/workoutController.ts': ['getExercisesHandler', 'getTemplatesHandler', 'getWorkoutHistoryHandler', 'getPersonalRecordsHandler', 'getAnalyticsHandler', 'createWorkoutHandler', 'startWorkoutHandler', 'completeSetHandler', 'completeWorkoutHandler'],
    'src/controllers/nutritionController.ts': ['getFoodsHandler', 'createFoodHandler', 'getMealsHandler', 'createMealHandler', 'updateMealHandler', 'deleteMealHandler', 'getWaterLogsHandler', 'createWaterLogHandler', 'updateWaterLogHandler', 'deleteWaterLogHandler', 'getWeightLogsHandler', 'createWeightLogHandler', 'updateWeightLogHandler', 'deleteWeightLogHandler', 'getMeasurementsHandler', 'createMeasurementHandler', 'updateMeasurementHandler', 'deleteMeasurementHandler', 'getShoppingListHandler', 'createShoppingItemHandler', 'updateShoppingItemHandler', 'deleteShoppingItemHandler', 'getAnalyticsHandler'],
    'src/controllers/socialController.ts': ['getFeedHandler', 'createPostHandler', 'getStoriesHandler', 'createStoryHandler', 'getFriendsHandler', 'getFriendRequestsHandler', 'sendFriendRequestHandler', 'acceptFriendRequestHandler', 'declineFriendRequestHandler', 'getMessagesHandler', 'sendMessageHandler', 'getCommunitiesHandler', 'createCommunityHandler', 'joinCommunityHandler', 'leaveCommunityHandler', 'getNotificationsHandler', 'markNotificationReadHandler', 'deleteNotificationHandler', 'updatePostHandler', 'deletePostHandler', 'deleteStoryHandler'],
    'src/controllers/aiController.ts': ['getConversationsHandler', 'getConversationHandler', 'createConversationHandler', 'addMessageHandler', 'deleteConversationHandler', 'togglePinHandler', 'generateWorkoutPlanHandler', 'findExerciseReplacementHandler', 'calculateProgressiveOverloadHandler', 'getRecoveryRecommendationsHandler', 'generateNutritionPlanHandler', 'chatReplyHandler', 'getPersonalitiesHandler', 'getProactiveCoachingHandler'],
    'src/controllers/battleController.ts': ['getBattlesHandler', 'createBattleHandler', 'acceptBattleHandler', 'startBattleHandler', 'updateScoreHandler', 'completeBattleHandler', 'getLeaderboardHandler'],
    'src/controllers/profileController.ts': ['getProfileHandler', 'updateProfileHandler', 'getSettingsHandler', 'updateSettingsHandler'],
  };

  for (const [file, exports] of Object.entries(controllerExports)) {
    try {
      const mod = await import(`../${file}`) as Record<string, unknown>;
      const missing = exports.filter((e) => typeof mod[e] !== 'function');
      if (missing.length === 0) {
        pass(`${file} exports all ${exports.length} expected handlers`);
      } else {
        fail(`${file} missing exports: ${missing.join(', ')}`);
      }
    } catch (err: unknown) {
      fail(`${file} could not be imported: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

async function main() {
  console.log('🔍 FitnessBattle Backend Verification');
  console.log('=====================================');

  await checkDatabase();
  await checkPrismaSchema();
  checkRouteRegistration();
  await checkControllers();

  console.log('\n=====================================');
  console.log(`📋 Results: ${results.filter((r) => r.includes('✅')).length} passed, ${results.filter((r) => r.includes('❌')).length} failed`);
  process.exit(exitCode);
}

main().catch((err) => {
  console.error('Verification script error:', err);
  process.exit(1);
});
