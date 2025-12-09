-- ============================================
-- Script SQL para crear tablas de órdenes de compra
-- ============================================
-- Este script crea las tablas necesarias para almacenar
-- las órdenes de compra confirmadas por los clientes
-- ============================================

USE huertohogar;

-- Desactivar verificación de foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. Crear tabla de órdenes
-- ============================================

CREATE TABLE IF NOT EXISTS ordenes (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    region VARCHAR(100) NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    indicacion TEXT,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
    fecha_creacion DATETIME NOT NULL,
    fecha_actualizacion DATETIME,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. Crear tabla de items de orden
-- ============================================

CREATE TABLE IF NOT EXISTS items_orden (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    orden_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Crear índices para mejorar rendimiento
-- ============================================

CREATE INDEX idx_orden_usuario ON ordenes(usuario_id);
CREATE INDEX idx_orden_fecha ON ordenes(fecha_creacion);
CREATE INDEX idx_orden_estado ON ordenes(estado);
CREATE INDEX idx_items_orden_orden ON items_orden(orden_id);
CREATE INDEX idx_items_orden_producto ON items_orden(producto_id);

-- Reactivar verificación de foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Verificación
-- ============================================

-- Verificar estructura de las tablas
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_KEY,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'huertohogar'
  AND TABLE_NAME IN ('ordenes', 'items_orden')
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- Verificar foreign keys
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'huertohogar'
  AND TABLE_NAME IN ('ordenes', 'items_orden')
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

