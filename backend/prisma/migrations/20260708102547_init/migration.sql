-- AlterTable
ALTER TABLE `shopping_list_items` ADD COLUMN `shoppingListId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `exercise_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(500) NULL,
    `image` VARCHAR(500) NULL,
    `color` VARCHAR(50) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    UNIQUE INDEX `exercise_categories_name_key`(`name`),
    UNIQUE INDEX `exercise_categories_slug_key`(`slug`),
    INDEX `exercise_categories_slug_idx`(`slug`),
    INDEX `exercise_categories_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NULL,
    `icon` VARCHAR(500) NULL,
    `image` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    UNIQUE INDEX `equipment_name_key`(`name`),
    INDEX `equipment_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `muscle_groups` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `bodyRegion` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(500) NULL,
    `image` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `muscle_groups_name_key`(`name`),
    INDEX `muscle_groups_bodyRegion_idx`(`bodyRegion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exercise_variations` (
    `id` VARCHAR(191) NOT NULL,
    `exerciseId` VARCHAR(191) NOT NULL,
    `variationName` VARCHAR(255) NOT NULL,
    `difficulty` VARCHAR(50) NULL,
    `equipment` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `video` VARCHAR(500) NULL,
    `thumbnail` VARCHAR(500) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `exercise_variations_exerciseId_idx`(`exerciseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    UNIQUE INDEX `food_categories_name_key`(`name`),
    UNIQUE INDEX `food_categories_slug_key`(`slug`),
    INDEX `food_categories_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plans` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `goal` VARCHAR(100) NULL,
    `difficulty` VARCHAR(50) NULL,
    `days` INTEGER NOT NULL DEFAULT 7,
    `author` VARCHAR(255) NULL,
    `image` VARCHAR(500) NULL,
    `estimatedCalories` INTEGER NULL,
    `estimatedProtein` DOUBLE NULL,
    `estimatedCarbs` DOUBLE NULL,
    `estimatedFat` DOUBLE NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    INDEX `meal_plans_title_idx`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plan_days` (
    `id` VARCHAR(191) NOT NULL,
    `mealPlanId` VARCHAR(191) NOT NULL,
    `day` INTEGER NOT NULL,
    `breakfast` JSON NOT NULL,
    `lunch` JSON NOT NULL,
    `dinner` JSON NOT NULL,
    `snacks` JSON NOT NULL,

    INDEX `meal_plan_days_mealPlanId_idx`(`mealPlanId`),
    UNIQUE INDEX `meal_plan_days_mealPlanId_day_key`(`mealPlanId`, `day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `difficulty` VARCHAR(50) NULL,
    `color` VARCHAR(50) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    UNIQUE INDEX `battle_categories_name_key`(`name`),
    UNIQUE INDEX `battle_categories_slug_key`(`slug`),
    INDEX `battle_categories_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle_types` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `isRanked` BOOLEAN NOT NULL DEFAULT false,
    `maxParticipants` INTEGER NOT NULL DEFAULT 2,
    `minParticipants` INTEGER NOT NULL DEFAULT 2,
    `timeLimit` INTEGER NULL,
    `xpMultiplier` DOUBLE NOT NULL DEFAULT 1.0,
    `coinMultiplier` DOUBLE NOT NULL DEFAULT 1.0,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `battle_types_name_key`(`name`),
    INDEX `battle_types_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle_participants` (
    `id` VARCHAR(191) NOT NULL,
    `battleId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `progress` DOUBLE NOT NULL DEFAULT 0,
    `score` DOUBLE NOT NULL DEFAULT 0,
    `rank` INTEGER NULL,
    `xpEarned` INTEGER NOT NULL DEFAULT 0,
    `coinsEarned` INTEGER NOT NULL DEFAULT 0,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `completionTime` DATETIME(3) NULL,

    INDEX `battle_participants_battleId_idx`(`battleId`),
    INDEX `battle_participants_userId_idx`(`userId`),
    UNIQUE INDEX `battle_participants_battleId_userId_key`(`battleId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle_invites` (
    `id` VARCHAR(191) NOT NULL,
    `battleId` VARCHAR(191) NOT NULL,
    `senderId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `sentAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `acceptedAt` DATETIME(3) NULL,

    INDEX `battle_invites_receiverId_idx`(`receiverId`),
    INDEX `battle_invites_battleId_idx`(`battleId`),
    UNIQUE INDEX `battle_invites_battleId_receiverId_key`(`battleId`, `receiverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle_results` (
    `id` VARCHAR(191) NOT NULL,
    `battleId` VARCHAR(191) NOT NULL,
    `winnerId` VARCHAR(191) NULL,
    `runnerUpId` VARCHAR(191) NULL,
    `thirdPlaceId` VARCHAR(191) NULL,
    `completedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `totalParticipants` INTEGER NOT NULL DEFAULT 0,
    `averageScore` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `battle_results_battleId_key`(`battleId`),
    INDEX `battle_results_battleId_idx`(`battleId`),
    INDEX `battle_results_winnerId_idx`(`winnerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle_progress` (
    `id` VARCHAR(191) NOT NULL,
    `battleId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `currentValue` DOUBLE NOT NULL DEFAULT 0,
    `targetValue` DOUBLE NOT NULL DEFAULT 0,
    `percentage` DOUBLE NOT NULL DEFAULT 0,
    `lastUpdated` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `battle_progress_battleId_idx`(`battleId`),
    INDEX `battle_progress_userId_idx`(`userId`),
    UNIQUE INDEX `battle_progress_battleId_userId_key`(`battleId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle_rewards` (
    `id` VARCHAR(191) NOT NULL,
    `battleId` VARCHAR(191) NOT NULL,
    `rewardType` VARCHAR(100) NOT NULL,
    `rewardName` VARCHAR(255) NOT NULL,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `coins` INTEGER NOT NULL DEFAULT 0,
    `badgeId` VARCHAR(191) NULL,
    `titleId` VARCHAR(191) NULL,
    `image` VARCHAR(500) NULL,

    INDEX `battle_rewards_battleId_idx`(`battleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle_comments` (
    `id` VARCHAR(191) NOT NULL,
    `battleId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    INDEX `battle_comments_battleId_idx`(`battleId`),
    INDEX `battle_comments_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battle_reactions` (
    `id` VARCHAR(191) NOT NULL,
    `battleId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `reaction` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `battle_reactions_battleId_idx`(`battleId`),
    INDEX `battle_reactions_userId_idx`(`userId`),
    UNIQUE INDEX `battle_reactions_battleId_userId_key`(`battleId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leaderboards` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `period` VARCHAR(50) NULL,
    `seasonId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(6) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `leaderboards_type_period_idx`(`type`, `period`),
    INDEX `leaderboards_seasonId_idx`(`seasonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leaderboard_entries` (
    `id` VARCHAR(191) NOT NULL,
    `leaderboardId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `rank` INTEGER NOT NULL,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `points` DOUBLE NOT NULL DEFAULT 0,
    `wins` INTEGER NOT NULL DEFAULT 0,
    `losses` INTEGER NOT NULL DEFAULT 0,
    `streak` INTEGER NOT NULL DEFAULT 0,
    `workouts` INTEGER NOT NULL DEFAULT 0,
    `calories` DOUBLE NOT NULL DEFAULT 0,
    `distance` DOUBLE NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(6) NOT NULL,

    INDEX `leaderboard_entries_leaderboardId_rank_idx`(`leaderboardId`, `rank`),
    INDEX `leaderboard_entries_userId_idx`(`userId`),
    UNIQUE INDEX `leaderboard_entries_leaderboardId_userId_key`(`leaderboardId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_missions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `missionDate` DATETIME(6) NOT NULL,
    `missions` JSON NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `rewardClaimed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `daily_missions_userId_idx`(`userId`),
    INDEX `daily_missions_missionDate_idx`(`missionDate`),
    UNIQUE INDEX `daily_missions_userId_missionDate_key`(`userId`, `missionDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weekly_missions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `week` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `missions` JSON NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `rewardClaimed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `weekly_missions_userId_idx`(`userId`),
    UNIQUE INDEX `weekly_missions_userId_week_year_key`(`userId`, `week`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monthly_missions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `missions` JSON NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `rewardClaimed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `monthly_missions_userId_idx`(`userId`),
    UNIQUE INDEX `monthly_missions_userId_month_year_key`(`userId`, `month`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coins` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `balance` INTEGER NOT NULL DEFAULT 0,
    `earned` INTEGER NOT NULL DEFAULT 0,
    `spent` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(6) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `coins_userId_key`(`userId`),
    INDEX `coins_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coin_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `referenceId` VARCHAR(191) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `coin_transactions_userId_idx`(`userId`),
    INDEX `coin_transactions_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `titles` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `rarity` VARCHAR(50) NOT NULL DEFAULT 'common',
    `icon` VARCHAR(500) NULL,
    `unlockRequirement` JSON NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `titles_title_key`(`title`),
    INDEX `titles_rarity_idx`(`rarity`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unlocked_titles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `titleId` VARCHAR(191) NOT NULL,
    `unlockedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `isEquipped` BOOLEAN NOT NULL DEFAULT false,

    INDEX `unlocked_titles_userId_idx`(`userId`),
    INDEX `unlocked_titles_titleId_idx`(`titleId`),
    UNIQUE INDEX `unlocked_titles_userId_titleId_key`(`userId`, `titleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `progress_photos` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `image` VARCHAR(500) NOT NULL,
    `caption` TEXT NULL,
    `weight` DOUBLE NULL,
    `bodyFat` DOUBLE NULL,
    `date` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `visibility` VARCHAR(50) NOT NULL DEFAULT 'public',
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `progress_photos_userId_idx`(`userId`),
    INDEX `progress_photos_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saved_posts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `savedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `saved_posts_userId_idx`(`userId`),
    UNIQUE INDEX `saved_posts_userId_postId_key`(`userId`, `postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blocked_users` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `blockedUserId` VARCHAR(191) NOT NULL,
    `reason` TEXT NULL,
    `blockedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `blocked_users_userId_idx`(`userId`),
    INDEX `blocked_users_blockedUserId_idx`(`blockedUserId`),
    UNIQUE INDEX `blocked_users_userId_blockedUserId_key`(`userId`, `blockedUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplements` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `brand` VARCHAR(255) NULL,
    `dosage` VARCHAR(100) NULL,
    `time` VARCHAR(50) NULL,
    `frequency` VARCHAR(50) NULL,
    `notes` TEXT NULL,
    `startDate` DATETIME(6) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    INDEX `supplements_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplement_history` (
    `id` VARCHAR(191) NOT NULL,
    `supplementId` VARCHAR(191) NOT NULL,
    `date` DATETIME(6) NOT NULL,
    `taken` BOOLEAN NOT NULL DEFAULT true,
    `time` VARCHAR(50) NULL,
    `notes` TEXT NULL,

    INDEX `supplement_history_supplementId_idx`(`supplementId`),
    UNIQUE INDEX `supplement_history_supplementId_date_key`(`supplementId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shopping_lists` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL DEFAULT 'Shopping List',
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    INDEX `shopping_lists_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_config` (
    `id` VARCHAR(191) NOT NULL,
    `version` VARCHAR(50) NOT NULL,
    `minimumSupportedVersion` VARCHAR(50) NOT NULL,
    `maintenanceMode` BOOLEAN NOT NULL DEFAULT false,
    `apiVersion` VARCHAR(50) NOT NULL DEFAULT '1.0',
    `announcement` TEXT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feature_flags` (
    `id` VARCHAR(191) NOT NULL,
    `feature` VARCHAR(255) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT false,
    `minimumVersion` VARCHAR(50) NULL,
    `description` TEXT NULL,
    `updatedAt` DATETIME(6) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `feature_flags_feature_key`(`feature`),
    INDEX `feature_flags_feature_idx`(`feature`),
    INDEX `feature_flags_enabled_idx`(`enabled`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` VARCHAR(255) NOT NULL,
    `entity` VARCHAR(100) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `ipAddress` VARCHAR(50) NULL,
    `device` VARCHAR(255) NULL,
    `metadata` JSON NOT NULL,
    `performedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `audit_logs_userId_idx`(`userId`),
    INDEX `audit_logs_action_idx`(`action`),
    INDEX `audit_logs_entity_entityId_idx`(`entity`, `entityId`),
    INDEX `audit_logs_performedAt_idx`(`performedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `shopping_list_items_shoppingListId_idx` ON `shopping_list_items`(`shoppingListId`);

-- AddForeignKey
ALTER TABLE `shopping_list_items` ADD CONSTRAINT `shopping_list_items_shoppingListId_fkey` FOREIGN KEY (`shoppingListId`) REFERENCES `shopping_lists`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_days` ADD CONSTRAINT `meal_plan_days_mealPlanId_fkey` FOREIGN KEY (`mealPlanId`) REFERENCES `meal_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaderboard_entries` ADD CONSTRAINT `leaderboard_entries_leaderboardId_fkey` FOREIGN KEY (`leaderboardId`) REFERENCES `leaderboards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplement_history` ADD CONSTRAINT `supplement_history_supplementId_fkey` FOREIGN KEY (`supplementId`) REFERENCES `supplements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
