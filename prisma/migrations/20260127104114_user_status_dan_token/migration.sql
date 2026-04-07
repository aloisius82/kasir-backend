-- AlterTable
ALTER TABLE `User` ADD COLUMN `status` ENUM('active', 'inactive', 'suspended', 'password_reset', 'deleted') NOT NULL DEFAULT 'active',
    ADD COLUMN `token` VARCHAR(191) NULL;
