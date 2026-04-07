-- AlterTable
ALTER TABLE `Penjualan` ADD COLUMN `discountRef` VARCHAR(191) NULL,
    ADD COLUMN `paymentRef` VARCHAR(191) NULL,
    ADD COLUMN `paymentType` ENUM('cash', 'debit', 'transfer') NOT NULL DEFAULT 'cash';
