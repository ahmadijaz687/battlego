import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { seedExercises } from './exercises.js';
import { seedFoods } from './foods.js';
import { seedRecipes } from './recipes.js';
import { seedKnowledge } from './knowledge.js';

const prisma = new PrismaClient();

const TEMPLATES = [
  {
    name: 'Push Pull Legs',
    description: 'Classic PPL split for balanced growth',
    difficulty: 'intermediate',
    duration: 45,
    exercises: JSON.stringify([
      { day: 1, name: 'Push A', exercises: ['Bench Press', 'Overhead Press', 'Triceps Pushdown'] },
      { day: 2, name: 'Pull A', exercises: ['Deadlift', 'Barbell Row', 'Barbell Curl'] },
      { day: 3, name: 'Legs A', exercises: ['Squat', 'Leg Press', 'Calf Raise'] },
    ]),
  },
  {
    name: 'Upper Lower Split',
    description: '4-day upper/lower split for strength',
    difficulty: 'intermediate',
    duration: 50,
    exercises: JSON.stringify([
      { day: 1, name: 'Upper', exercises: ['Bench Press', 'Barbell Row', 'Overhead Press', 'Pull Up'] },
      { day: 2, name: 'Lower', exercises: ['Squat', 'Romanian Deadlift', 'Walking Lunge', 'Calf Raise'] },
    ]),
  },
  {
    name: 'Full Body Beginner',
    description: 'Simple full body routine 3x/week',
    difficulty: 'beginner',
    duration: 35,
    exercises: JSON.stringify([
      { day: 1, name: 'Full Body A', exercises: ['Squat', 'Bench Press', 'Barbell Row', 'Plank'] },
      { day: 2, name: 'Full Body B', exercises: ['Deadlift', 'Overhead Press', 'Pull Up', 'Russian Twist'] },
    ]),
  },
  {
    name: 'Bro Split',
    description: 'Classic bodybuilding bro split',
    difficulty: 'advanced',
    duration: 55,
    exercises: JSON.stringify([
      { day: 1, name: 'Chest', exercises: ['Bench Press', 'Incline Bench Press', 'Dumbbell Fly', 'Push Up'] },
      { day: 2, name: 'Back', exercises: ['Deadlift', 'Pull Up', 'Barbell Row', 'Lat Pulldown'] },
      { day: 3, name: 'Legs', exercises: ['Squat', 'Leg Press', 'Romanian Deadlift', 'Calf Raise'] },
      { day: 4, name: 'Shoulders', exercises: ['Overhead Press', 'Lateral Raise', 'Face Pull'] },
      { day: 5, name: 'Arms', exercises: ['Barbell Curl', 'Triceps Pushdown', 'Hammer Curl'] },
    ]),
  },
];

