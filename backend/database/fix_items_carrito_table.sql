-- ============================================
-- Script para corregir la tabla items_carrito
-- y asegurar compatibilidad con los modelos JPA
-- ============================================

USE huertohogar;

-- Desactivar verificación de foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar foreign keys existentes si existen
-- Nota: MySQL no soporta IF EXISTS con DROP FOREIGN KEY
-- Usamos un procedimiento almacenado temporal

DELIMITER $$

DROP PROCEDURE IF EXISTS drop_fk_if_exists$$

CREATE PROCEDURE drop_fk_if_exists(
    IN p_table_name VARCHAR(64),
    IN p_constraint_name VARCHAR(64)
)
BEGIN
    DECLARE v_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO v_count
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table_name
      AND CONSTRAINT_NAME = p_constraint_name
      AND CONSTRAINT_TYPE = 'FOREIGN KEY';
    
    IF v_count > 0 THEN
        SET @sql = CONCAT('ALTER TABLE ', p_table_name, ' DROP FOREIGN KEY ', p_constraint_name);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DELIMITER ;

-- Eliminar foreign keys existentes
CALL drop_fk_if_exists('items_carrito', 'items_carrito_ibfk_1');
CALL drop_fk_if_exists('items_carrito', 'items_carrito_ibfk_2');

-- Eliminar el procedimiento temporal
DROP PROCEDURE IF EXISTS drop_fk_if_exists;

-- Modificar la tabla para usar BIGINT (compatible con Long en Java)
-- Si la tabla ya existe, la modificamos; si no, la creamos

-- Verificar si la tabla existe y modificarla
ALTER TABLE items_carrito 
    MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY COLUMN carrito_id BIGINT NOT NULL,
    MODIFY COLUMN producto_id BIGINT NOT NULL;

-- Recrear las foreign keys con los tipos correctos
ALTER TABLE items_carrito 
    ADD CONSTRAINT items_carrito_ibfk_1 
    FOREIGN KEY (carrito_id) 
    REFERENCES carritos(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

ALTER TABLE items_carrito 
    ADD CONSTRAINT items_carrito_ibfk_2 
    FOREIGN KEY (producto_id) 
    REFERENCES productos(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

-- Reactivar verificación de foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Verificación
-- ============================================

-- Verificar estructura de la tabla
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_KEY,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'huertohogar'
  AND TABLE_NAME = 'items_carrito'
ORDER BY ORDINAL_POSITION;

-- Verificar foreign keys
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'huertohogar'
  AND TABLE_NAME = 'items_carrito'
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY CONSTRAINT_NAME;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

