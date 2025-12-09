-- ============================================
-- Script SQL para corregir incompatibilidades
-- de tipos en foreign keys
-- ============================================
-- Este script corrige el error: "Referencing column and referenced column 
-- in foreign key constraint are incompatible"
-- ============================================

USE huertohogar;

-- Desactivar verificación de foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. Eliminar todas las foreign keys existentes
-- ============================================
-- Nota: MySQL no soporta IF EXISTS con DROP FOREIGN KEY.
-- Usamos un procedimiento almacenado temporal para eliminarlas de forma segura.

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

-- Eliminar foreign keys usando el procedimiento
CALL drop_fk_if_exists('items_carrito', 'items_carrito_ibfk_1');
CALL drop_fk_if_exists('items_carrito', 'items_carrito_ibfk_2');
CALL drop_fk_if_exists('carritos', 'carritos_ibfk_1');

-- Eliminar el procedimiento temporal
DROP PROCEDURE IF EXISTS drop_fk_if_exists;

-- ============================================
-- 2. Modificar todas las columnas ID a BIGINT
-- ============================================

-- Modificar ID de usuarios
ALTER TABLE usuarios MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

-- Modificar ID de productos
ALTER TABLE productos MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

-- Modificar ID de carritos
ALTER TABLE carritos MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

-- Modificar ID de items_carrito
ALTER TABLE items_carrito MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

-- ============================================
-- 3. Modificar columnas de foreign keys a BIGINT
-- ============================================

-- Modificar usuario_id en carritos
ALTER TABLE carritos MODIFY COLUMN usuario_id BIGINT NOT NULL;

-- Modificar carrito_id en items_carrito
ALTER TABLE items_carrito MODIFY COLUMN carrito_id BIGINT NOT NULL;

-- Modificar producto_id en items_carrito
ALTER TABLE items_carrito MODIFY COLUMN producto_id BIGINT NOT NULL;

-- ============================================
-- 4. Recrear las foreign keys
-- ============================================

-- Foreign key: carritos -> usuarios
ALTER TABLE carritos 
ADD CONSTRAINT carritos_ibfk_1 
FOREIGN KEY (usuario_id) 
REFERENCES usuarios(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Foreign key: items_carrito -> carritos
ALTER TABLE items_carrito 
ADD CONSTRAINT items_carrito_ibfk_1 
FOREIGN KEY (carrito_id) 
REFERENCES carritos(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Foreign key: items_carrito -> productos
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

-- Verificar que todas las columnas ID son BIGINT
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'huertohogar'
  AND COLUMN_NAME IN ('id', 'usuario_id', 'carrito_id', 'producto_id')
ORDER BY TABLE_NAME, COLUMN_NAME;

-- Verificar foreign keys
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'huertohogar'
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

