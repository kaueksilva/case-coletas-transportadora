CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    ALTER DATABASE CHARACTER SET utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE TABLE `motoristas` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Nome` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        `Cnh` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `Telefone` varchar(20) CHARACTER SET utf8mb4 NULL,
        `Ativo` tinyint(1) NOT NULL,
        CONSTRAINT `PK_motoristas` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE TABLE `usuarios` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Nome` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        `Email` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        `SenhaHash` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
        `Perfil` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `CriadoEm` datetime(6) NOT NULL,
        CONSTRAINT `PK_usuarios` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE TABLE `veiculos` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Placa` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
        `Modelo` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `CapacidadeKg` decimal(10,2) NOT NULL,
        `Ativo` tinyint(1) NOT NULL,
        CONSTRAINT `PK_veiculos` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE TABLE `coletas` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Numero` varchar(30) CHARACTER SET utf8mb4 NOT NULL,
        `Cliente` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        `RemetenteNome` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        `RemetenteEndereco` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
        `DestinatarioNome` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        `DestinatarioEndereco` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
        `DataColeta` datetime(6) NOT NULL,
        `Prioridade` int NOT NULL,
        `Observacoes` varchar(1000) CHARACTER SET utf8mb4 NULL,
        `Status` int NOT NULL,
        `MotoristaId` int NULL,
        `VeiculoId` int NULL,
        `CriadoEm` datetime(6) NOT NULL,
        `AtualizadoEm` datetime(6) NOT NULL,
        CONSTRAINT `PK_coletas` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_coletas_motoristas_MotoristaId` FOREIGN KEY (`MotoristaId`) REFERENCES `motoristas` (`Id`) ON DELETE RESTRICT,
        CONSTRAINT `FK_coletas_veiculos_VeiculoId` FOREIGN KEY (`VeiculoId`) REFERENCES `veiculos` (`Id`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE TABLE `ocorrencias` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `ColetaId` int NOT NULL,
        `Descricao` varchar(1000) CHARACTER SET utf8mb4 NOT NULL,
        `DataHora` datetime(6) NOT NULL,
        `RegistradoPor` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        CONSTRAINT `PK_ocorrencias` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_ocorrencias_coletas_ColetaId` FOREIGN KEY (`ColetaId`) REFERENCES `coletas` (`Id`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE INDEX `IX_coletas_Cliente` ON `coletas` (`Cliente`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE INDEX `IX_coletas_DataColeta` ON `coletas` (`DataColeta`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE INDEX `IX_coletas_MotoristaId` ON `coletas` (`MotoristaId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_coletas_Numero` ON `coletas` (`Numero`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE INDEX `IX_coletas_Status` ON `coletas` (`Status`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE INDEX `IX_coletas_VeiculoId` ON `coletas` (`VeiculoId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE INDEX `IX_ocorrencias_ColetaId` ON `ocorrencias` (`ColetaId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_usuarios_Email` ON `usuarios` (`Email`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_veiculos_Placa` ON `veiculos` (`Placa`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260609194455_InitialCreate') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260609194455_InitialCreate', '8.0.13');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

