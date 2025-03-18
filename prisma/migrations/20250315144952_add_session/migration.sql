/*
  Warnings:

  - Added the required column `session` to the `Penjualan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Penjualan` ADD COLUMN `session` INTEGER NOT NULL;
