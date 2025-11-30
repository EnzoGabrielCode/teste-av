-- CreateTable
CREATE TABLE `relatorios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` TEXT NOT NULL,
    `aeronaveId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `relatorios` ADD CONSTRAINT `relatorios_aeronaveId_fkey` FOREIGN KEY (`aeronaveId`) REFERENCES `aeronaves`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
