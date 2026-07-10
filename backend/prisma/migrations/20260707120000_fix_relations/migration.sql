-- DropIndex
DROP INDEX `knowledge_articles_tags_idx` ON `knowledge_articles`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` VARCHAR(50) NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE `sync_records` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(50) NOT NULL,
    `action` VARCHAR(20) NOT NULL,
    `data` JSON NOT NULL,
    `clientTimestamp` VARCHAR(100) NOT NULL,
    `serverTimestamp` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `version` INTEGER NOT NULL DEFAULT 1,

    INDEX `sync_records_userId_serverTimestamp_idx`(`userId`, `serverTimestamp`),
    INDEX `sync_records_entityId_idx`(`entityId`),
    INDEX `sync_records_domain_idx`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coach_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bio` TEXT NULL,
    `specialties` JSON NOT NULL,
    `certifications` JSON NOT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `sessionCount` INTEGER NOT NULL DEFAULT 0,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    UNIQUE INDEX `coach_profiles_userId_key`(`userId`),
    INDEX `coach_profiles_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` VARCHAR(191) NOT NULL,
    `coachId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `status` ENUM('ACTIVE', 'PAUSED', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `clients_coachId_idx`(`coachId`),
    INDEX `clients_clientId_idx`(`clientId`),
    UNIQUE INDEX `clients_coachId_clientId_key`(`coachId`, `clientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_plans` (
    `id` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `startDate` DATETIME(6) NOT NULL,
    `endDate` DATETIME(6) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    INDEX `client_plans_clientId_idx`(`clientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programs` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `difficulty` VARCHAR(50) NOT NULL,
    `duration` INTEGER NOT NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `authorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    INDEX `programs_authorId_idx`(`authorId`),
    INDEX `programs_isPublic_idx`(`isPublic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_days` (
    `id` VARCHAR(191) NOT NULL,
    `programId` VARCHAR(191) NOT NULL,
    `dayNumber` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `notes` TEXT NULL,

    INDEX `program_days_programId_idx`(`programId`),
    UNIQUE INDEX `program_days_programId_dayNumber_key`(`programId`, `dayNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_exercises` (
    `id` VARCHAR(191) NOT NULL,
    `programDayId` VARCHAR(191) NOT NULL,
    `exerciseId` VARCHAR(191) NOT NULL,
    `sets` INTEGER NOT NULL,
    `reps` VARCHAR(50) NOT NULL,
    `rest` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,
    `notes` TEXT NULL,

    INDEX `program_exercises_programDayId_idx`(`programDayId`),
    INDEX `program_exercises_exerciseId_idx`(`exerciseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `goals` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `type` ENUM('WORKOUT', 'NUTRITION', 'HEALTH', 'SOCIAL', 'BODY_COMPOSITION') NOT NULL,
    `targetValue` DOUBLE NULL,
    `currentValue` DOUBLE NULL,
    `unit` VARCHAR(50) NULL,
    `startDate` DATETIME(6) NOT NULL,
    `targetDate` DATETIME(6) NOT NULL,
    `status` ENUM('ACTIVE', 'COMPLETED', 'ABANDONED') NOT NULL DEFAULT 'ACTIVE',
    `category` VARCHAR(100) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    INDEX `goals_userId_idx`(`userId`),
    INDEX `goals_status_idx`(`status`),
    INDEX `goals_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `goal_progress` (
    `id` VARCHAR(191) NOT NULL,
    `goalId` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `date` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `note` TEXT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `goal_progress_goalId_idx`(`goalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marketplace_items` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price` INTEGER NOT NULL,
    `type` ENUM('AVATAR', 'BADGE', 'THEME', 'BOOST', 'POWER_UP') NOT NULL,
    `rarity` ENUM('COMMON', 'RARE', 'EPIC', 'LEGENDARY') NOT NULL,
    `imageUrl` VARCHAR(500) NULL,
    `isLimited` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `marketplace_items_type_idx`(`type`),
    INDEX `marketplace_items_rarity_idx`(`rarity`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_items` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `purchasedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `isEquipped` BOOLEAN NOT NULL DEFAULT false,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    INDEX `user_items_userId_idx`(`userId`),
    UNIQUE INDEX `user_items_userId_itemId_key`(`userId`, `itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `plan` ENUM('FREE', 'PREMIUM', 'PRO', 'ELITE') NOT NULL,
    `startDate` DATETIME(6) NOT NULL,
    `endDate` DATETIME(6) NULL,
    `autoRenew` BOOLEAN NOT NULL DEFAULT true,
    `stripeSubscriptionId` VARCHAR(255) NULL,
    `status` ENUM('ACTIVE', 'CANCELED', 'EXPIRED', 'PAST_DUE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    INDEX `subscriptions_userId_idx`(`userId`),
    INDEX `subscriptions_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` VARCHAR(191) NOT NULL,
    `reporterId` VARCHAR(191) NOT NULL,
    `reportedUserId` VARCHAR(191) NULL,
    `postId` VARCHAR(191) NULL,
    `reason` TEXT NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `resolvedAt` DATETIME(6) NULL,

    INDEX `reports_reporterId_idx`(`reporterId`),
    INDEX `reports_reportedUserId_idx`(`reportedUserId`),
    INDEX `reports_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analytics_events` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `event` VARCHAR(255) NOT NULL,
    `properties` JSON NOT NULL,
    `sessionId` VARCHAR(255) NULL,
    `timestamp` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `analytics_events_userId_timestamp_idx`(`userId`, `timestamp`),
    INDEX `analytics_events_event_idx`(`event`),
    INDEX `analytics_events_sessionId_idx`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_devices` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(100) NOT NULL,
    `deviceToken` VARCHAR(500) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastUsed` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `user_devices_userId_idx`(`userId`),
    INDEX `user_devices_deviceToken_idx`(`deviceToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calendar_events` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `eventType` ENUM('WORKOUT', 'MEAL', 'HABIT', 'GOAL', 'REMINDER', 'CUSTOM') NOT NULL,
    `startTime` DATETIME(6) NOT NULL,
    `endTime` DATETIME(6) NULL,
    `allDay` BOOLEAN NOT NULL DEFAULT false,
    `color` VARCHAR(50) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    INDEX `calendar_events_userId_startTime_idx`(`userId`, `startTime`),
    INDEX `calendar_events_eventType_idx`(`eventType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recovery_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `date` DATETIME(6) NOT NULL,
    `type` ENUM('ACTIVE', 'PASSIVE', 'STRETCHING', 'MOBILITY', 'SAUNA', 'ICE_BATH') NOT NULL,
    `duration` INTEGER NOT NULL,
    `notes` TEXT NULL,
    `perceivedRecovery` INTEGER NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `recovery_sessions_userId_date_idx`(`userId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `battles_opponentId_idx` ON `battles`(`opponentId`);

-- CreateIndex
CREATE INDEX `battles_winnerId_idx` ON `battles`(`winnerId`);

-- CreateIndex
CREATE UNIQUE INDEX `friend_requests_userId_fromUserId_key` ON `friend_requests`(`userId`, `fromUserId`);

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battles` ADD CONSTRAINT `battles_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battles` ADD CONSTRAINT `battles_opponentId_fkey` FOREIGN KEY (`opponentId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battles` ADD CONSTRAINT `battles_winnerId_fkey` FOREIGN KEY (`winnerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_likes` ADD CONSTRAINT `post_likes_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sync_records` ADD CONSTRAINT `sync_records_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coach_profiles` ADD CONSTRAINT `coach_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_coachId_fkey` FOREIGN KEY (`coachId`) REFERENCES `coach_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_plans` ADD CONSTRAINT `client_plans_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `programs` ADD CONSTRAINT `programs_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_days` ADD CONSTRAINT `program_days_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_exercises` ADD CONSTRAINT `program_exercises_programDayId_fkey` FOREIGN KEY (`programDayId`) REFERENCES `program_days`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_exercises` ADD CONSTRAINT `program_exercises_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `goals` ADD CONSTRAINT `goals_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `goal_progress` ADD CONSTRAINT `goal_progress_goalId_fkey` FOREIGN KEY (`goalId`) REFERENCES `goals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_items` ADD CONSTRAINT `user_items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_items` ADD CONSTRAINT `user_items_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `marketplace_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_reportedUserId_fkey` FOREIGN KEY (`reportedUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analytics_events` ADD CONSTRAINT `analytics_events_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_devices` ADD CONSTRAINT `user_devices_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calendar_events` ADD CONSTRAINT `calendar_events_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recovery_sessions` ADD CONSTRAINT `recovery_sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