async function main() {
  console.log('Seeding database...');

  // Users
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'demo@fitbattle.com' },
      update: {},
      create: { email: 'demo@fitbattle.com', password: hashedPassword, name: 'Demo User', avatar: '' },
    }),
    prisma.user.upsert({
      where: { email: 'alex@fitbattle.com' },
      update: {},
      create: { email: 'alex@fitbattle.com', password: hashedPassword, name: 'Alex Johnson', avatar: '' },
    }),
    prisma.user.upsert({
      where: { email: 'mike@fitbattle.com' },
      update: {},
      create: { email: 'mike@fitbattle.com', password: hashedPassword, name: 'Mike Smith', avatar: '' },
    }),
  ]);

  // Exercises
  const exerciseCount = await seedExercises();
  console.log(`  Exercises: ${exerciseCount}`);

  // Foods
  const foodCount = await seedFoods();
  console.log(`  Foods: ${foodCount}`);

  // Recipes
  const recipeCount = await seedRecipes();
  console.log(`  Recipes: ${recipeCount}`);

  // Knowledge Base
  const knowledgeCount = await seedKnowledge();
  console.log(`  Knowledge Articles: ${knowledgeCount}`);

  // Workout Templates
  for (const tpl of TEMPLATES) {
    await prisma.workoutTemplate.upsert({
      where: { name: tpl.name },
      update: {},
      create: {
        name: tpl.name,
        description: tpl.description,
        difficulty: tpl.difficulty as 'beginner' | 'intermediate' | 'advanced',
        duration: tpl.duration,
        exercises: tpl.exercises,
      },
    });
  }

  // User settings for each user
  for (const user of users) {
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, theme: 'dark', units: 'imperial', notifications: JSON.stringify({ workout: true, nutrition: true, social: true, battle: true }) },
    });
  }

  // Test fixtures (deterministic IDs for e2e/integration tests)
  const hashedTestPassword = await bcrypt.hash('TestPass123!', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'test-user-id',
      email: 'test@example.com',
      password: hashedTestPassword,
      name: 'Test User',
      avatar: '',
    },
  });

  await prisma.userSettings.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      theme: 'dark',
      units: 'imperial',
      notifications: JSON.stringify({ workout: true, nutrition: true, social: true, battle: true }),
    },
  });

  await prisma.achievement.upsert({
    where: { name: 'first-workout' },
    update: {},
    create: {
      name: 'first-workout',
      description: 'Complete your first workout',
      icon: '🏋️',
      category: 'workout',
      xpReward: 100,
      criteria: JSON.stringify({ type: 'workout_complete', count: 1 }),
    },
  });

  await prisma.challenge.upsert({
    where: { id: 'challenge-1' },
    update: {},
    create: {
      id: 'challenge-1',
      name: 'Test Challenge',
      description: 'A test challenge for e2e testing',
      type: 'steps',
      goal: JSON.stringify({ steps: 10000 }),
      reward: JSON.stringify({ xp: 100 }),
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      createdBy: testUser.id,
    },
  });

  // Demo social connections
  if (users.length >= 2) {
    await prisma.friend.upsert({
      where: { userId_friendId: { userId: users[0].id, friendId: users[1].id } },
      update: {},
      create: { userId: users[0].id, friendId: users[1].id, name: users[1].name, username: users[1].email, avatar: '', status: 'online' },
    });
    await prisma.friend.upsert({
      where: { userId_friendId: { userId: users[0].id, friendId: users[2].id } },
      update: {},
      create: { userId: users[0].id, friendId: users[2].id, name: users[2].name, username: users[2].email, avatar: '', status: 'online' },
    });
    await prisma.friend.upsert({
      where: { userId_friendId: { userId: users[1].id, friendId: users[0].id } },
      update: {},
      create: { userId: users[1].id, friendId: users[0].id, name: users[0].name, username: users[0].email, avatar: '', status: 'online' },
    });
  }

  // ==================== BADGES ====================
  const BADGES = [
    { key: 'first_workout', name: 'First Workout', description: 'Complete your first workout', icon: '🏋️', tier: 'bronze', xpReward: 50 },
    { key: 'week_streak', name: 'Week Streak', description: 'Work out 7 days in a row', icon: '🔥', tier: 'silver', xpReward: 100 },
    { key: 'battle_won', name: 'Battle Won', description: 'Win a fitness battle', icon: '🏆', tier: 'gold', xpReward: 150 },
    { key: 'pr_set', name: 'Personal Record', description: 'Set a new personal record', icon: '💪', tier: 'silver', xpReward: 100 },
    { key: 'nutrition_goal', name: 'Nutrition Goal', description: 'Hit your daily nutrition target', icon: '🥗', tier: 'bronze', xpReward: 75 },
    { key: 'step_goal', name: 'Step Goal', description: 'Reach your daily step goal', icon: '👟', tier: 'bronze', xpReward: 75 },
    { key: 'social_butterfly', name: 'Social Butterfly', description: 'Connect with 5 friends', icon: '🦋', tier: 'silver', xpReward: 120 },
    { key: 'early_bird', name: 'Early Bird', description: 'Complete a morning workout', icon: '🌅', tier: 'bronze', xpReward: 60 },
  ];
  for (const b of BADGES) {
    await prisma.badge.upsert({
      where: { key: b.key },
      update: {},
      create: { key: b.key, name: b.name, description: b.description, icon: b.icon, tier: b.tier, xpReward: b.xpReward },
    });
  }

  // ==================== EXTRA DEMO USERS (up to ~12 total) ====================
  const extraEmails = [
    'sarah@fitbattle.com', 'jessica@fitbattle.com', 'david@fitbattle.com',
    'emma@fitbattle.com', 'chris@fitbattle.com', 'laura@fitbattle.com',
    'james@fitbattle.com', 'olivia@fitbattle.com', 'noah@fitbattle.com',
  ];
  const extraNames = ['Sarah Lee', 'Jessica Wong', 'David Kim', 'Emma Davis', 'Chris Brown', 'Laura Martinez', 'James Wilson', 'Olivia Taylor', 'Noah Thomas'];
  const extraUsers = await Promise.all(
    extraEmails.map((email, i) =>
      prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, password: hashedPassword, name: extraNames[i], avatar: '' },
      })
    )
  );
  const allUsers = [...users, ...extraUsers];

  // Award the first_workout badge to every demo user
  const firstWorkoutBadge = await prisma.badge.findUnique({ where: { key: 'first_workout' } });
  if (firstWorkoutBadge) {
    for (const u of allUsers) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: u.id, badgeId: firstWorkoutBadge.id } },
        update: {},
        create: { userId: u.id, badgeId: firstWorkoutBadge.id },
      });
    }
  }

  // ==================== DEMO WORKOUTS, MEALS, PERSONAL RECORDS ====================
  const sampleFood = await prisma.food.findFirst({ where: { name: 'Chicken Breast Boneless Skinless' } });
  const sampleFood2 = await prisma.food.findFirst({ where: { name: 'Banana' } });
  const foodId1 = sampleFood?.id ?? '';
  const foodId2 = sampleFood2?.id ?? '';

  for (let i = 0; i < allUsers.length; i++) {
    const u = allUsers[i];
    // Personal records
    const prs = [
      { exerciseId: 'bench-press', exerciseName: 'Barbell Bench Press', value: 60 + i * 5, unit: 'kg' },
      { exerciseId: 'back-squat', exerciseName: 'Back Squat', value: 80 + i * 5, unit: 'kg' },
      { exerciseId: 'deadlift', exerciseName: 'Barbell Deadlift', value: 100 + i * 5, unit: 'kg' },
    ];
    for (const pr of prs) {
      await prisma.personalRecord.upsert({
        where: { userId_exerciseId_recordType: { userId: u.id, exerciseId: pr.exerciseId, recordType: 'MAX_WEIGHT' } },
        update: {},
        create: { userId: u.id, exerciseId: pr.exerciseId, exerciseName: pr.exerciseName, recordType: 'MAX_WEIGHT', value: pr.value, unit: pr.unit, date: new Date() },
      });
    }

    // Workouts (so workout/cardio leaderboards have counts)
    for (let w = 0; w < 3; w++) {
      await prisma.workout.create({
        data: {
          userId: u.id,
          name: `Demo Workout ${w + 1}`,
          type: w === 2 ? 'cardio' : 'strength',
          difficulty: 'beginner',
          duration: 40 + w * 5,
          startedAt: new Date(),
          completedAt: new Date(),
          sections: {
            create: [
              {
                type: 'main',
                name: 'Main',
                order: 0,
                exercises: {
                  create: [
                    {
                      exerciseId: 'bench-press',
                      name: 'Barbell Bench Press',
                      order: 0,
                      sets: {
                        create: [
                          { setNumber: 1, reps: 10, weight: 60 + i * 5, completed: true, isPR: false, completedAt: new Date() },
                          { setNumber: 2, reps: 8, weight: 65 + i * 5, completed: true, isPR: false, completedAt: new Date() },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      });
    }

    // Meals (so calorie leaderboard has data)
    if (foodId1 && foodId2) {
      await prisma.meal.create({
        data: {
          userId: u.id,
          name: 'Demo Breakfast',
          type: 'BREAKFAST',
          date: new Date(),
          foods: {
            create: [
              { foodId: foodId1, quantity: 1.5, userId: u.id },
              { foodId: foodId2, quantity: 2, userId: u.id },
            ],
          },
        },
      });
    }

    // Water logs
    await prisma.waterLog.create({ data: { userId: u.id, amount: 500 + i * 50, date: new Date() } });

    // Habits for streak/analytics
    const existingHabit = await prisma.habit.findFirst({ where: { userId: u.id, name: 'Daily Workout' } });
    if (!existingHabit) {
      await prisma.habit.create({
        data: { userId: u.id, name: 'Daily Workout', description: 'Train every day', category: 'fitness', frequency: 'daily', target: 1, streak: i + 1, longestStreak: i + 3, active: true },
      });
    }
  }

  // ==================== EXTRA BATTLES (~3) ====================
  const battleStatuses = ['active', 'active', 'completed'] as const;
  for (let i = 0; i < 3; i++) {
    const creator = allUsers[i % allUsers.length];
    const opponent = allUsers[(i + 1) % allUsers.length];
    const battle = await prisma.battle.create({
      data: {
        creatorId: creator.id,
        opponentId: opponent.id,
        type: 'strength',
        mode: 'WORKOUTS',
        metric: 'workouts',
        status: battleStatuses[i],
        creatorScore: 3 + i,
        opponentScore: 2 + i,
        startTime: new Date(Date.now() - 86400000 * (i + 1)),
        endTime: new Date(Date.now() + 86400000 * (6 - i)),
        winnerId: battleStatuses[i] === 'completed' ? creator.id : null,
      },
    });
    await prisma.battleParticipant.createMany({
      data: [
        { battleId: battle.id, userId: creator.id, status: 'accepted', progress: 3 + i, score: 3 + i, completed: battleStatuses[i] === 'completed', rank: 1 },
        { battleId: battle.id, userId: opponent.id, status: 'accepted', progress: 2 + i, score: 2 + i, completed: battleStatuses[i] === 'completed', rank: 2 },
      ],
      skipDuplicates: true,
    });
  }

  // ==================== LEADERBOARD ROWS ====================
  const leaderboardMetrics = ['workouts', 'calories', 'strength', 'cardio'];
  for (const metric of leaderboardMetrics) {
    const lb = await prisma.leaderboard.upsert({
      where: { id: `leaderboard-${metric}` },
      update: {},
      create: { id: `leaderboard-${metric}`, type: metric, period: 'all-time' },
    });
    const ranked = [...allUsers].map((u, idx) => ({ userId: u.id, rank: idx + 1, value: (idx + 1) * 10 }));
    for (const r of ranked) {
      await prisma.leaderboardEntry.upsert({
        where: { leaderboardId_userId: { leaderboardId: lb.id, userId: r.userId } },
        update: { rank: r.rank },
        create: {
          leaderboardId: lb.id,
          userId: r.userId,
          rank: r.rank,
          workouts: metric === 'workouts' ? r.value : 0,
          calories: metric === 'calories' ? r.value * 10 : 0,
          points: r.value,
          streak: r.rank,
        },
      });
    }
  }

  console.log('Seed complete!');
  console.log(`  Users: ${allUsers.length}`);
  console.log(`  Templates: ${TEMPLATES.length}`);
  console.log(`  Badges: ${BADGES.length}`);
  console.log(`  Battles: 3`);
  console.log('\nDemo login: demo@fitbattle.com / Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
