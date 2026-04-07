/*
  Warnings:

  - You are about to drop the column `disconAmount` on the `DetailPenjualan` table. All the data in the column will be lost.
  - You are about to drop the column `disconPrecent` on the `DetailPenjualan` table. All the data in the column will be lost.
  - You are about to drop the column `subtotalBeforeDiscon` on the `DetailPenjualan` table. All the data in the column will be lost.
  - You are about to drop the column `disconAmount` on the `Penjualan` table. All the data in the column will be lost.
  - You are about to drop the column `disconPrecent` on the `Penjualan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `DetailPenjualan` DROP COLUMN `disconAmount`,
    DROP COLUMN `disconPrecent`,
    DROP COLUMN `subtotalBeforeDiscon`,
    ADD COLUMN `discountAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    ADD COLUMN `discountPercent` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    ADD COLUMN `subtotalBeforeDiscount` DECIMAL(65, 30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Penjualan` DROP COLUMN `disconAmount`,
    DROP COLUMN `disconPrecent`,
    ADD COLUMN `discountAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    ADD COLUMN `discountPercent` DECIMAL(65, 30) NOT NULL DEFAULT 0;
