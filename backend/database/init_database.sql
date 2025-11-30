-- ============================================
-- Script SQL para poblar base de datos HuertoHogar
-- Base de datos: huertohogar
-- MySQL / Laragon
-- ============================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS huertohogar 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE huertohogar;

-- ============================================
-- NOTA: Las tablas se crean automáticamente 
-- cuando Spring Boot inicia (Hibernate DDL)
-- Este script solo inserta datos iniciales
-- ============================================

-- Limpiar datos existentes (opcional, descomentar si necesitas resetear)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE items_carrito;
-- TRUNCATE TABLE carritos;
-- TRUNCATE TABLE productos;
-- TRUNCATE TABLE usuarios;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- INSERTAR PRODUCTOS
-- ============================================

INSERT INTO productos (nombre, descripcion, precio, categoria, imagen, stock, activo) VALUES
('Manzanas Fuji', 'Manzanas crujientes y dulces del Valle del Maule.', 1200.00, 'Frutas Frescas', '/img/Manzanas.png', 150, TRUE),
('Naranjas Valencia', 'Jugosas y ricas en vitamina C, ideales para zumos frescos.', 1000.00, 'Frutas Frescas', '/img/Naranjas.png', 200, TRUE),
('Plátanos Cavendish', 'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético.', 800.00, 'Frutas Frescas', '/img/Platanos.png', 250, TRUE),
('Zanahorias Orgánicas', 'Zanahorias crujientes cultivadas sin pesticidas en la Región de O''Higgins.', 900.00, 'Verduras Orgánicas', '/img/Zanahorias.png', 100, TRUE),
('Espinacas Frescas', 'Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes.', 700.00, 'Verduras Orgánicas', '/img/Espinacas.png', 80, TRUE),
('Pimientos Tricolores', 'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos.', 1500.00, 'Verduras Orgánicas', '/img/Pimientos.png', 120, TRUE),
('Miel Orgánica', 'Miel pura y orgánica producida por apicultores locales.', 5000.00, 'Productos Orgánicos', '/img/Miel.png', 50, TRUE);

-- ============================================
-- INSERTAR USUARIOS
-- ============================================

-- Usuario Administrador
INSERT INTO usuarios (username, email, password, direccion, telefono, rol, activo, fecha_creacion, fecha_actualizacion) VALUES
('admin', 'admin@huertohogar.cl', 'admin123', 'Oficina Central, Santiago', '+56912345678', 'Admin', TRUE, NOW(), NOW());

-- Usuarios de ejemplo
INSERT INTO usuarios (username, email, password, direccion, telefono, rol, activo, fecha_creacion, fecha_actualizacion) VALUES
('usuario', 'usuario@huertohogar.cl', 'usuario123', 'Av. Providencia 123, Santiago', '+56987654321', 'Usuario', TRUE, NOW(), NOW()),
('maria_gonzalez', 'maria.gonzalez@email.com', 'password123', 'Calle Los Aromos 456, Valparaíso', '+56911223344', 'Usuario', TRUE, NOW(), NOW()),
('juan_perez', 'juan.perez@email.com', 'password123', 'Av. Libertador 789, Concepción', '+56955667788', 'Usuario', TRUE, NOW(), NOW()),
('carla_rodriguez', 'carla.rodriguez@email.com', 'password123', 'Pasaje Las Flores 321, La Serena', '+56999887766', 'Usuario', TRUE, NOW(), NOW());

-- ============================================
-- INSERTAR CARRITOS DE EJEMPLO (Opcional)
-- ============================================

-- Carrito para usuario con ID 2 (usuario@huertohogar.cl)
INSERT INTO carritos (usuario_id, activo, fecha_creacion, fecha_actualizacion) VALUES
(2, TRUE, NOW(), NOW());

-- Items del carrito del usuario 2
-- Nota: Los IDs de productos pueden variar, ajusta según los IDs generados
INSERT INTO items_carrito (carrito_id, producto_id, cantidad) VALUES
(1, 1, 2),  -- 2 kg de Manzanas Fuji
(1, 3, 1);  -- 1 kg de Plátanos Cavendish

-- Carrito para usuario con ID 3 (maria_gonzalez)
INSERT INTO carritos (usuario_id, activo, fecha_creacion, fecha_actualizacion) VALUES
(3, TRUE, NOW(), NOW());

-- Items del carrito del usuario 3
INSERT INTO items_carrito (carrito_id, producto_id, cantidad) VALUES
(2, 2, 3),  -- 3 kg de Naranjas Valencia
(2, 4, 2),  -- 2 kg de Zanahorias Orgánicas
(2, 7, 1);  -- 1 frasco de Miel Orgánica

-- ============================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ============================================

-- Contar registros insertados
SELECT 'Productos insertados:' AS tipo, COUNT(*) AS cantidad FROM productos
UNION ALL
SELECT 'Usuarios insertados:', COUNT(*) FROM usuarios
UNION ALL
SELECT 'Carritos insertados:', COUNT(*) FROM carritos
UNION ALL
SELECT 'Items en carritos:', COUNT(*) FROM items_carrito;

-- Mostrar productos
SELECT id, nombre, precio, categoria, stock, activo FROM productos;

-- Mostrar usuarios
SELECT id, username, email, rol, activo FROM usuarios;

-- Mostrar carritos con sus items
SELECT 
    c.id AS carrito_id,
    u.username,
    u.email,
    p.nombre AS producto,
    ic.cantidad,
    (p.precio * ic.cantidad) AS subtotal
FROM carritos c
JOIN usuarios u ON c.usuario_id = u.id
JOIN items_carrito ic ON c.id = ic.carrito_id
JOIN productos p ON ic.producto_id = p.id
ORDER BY c.id, p.nombre;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

