-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'USER',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Available',
    `location` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `purchaseDate` DATETIME(3) NULL,
    `purchaseCost` DECIMAL(10, 2) NULL,
    `vendor` VARCHAR(191) NULL,
    `warrantyExpiration` DATETIME(3) NULL,
    `serialNumber` VARCHAR(191) NULL,
    `barcode` VARCHAR(191) NULL,
    `lastMaintenance` DATETIME(3) NULL,
    `nextMaintenance` DATETIME(3) NULL,
    `imageUrl` TEXT NULL,
    `assignedUserId` INTEGER NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Asset_serialNumber_key`(`serialNumber`),
    UNIQUE INDEX `Asset_barcode_key`(`barcode`),
    INDEX `Asset_type_idx`(`type`),
    INDEX `Asset_status_idx`(`status`),
    INDEX `Asset_department_idx`(`department`),
    INDEX `Asset_assignedUserId_idx`(`assignedUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Asset` ADD CONSTRAINT `Asset_assignedUserId_fkey` FOREIGN KEY (`assignedUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
