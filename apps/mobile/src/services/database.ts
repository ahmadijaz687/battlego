import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('fitnessbattle.db');
    db.execSync('PRAGMA journal_mode = WAL;');
    db.execSync('PRAGMA foreign_keys = ON;');
    db.execSync('PRAGMA busy_timeout = 5000;');
    db.execSync('PRAGMA cache_size = -8000;');
  }
  return db;
}

export function runMigrations(): void {
  const database = getDatabase();

  database.execSync(`CREATE TABLE IF NOT EXISTS _schema_version (
    version INTEGER PRIMARY KEY NOT NULL,
    applied_at TEXT NOT NULL DEFAULT (datetime('now')),
    description TEXT
  );`);

  const currentVersion = database.getFirstSync<{ version: number }>(
    'SELECT version FROM _schema_version ORDER BY version DESC LIMIT 1'
  );

  if (!currentVersion || currentVersion.version < 1) {
    database.withTransactionSync(() => {
      runSchemaV1(database);
      database.runSync(
        'INSERT INTO _schema_version (version, description) VALUES (?, ?)',
        [1, 'Initial schema — 68 tables']
      );
    });
  }
}

function runSchemaV1(database: SQLite.SQLiteDatabase): void {
  database.execSync(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
    avatar TEXT, role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
    streak INTEGER NOT NULL DEFAULT 0, longest_streak INTEGER NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 0, timezone TEXT, health_providers TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS user_profiles (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL UNIQUE, bio TEXT,
    date_of_birth TEXT, height REAL, height_unit TEXT NOT NULL DEFAULT 'cm', goal TEXT,
    experience TEXT NOT NULL DEFAULT 'beginner' CHECK (experience IN ('beginner','intermediate','advanced')),
    fitness_level TEXT NOT NULL DEFAULT 'beginner' CHECK (fitness_level IN ('beginner','intermediate','advanced')),
    activity_level TEXT NOT NULL DEFAULT 'sedentary' CHECK (activity_level IN ('sedentary','light','moderate','active','very_active')),
    equipment TEXT NOT NULL DEFAULT '[]', injuries TEXT NOT NULL DEFAULT '[]',
    preferences TEXT NOT NULL DEFAULT '{}', onboarding_complete INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS user_settings (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL UNIQUE,
    theme TEXT NOT NULL DEFAULT 'dark', units TEXT NOT NULL DEFAULT 'imperial' CHECK (units IN ('imperial','metric')),
    notifications TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS user_levels (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL UNIQUE,
    level INTEGER NOT NULL DEFAULT 1, xp INTEGER NOT NULL DEFAULT 0,
    total_xp INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS exercise_categories (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE,
    description TEXT, icon TEXT, image TEXT, color TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS equipment (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, category TEXT,
    icon TEXT, image TEXT, description TEXT, is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS muscle_groups (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, body_region TEXT NOT NULL,
    icon TEXT, image TEXT, description TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE,
    primary_muscle TEXT NOT NULL, secondary_muscles TEXT NOT NULL DEFAULT '[]',
    equipment TEXT NOT NULL DEFAULT '[]',
    difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner','intermediate','advanced')),
    category TEXT, tags TEXT NOT NULL DEFAULT '[]', instructions TEXT,
    image_url TEXT, video_url TEXT, met REAL, is_bodyweight INTEGER NOT NULL DEFAULT 0,
    calories_per_min REAL, demo_media TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS exercise_variations (
    id TEXT PRIMARY KEY NOT NULL, exercise_id TEXT NOT NULL,
    variation_name TEXT NOT NULL, difficulty TEXT, equipment TEXT,
    description TEXT, video TEXT, thumbnail TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL, name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('strength','cardio','hybrid')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner','intermediate','advanced')),
    duration INTEGER NOT NULL, started_at TEXT, completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS workout_sections (
    id TEXT PRIMARY KEY NOT NULL, workout_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('warmup','main','cooldown')),
    name TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS workout_exercises (
    id TEXT PRIMARY KEY NOT NULL, section_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL, name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (section_id) REFERENCES workout_sections(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS workout_sets (
    id TEXT PRIMARY KEY NOT NULL, exercise_id TEXT NOT NULL,
    set_number INTEGER NOT NULL, reps INTEGER, weight REAL,
    duration INTEGER, distance REAL, tempo TEXT, rpe INTEGER,
    rest_after INTEGER, notes TEXT, completed INTEGER NOT NULL DEFAULT 0,
    is_pr INTEGER NOT NULL DEFAULT 0, completed_at TEXT,
    FOREIGN KEY (exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS workout_templates (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner','intermediate','advanced')),
    duration INTEGER NOT NULL, exercises TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS personal_records (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL, exercise_name TEXT NOT NULL,
    record_type TEXT NOT NULL DEFAULT 'MAX_WEIGHT'
      CHECK (record_type IN ('MAX_WEIGHT','MAX_REPS','BEST_TIME','LONGEST_DISTANCE')),
    value REAL NOT NULL, unit TEXT NOT NULL,
    date TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, exercise_id, record_type)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS foods (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, brand TEXT,
    calories INTEGER NOT NULL, protein REAL NOT NULL, carbs REAL NOT NULL,
    fat REAL NOT NULL, fiber REAL, sugar REAL, serving_size TEXT NOT NULL,
    category TEXT, tags TEXT NOT NULL DEFAULT '[]', barcode TEXT UNIQUE,
    per_100g TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS food_categories (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE, icon TEXT, description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS meals (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL, name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'BREAKFAST' CHECK (type IN ('BREAKFAST','LUNCH','DINNER','SNACK')),
    date TEXT NOT NULL DEFAULT (date('now')), time TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS meal_foods (
    id TEXT PRIMARY KEY NOT NULL, meal_id TEXT NOT NULL,
    food_id TEXT NOT NULL, quantity REAL NOT NULL, user_id TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(meal_id, food_id),
    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL, meal_type TEXT NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'beginner',
    prep_time INTEGER NOT NULL, cook_time INTEGER, servings INTEGER NOT NULL,
    calories INTEGER NOT NULL, protein REAL NOT NULL, carbs REAL NOT NULL,
    fat REAL NOT NULL, fiber REAL, ingredients TEXT NOT NULL DEFAULT '[]',
    steps TEXT NOT NULL DEFAULT '[]', tags TEXT NOT NULL DEFAULT '[]',
    image_url TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS water_logs (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL, amount INTEGER NOT NULL,
    date TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS weight_logs (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL, date TEXT NOT NULL,
    weight REAL NOT NULL, unit TEXT NOT NULL CHECK (unit IN ('lbs','kg')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS body_measurements (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL, date TEXT NOT NULL,
    chest REAL, waist REAL, hips REAL, shoulders REAL, arms REAL,
    forearms REAL, thighs REAL, calves REAL, neck REAL, body_fat REAL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS shopping_lists (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT 'Shopping List',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS shopping_list_items (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    shopping_list_id TEXT, name TEXT NOT NULL, quantity REAL NOT NULL,
    unit TEXT NOT NULL, category TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists(id) ON DELETE SET NULL
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS meal_plans (
    id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT,
    goal TEXT, difficulty TEXT, days INTEGER NOT NULL DEFAULT 7,
    author TEXT, image TEXT, estimated_calories INTEGER,
    estimated_protein REAL, estimated_carbs REAL, estimated_fat REAL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS meal_plan_days (
    id TEXT PRIMARY KEY NOT NULL, meal_plan_id TEXT NOT NULL,
    day INTEGER NOT NULL, breakfast TEXT NOT NULL DEFAULT '[]',
    lunch TEXT NOT NULL DEFAULT '[]', dinner TEXT NOT NULL DEFAULT '[]',
    snacks TEXT NOT NULL DEFAULT '[]',
    UNIQUE(meal_plan_id, day),
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS battle_categories (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE, icon TEXT, description TEXT,
    difficulty TEXT, color TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS battle_types (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE,
    description TEXT, is_ranked INTEGER NOT NULL DEFAULT 0,
    max_participants INTEGER NOT NULL DEFAULT 2,
    min_participants INTEGER NOT NULL DEFAULT 2,
    time_limit INTEGER, xp_multiplier REAL NOT NULL DEFAULT 1.0,
    coin_multiplier REAL NOT NULL DEFAULT 1.0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS battles (
    id TEXT PRIMARY KEY NOT NULL, creator_id TEXT NOT NULL,
    opponent_id TEXT, type TEXT NOT NULL, battle_type_id TEXT,
    battle_mode TEXT CHECK (battle_mode IN ('REPS','CALORIES','DURATION','DISTANCE','WORKOUTS')),
    metric TEXT, target REAL, invite_code TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','completed','cancelled')),
    creator_score REAL, opponent_score REAL,
    start_time TEXT, end_time TEXT, winner_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (opponent_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS battle_participants (
    id TEXT PRIMARY KEY NOT NULL, battle_id TEXT NOT NULL,
    user_id TEXT NOT NULL, joined_at TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'pending', progress REAL NOT NULL DEFAULT 0,
    score REAL NOT NULL DEFAULT 0, rank INTEGER,
    xp_earned INTEGER NOT NULL DEFAULT 0, coins_earned INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0, completion_time TEXT,
    UNIQUE(battle_id, user_id),
    FOREIGN KEY (battle_id) REFERENCES battles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS battle_invites (
    id TEXT PRIMARY KEY NOT NULL, battle_id TEXT NOT NULL,
    sender_id TEXT NOT NULL, receiver_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    sent_at TEXT NOT NULL DEFAULT (datetime('now')),
    accepted_at TEXT, UNIQUE(battle_id, receiver_id)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS battle_results (
    id TEXT PRIMARY KEY NOT NULL, battle_id TEXT NOT NULL UNIQUE,
    winner_id TEXT, runner_up_id TEXT, third_place_id TEXT,
    completed_at TEXT NOT NULL DEFAULT (datetime('now')),
    total_participants INTEGER NOT NULL DEFAULT 0,
    average_score REAL NOT NULL DEFAULT 0
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS battle_progress (
    id TEXT PRIMARY KEY NOT NULL, battle_id TEXT NOT NULL,
    user_id TEXT NOT NULL, current_value REAL NOT NULL DEFAULT 0,
    target_value REAL NOT NULL DEFAULT 0, percentage REAL NOT NULL DEFAULT 0,
    last_updated TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(battle_id, user_id),
    FOREIGN KEY (battle_id) REFERENCES battles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS battle_rewards (
    id TEXT PRIMARY KEY NOT NULL, battle_id TEXT NOT NULL,
    reward_type TEXT NOT NULL, reward_name TEXT NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0, coins INTEGER NOT NULL DEFAULT 0,
    badge_id TEXT, title_id TEXT, image TEXT
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS battle_comments (
    id TEXT PRIMARY KEY NOT NULL, battle_id TEXT NOT NULL,
    user_id TEXT NOT NULL, message TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS battle_reactions (
    id TEXT PRIMARY KEY NOT NULL, battle_id TEXT NOT NULL,
    user_id TEXT NOT NULL, reaction TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(battle_id, user_id)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS leaderboards (
    id TEXT PRIMARY KEY NOT NULL, type TEXT NOT NULL,
    period TEXT, season_id TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS leaderboard_entries (
    id TEXT PRIMARY KEY NOT NULL, leaderboard_id TEXT NOT NULL,
    user_id TEXT NOT NULL, rank INTEGER NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0, points REAL NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0, losses INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0, workouts INTEGER NOT NULL DEFAULT 0,
    calories REAL NOT NULL DEFAULT 0, distance REAL NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(leaderboard_id, user_id),
    FOREIGN KEY (leaderboard_id) REFERENCES leaderboards(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL, icon TEXT NOT NULL,
    category TEXT NOT NULL, xp_reward INTEGER NOT NULL DEFAULT 0,
    criteria TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS user_achievements (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL, unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS badges (
    id TEXT PRIMARY KEY NOT NULL, key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL, description TEXT, icon TEXT,
    tier TEXT NOT NULL DEFAULT 'common', xp_reward INTEGER NOT NULL DEFAULT 0
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS user_badges (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    badge_id TEXT NOT NULL, awarded_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS titles (
    id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL UNIQUE,
    description TEXT, rarity TEXT NOT NULL DEFAULT 'common', icon TEXT,
    unlock_requirement TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS unlocked_titles (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    title_id TEXT NOT NULL, unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
    is_equipped INTEGER NOT NULL DEFAULT 0,
    UNIQUE(user_id, title_id)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS coins (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL UNIQUE,
    balance INTEGER NOT NULL DEFAULT 0, earned INTEGER NOT NULL DEFAULT 0,
    spent INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS coin_transactions (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    amount INTEGER NOT NULL, type TEXT NOT NULL,
    description TEXT, reference_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS seasons (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL,
    description TEXT, start_date TEXT NOT NULL, end_date TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS battle_passes (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    season_id TEXT NOT NULL, tier INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0, premium INTEGER NOT NULL DEFAULT 0,
    claimed TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, season_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    name TEXT NOT NULL, description TEXT, category TEXT NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'daily', target INTEGER NOT NULL DEFAULT 1,
    unit TEXT, streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS habit_logs (
    id TEXT PRIMARY KEY NOT NULL, habit_id TEXT NOT NULL,
    date TEXT NOT NULL, value REAL NOT NULL DEFAULT 1,
    note TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(habit_id, date),
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS sleep_logs (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    date TEXT NOT NULL, duration INTEGER NOT NULL, quality INTEGER,
    deep_sleep INTEGER, rem_sleep INTEGER, light_sleep INTEGER,
    awake_time INTEGER, source TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS hrv_logs (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    date TEXT NOT NULL, hrv REAL NOT NULL, rmssd REAL, sdnn REAL,
    source TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS mood_logs (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    date TEXT NOT NULL, mood INTEGER NOT NULL, energy INTEGER,
    stress INTEGER, note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS recovery_scores (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    date TEXT NOT NULL, readiness INTEGER NOT NULL, fatigue INTEGER NOT NULL,
    recovery INTEGER NOT NULL, sleep_score INTEGER, hrv_score INTEGER,
    mood_score INTEGER, overall INTEGER NOT NULL,
    factors TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS recovery_sessions (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ACTIVE','PASSIVE','STRETCHING','MOBILITY','SAUNA','ICE_BATH')),
    duration INTEGER NOT NULL, notes TEXT, perceived_recovery INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS health_data (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    source TEXT NOT NULL, metric TEXT NOT NULL, value REAL NOT NULL,
    unit TEXT, recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS wearable_data (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    source TEXT NOT NULL, type TEXT NOT NULL, data TEXT NOT NULL,
    synced_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS knowledge_articles (
    id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL,
    category TEXT NOT NULL, summary TEXT NOT NULL,
    content TEXT NOT NULL, tags TEXT NOT NULL DEFAULT '[]',
    difficulty TEXT NOT NULL DEFAULT 'beginner',
    evidence_level TEXT, related_topics TEXT NOT NULL DEFAULT '[]',
    references_ TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    title TEXT NOT NULL, pinned INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS ai_messages (
    id TEXT PRIMARY KEY NOT NULL, conversation_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user','assistant')),
    content TEXT NOT NULL, thinking INTEGER NOT NULL DEFAULT 0,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL,
    description TEXT, difficulty TEXT NOT NULL,
    duration INTEGER NOT NULL, is_public INTEGER NOT NULL DEFAULT 0,
    author_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS program_days (
    id TEXT PRIMARY KEY NOT NULL, program_id TEXT NOT NULL,
    day_number INTEGER NOT NULL, name TEXT, notes TEXT,
    UNIQUE(program_id, day_number),
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS program_exercises (
    id TEXT PRIMARY KEY NOT NULL, program_day_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL, sets INTEGER NOT NULL,
    reps TEXT NOT NULL, rest INTEGER NOT NULL,
    sort_order INTEGER NOT NULL, notes TEXT,
    FOREIGN KEY (program_day_id) REFERENCES program_days(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    title TEXT NOT NULL, description TEXT,
    type TEXT NOT NULL CHECK (type IN ('WORKOUT','NUTRITION','HEALTH','SOCIAL','BODY_COMPOSITION')),
    target_value REAL, current_value REAL, unit TEXT,
    start_date TEXT NOT NULL, target_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','COMPLETED','ABANDONED')),
    category TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS goal_progress (
    id TEXT PRIMARY KEY NOT NULL, goal_id TEXT NOT NULL,
    value REAL NOT NULL, date TEXT NOT NULL DEFAULT (datetime('now')),
    note TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL,
    description TEXT NOT NULL, type TEXT NOT NULL,
    goal TEXT NOT NULL, reward TEXT NOT NULL DEFAULT '{}',
    start_date TEXT NOT NULL, end_date TEXT NOT NULL,
    participant_count INTEGER NOT NULL DEFAULT 0,
    created_by TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS challenge_participants (
    id TEXT PRIMARY KEY NOT NULL, challenge_id TEXT NOT NULL,
    user_id TEXT NOT NULL, progress REAL NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    joined_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(challenge_id, user_id),
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS daily_missions (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    mission_date TEXT NOT NULL, missions TEXT NOT NULL DEFAULT '[]',
    completed INTEGER NOT NULL DEFAULT 0, reward_claimed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, mission_date)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS weekly_missions (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    week INTEGER NOT NULL, year INTEGER NOT NULL,
    missions TEXT NOT NULL DEFAULT '[]',
    completed INTEGER NOT NULL DEFAULT 0, reward_claimed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, week, year)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS monthly_missions (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    month INTEGER NOT NULL, year INTEGER NOT NULL,
    missions TEXT NOT NULL DEFAULT '[]',
    completed INTEGER NOT NULL DEFAULT 0, reward_claimed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, month, year)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS supplements (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    name TEXT NOT NULL, brand TEXT, dosage TEXT, time TEXT,
    frequency TEXT, notes TEXT, start_date TEXT NOT NULL,
    end_date TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS supplement_history (
    id TEXT PRIMARY KEY NOT NULL, supplement_id TEXT NOT NULL,
    date TEXT NOT NULL, taken INTEGER NOT NULL DEFAULT 1,
    time TEXT, notes TEXT, UNIQUE(supplement_id, date),
    FOREIGN KEY (supplement_id) REFERENCES supplements(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS calendar_events (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    title TEXT NOT NULL, description TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('WORKOUT','MEAL','HABIT','GOAL','REMINDER','CUSTOM')),
    start_time TEXT NOT NULL, end_time TEXT,
    all_day INTEGER NOT NULL DEFAULT 0, color TEXT, metadata TEXT DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('like','comment','friend_request','battle_invite','community','story_reaction','message')),
    title TEXT NOT NULL, content TEXT NOT NULL,
    read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    related_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    user_name TEXT NOT NULL, user_avatar TEXT, content TEXT NOT NULL,
    images TEXT, workout_id TEXT, meal_id TEXT,
    likes INTEGER NOT NULL DEFAULT 0, comments INTEGER NOT NULL DEFAULT 0,
    shares INTEGER NOT NULL DEFAULT 0, saves INTEGER NOT NULL DEFAULT 0,
    type TEXT NOT NULL CHECK (type IN ('workout','nutrition','transformation','achievement','battle','general')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    user_name TEXT NOT NULL, image TEXT, video_url TEXT,
    viewed INTEGER NOT NULL DEFAULT 0, duration INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS friends (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    friend_id TEXT NOT NULL, name TEXT NOT NULL,
    username TEXT NOT NULL, avatar TEXT,
    status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online','offline','busy')),
    last_seen TEXT, UNIQUE(user_id, friend_id)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS friend_requests (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    from_user_id TEXT NOT NULL, from_user_name TEXT NOT NULL,
    from_user_avatar TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, from_user_id)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY NOT NULL, participant_ids TEXT NOT NULL,
    participant_names TEXT NOT NULL, last_message TEXT,
    last_message_at TEXT, unread_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS conversation_members (
    id TEXT PRIMARY KEY NOT NULL, conversation_id TEXT NOT NULL,
    user_id TEXT NOT NULL, user_name TEXT NOT NULL,
    UNIQUE(conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY NOT NULL, conversation_id TEXT NOT NULL,
    sender_id TEXT NOT NULL, sender_name TEXT NOT NULL,
    content TEXT NOT NULL, media_url TEXT,
    sent_at TEXT NOT NULL DEFAULT (datetime('now')),
    read_at TEXT, delivered_at TEXT,
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text','image','voice')),
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS communities (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL, avatar TEXT,
    member_count INTEGER NOT NULL DEFAULT 0,
    is_private INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS community_members (
    id TEXT PRIMARY KEY NOT NULL, community_id TEXT NOT NULL,
    user_id TEXT NOT NULL, user_name TEXT NOT NULL,
    joined_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(community_id, user_id)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY NOT NULL, post_id TEXT NOT NULL,
    user_id TEXT NOT NULL, user_name TEXT NOT NULL,
    user_avatar TEXT, content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS post_likes (
    id TEXT PRIMARY KEY NOT NULL, post_id TEXT NOT NULL,
    user_id TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS progress_photos (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    image TEXT NOT NULL, caption TEXT, weight REAL, body_fat REAL,
    date TEXT NOT NULL DEFAULT (datetime('now')),
    visibility TEXT NOT NULL DEFAULT 'public',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS saved_posts (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    post_id TEXT NOT NULL, saved_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, post_id)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS blocked_users (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    blocked_user_id TEXT NOT NULL, reason TEXT,
    blocked_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, blocked_user_id)
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS marketplace_items (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL,
    description TEXT, price INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('AVATAR','BADGE','THEME','BOOST','POWER_UP')),
    rarity TEXT NOT NULL DEFAULT 'COMMON' CHECK (rarity IN ('COMMON','RARE','EPIC','LEGENDARY')),
    image_url TEXT, is_limited INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS user_items (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    item_id TEXT NOT NULL, purchased_at TEXT NOT NULL DEFAULT (datetime('now')),
    is_equipped INTEGER NOT NULL DEFAULT 0, quantity INTEGER NOT NULL DEFAULT 1,
    UNIQUE(user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES marketplace_items(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS coach_profiles (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL UNIQUE,
    bio TEXT, specialties TEXT NOT NULL DEFAULT '[]',
    certifications TEXT NOT NULL DEFAULT '[]', rating REAL NOT NULL DEFAULT 0,
    session_count INTEGER NOT NULL DEFAULT 0,
    is_verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY NOT NULL, coach_id TEXT NOT NULL,
    client_id TEXT NOT NULL, start_date TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','PAUSED','COMPLETED')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(coach_id, client_id),
    FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS client_plans (
    id TEXT PRIMARY KEY NOT NULL, client_id TEXT NOT NULL,
    type TEXT NOT NULL, title TEXT NOT NULL, description TEXT,
    start_date TEXT NOT NULL, end_date TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS sync_records (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    entity_id TEXT NOT NULL, domain TEXT NOT NULL,
    action TEXT NOT NULL, data TEXT NOT NULL DEFAULT '{}',
    client_timestamp TEXT NOT NULL,
    server_timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    version INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY NOT NULL, reporter_id TEXT NOT NULL,
    reported_user_id TEXT, post_id TEXT,
    reason TEXT NOT NULL, description TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','REVIEWED','RESOLVED','DISMISSED')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    resolved_at TEXT,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

  database.execSync(`CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL,
    event TEXT NOT NULL, properties TEXT NOT NULL DEFAULT '{}',
    session_id TEXT, timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);
}

export type DB = SQLite.SQLiteDatabase;
