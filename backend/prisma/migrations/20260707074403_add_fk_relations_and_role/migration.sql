-- RedefineIndex (MySQL 8: must drop FK before dropping the auto-created index)
ALTER TABLE `comments` DROP FOREIGN KEY `comments_userId_fkey`;
DROP INDEX `comments_userId_fkey` ON `comments`;
CREATE INDEX `comments_userId_idx` ON `comments`(`userId`);
ALTER TABLE `comments` ADD CONSTRAINT `comments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
ALTER TABLE `post_likes` DROP FOREIGN KEY `post_likes_userId_fkey`;
DROP INDEX `post_likes_userId_fkey` ON `post_likes`;
CREATE INDEX `post_likes_userId_idx` ON `post_likes`(`userId`);
ALTER TABLE `post_likes` ADD CONSTRAINT `post_likes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
