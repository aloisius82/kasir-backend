-- AlterTable
ALTER TABLE `DetailPenerimaan` ADD COLUMN `batch` VARCHAR(191) NULL,
    ADD COLUMN `expired` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `transaksiBarang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barangId` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `transaksiType` ENUM('masuk', 'keluar', 'penjualan', 'adjustment', 'scraping', 'expired', 'retur') NOT NULL,
    `remark` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `transaksiBarang_barangId_fkey`(`barangId`),
    INDEX `transaksiBarang_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockOpname` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `remark` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StockOpname_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailStockOpname` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stockOpnameId` INTEGER NOT NULL,
    `barangId` INTEGER NOT NULL,
    `countQty` INTEGER NOT NULL,
    `dbQty` INTEGER NOT NULL,
    `selisih` INTEGER NOT NULL,
    `adjustmentType` ENUM('masuk', 'keluar', 'scrape', 'expired', 'minusQtyAdjusment', 'initialQty', 'qtyAdjusment', 'countingQty') NOT NULL,
    `remark` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DetailStockOpname_barangId_fkey`(`barangId`),
    INDEX `DetailStockOpname_stockOpnameId_fkey`(`stockOpnameId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transaksiBarang` ADD CONSTRAINT `transaksiBarang_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksiBarang` ADD CONSTRAINT `transaksiBarang_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockOpname` ADD CONSTRAINT `StockOpname_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailStockOpname` ADD CONSTRAINT `DetailStockOpname_stockOpnameId_fkey` FOREIGN KEY (`stockOpnameId`) REFERENCES `StockOpname`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailStockOpname` ADD CONSTRAINT `DetailStockOpname_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
